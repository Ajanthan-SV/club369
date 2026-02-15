from django.contrib.auth import login, logout
from rest_framework import status, generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.utils import timezone
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Membership, Payment, TransactionLedger, Voucher, UserVoucher, AdminActivityLog
from .serializers import (
    UserSerializer, RegisterSerializer, 
    MembershipSerializer, PaymentSerializer, TransactionLedgerSerializer, 
    VoucherSerializer, UserVoucherSerializer, AdminActivityLogSerializer,
    MembershipDetailSerializer, AdminVoucherSerializer
)
from django.conf import settings

# --- Authentication ---


class LoginView(TokenObtainPairView):
    """
    Detailed Login Phase:
    1. Validates credentials.
    2. establishes Django session via login().
    3. Generates JWT tokens.
    4. Bridges tokens via request.session['jwt_tokens'].
    5. Returns non-sensitive user metadata.
    """
    def post(self, request, *args, **kwargs):
        # 1. Validation (Internal to TokenObtainPairView serializer)
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = serializer.user

        # 2. User Session Creation
        login(request, user)

        # 3. Token Generation
        refresh = RefreshToken.for_user(user)
        
        # 4. Session Bridging
        request.session['jwt_tokens'] = {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }

        # 5. View Response (Metadata only)
        user_data = UserSerializer(user).data
        return Response(user_data, status=status.HTTP_200_OK)

class CustomTokenRefreshView(TokenRefreshView):
    """
    Token Refresh Phase:
    1. Reads refresh_token from cookies.
    2. Validates and rotates tokens.
    3. Bridges tokens via session.
    """
    def post(self, request, *args, **kwargs):
        # 1. Token Discovery
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        
        if not refresh_token:
            return Response({"error": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Inject into request data for parent view
        request.data['refresh'] = refresh_token
        
        # 2 & 3. Validation and Rotation (via parent view)
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # 4. Session Re-Bridging
            request.session['jwt_tokens'] = {
                'access': response.data.get('access'),
                'refresh': response.data.get('refresh')
            }
            # 5. Success Response
            return Response({"message": "Tokens refreshed successfully"}, status=status.HTTP_200_OK)
        
        return response

class LogoutView(views.APIView):
    """
    Logout Phase:
    1. Destroys Django session.
    2. Instructs browser to delete cookies.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # 1. Session Invalidation
        logout(request)

        # 2. Cookie Deletion
        response = Response({'status': 'Logged out successfully'}, status=status.HTTP_200_OK)
        
        cookie_settings = {
            'path': settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/'),
            'domain': settings.SIMPLE_JWT.get('AUTH_COOKIE_DOMAIN'),
            'samesite': settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE'),
        }

        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'], **cookie_settings)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], **cookie_settings)
        
        return response

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

# --- Membership & Payments ---

class CreatePaymentView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @transaction.atomic
    def post(self, request):
        user = request.user
        # Allow users with 'PENDING' or 'ACTIVE' status (standard renewals)
        if user.status not in ['PENDING', 'ACTIVE']:
            return Response({'error': f'User account status {user.status} does not allow payments'}, status=status.HTTP_403_FORBIDDEN)

        current_date = timezone.now().date()
        
        # Check for existing active membership
        existing_membership = Membership.objects.filter(user=user, status='ACTIVE').order_by('-end_date').first()
        
        start_date = current_date
        
        if existing_membership:
            # Rule 1: Renewal Window Enforcement (5 days before end_date)
            renewal_allowed_date = existing_membership.end_date - timezone.timedelta(days=5)
            
            if current_date < renewal_allowed_date:
                return Response(
                    {"error": "Membership already active or payment already processed"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Rule 2: Duplicate Payment Protection
            # Check if a successful payment already exists for the renewal of this membership
            # (i.e., a membership starting after the current one)
            if Membership.objects.filter(user=user, start_date=existing_membership.end_date + timezone.timedelta(days=1)).exists():
                 return Response(
                    {"error": "Membership already active or payment already processed"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Renewal Flow: new_start_date = current_end_date + 1
            start_date = existing_membership.end_date + timezone.timedelta(days=1)

        data = request.data
        membership_data = data.get('membership', {})
        payment_data = data.get('payment', {})

        # Create Membership
        # Default duration is 30 days as per renewal logic instruction
        end_date = start_date + timezone.timedelta(days=30)
        
        membership = Membership.objects.create(
            user=user,
            plan_name=membership_data.get('plan_name', 'Standard Renewal'),
            amount=membership_data.get('amount', 0),
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        # Create Payment
        payment = Payment.objects.create(
            user=user,
            membership=membership,
            amount=payment_data.get('amount', 0),
            payment_mode=payment_data.get('payment_mode', 'UPI'),
            transaction_id=payment_data.get('transaction_id'),
            payment_status='SUCCESS', # Mock successful payment for MVP
            paid_at=timezone.now()
        )

        # Create Ledger Entry
        TransactionLedger.objects.create(
            payment=payment,
            user=user,
            amount=payment.amount,
            transaction_type='CREDIT',
            description=f"Membership payment for {membership.plan_name}"
        )

        # Update user status to ACTIVE if it was PENDING
        if user.status == 'PENDING':
            user.status = 'ACTIVE'
            user.save()

        return Response({
            'status': 'Payment processed successfully', 
            'membership_id': membership.id,
            'start_date': start_date,
            'end_date': end_date
        })

class MembershipDetailView(generics.RetrieveAPIView):
    serializer_class = MembershipDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        membership = Membership.objects.filter(user=self.request.user, status='ACTIVE').order_by('-end_date').first()
        if not membership:
            # Fallback to expired if no active exists
            membership = Membership.objects.filter(user=self.request.user).order_by('-end_date').first()
        return membership

class UserTransactionListView(generics.ListAPIView):
    serializer_class = TransactionLedgerSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return TransactionLedger.objects.filter(user=self.request.user).order_by('-transaction_date')

# --- Vouchers ---


class VoucherListView(generics.ListAPIView):
    queryset = Voucher.objects.filter(is_active=True)
    serializer_class = VoucherSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ClaimVoucherView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, voucher_id):
        try:
            voucher = Voucher.objects.get(id=voucher_id, is_active=True)
            
            # Check if already claimed
            if UserVoucher.objects.filter(user=request.user, voucher=voucher).exists():
                return Response({'error': 'Voucher already claimed'}, status=status.HTTP_400_BAD_REQUEST)

            UserVoucher.objects.create(user=request.user, voucher=voucher)
            serializer = VoucherSerializer(voucher, context={'request': request})
            return Response(serializer.data)
        except Voucher.DoesNotExist:
            return Response({'error': 'Voucher not found'}, status=status.HTTP_404_NOT_FOUND)

# --- Admin Dashboards ---

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        return User.objects.exclude(is_superuser=True).exclude(is_staff=True).exclude(id=self.request.user.id)

class AdminTransactionListView(generics.ListAPIView):
    queryset = TransactionLedger.objects.all()
    serializer_class = TransactionLedgerSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if start_date and end_date:
            queryset = queryset.filter(transaction_date__range=[start_date, end_date])
        return queryset

class AdminCollectionsView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        last_30_days = timezone.now() - timezone.timedelta(days=30)
        total = Payment.objects.filter(
            payment_status='SUCCESS', 
            paid_at__gte=last_30_days
        ).aggregate(models.Sum('amount'))['amount__sum'] or 0
        
        return Response({'total_last_30_days': total})

class AdminVoucherListView(generics.ListAPIView):
    queryset = Voucher.objects.all().order_by('-created_at')
    serializer_class = AdminVoucherSerializer
    permission_classes = (permissions.IsAdminUser,)

class AdminVoucherCreateView(generics.CreateAPIView):
    queryset = Voucher.objects.all()
    serializer_class = AdminVoucherSerializer
    permission_classes = (permissions.IsAdminUser,)

    def perform_create(self, serializer):
        # Default valid_from to now if not provided
        if 'valid_from' not in serializer.validated_data:
            serializer.save(valid_from=timezone.now())
        else:
            serializer.save()

class AdminVoucherToggleView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def patch(self, request, pk):
        try:
            voucher = Voucher.objects.get(pk=pk)
            voucher.is_active = not voucher.is_active
            voucher.save()
            return Response({'status': 'Voucher status updated', 'is_active': voucher.is_active})
        except Voucher.DoesNotExist:
            return Response({'error': 'Voucher not found'}, status=status.HTTP_404_NOT_FOUND)
class AdminVoucherDeleteView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def delete(self, request, pk):
        try:
            voucher = Voucher.objects.get(pk=pk)
            voucher.delete()
            return Response({'status': 'Voucher deleted'})
        except Voucher.DoesNotExist:
            return Response({'error': 'Voucher not found'}, status=404)
