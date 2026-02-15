import api from '../utils/api'; // Ensure this points to your axios instance

export const PaymentService = {
    loadRazorpay: (src: string): Promise<boolean> => {
        return new Promise((resolve) => {
            if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    },

    // Step 1: Tell Django to create a secure order
    createOrder: async () => {
        return await api.post('/payments/create-order/');
    },

    // Step 2: Send the signature back to Django for verification
    verifyPayment: async (verificationData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) => {
        return await api.post('/payments/verify/', verificationData);
    },

    // Unified flow to handle everything from order creation to verification
    handlePayment: async (options: {
        onSuccess: (verifyRes: any) => void;
        onDismiss: () => void;
        onError: (error: any) => void;
        prefill?: {
            name?: string;
            email?: string;
            contact?: string;
        }
    }) => {
        try {
            // 1. Ensure SDK is loaded
            const isLoaded = await PaymentService.loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
            if (!isLoaded) {
                throw new Error("Razorpay SDK failed to load.");
            }

            // 2. Create Order
            const orderResponse = await PaymentService.createOrder();
            const { id: order_id, amount, currency } = orderResponse;

            // 3. Setup Razorpay Options
            const rzpOptions = {
                key: (process.env as any).REACT_APP_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "CLUB369",
                description: "Obsidian Monthly Subscription",
                order_id: order_id,
                prefill: options.prefill,
                handler: async (response: any) => {
                    try {
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };
                        const verifyRes = await PaymentService.verifyPayment(verificationData);
                        options.onSuccess(verifyRes);
                    } catch (error: any) {
                        options.onError(error);
                    }
                },
                modal: {
                    ondismiss: options.onDismiss
                },
                theme: {
                    color: "#8b5cf6"
                }
            };

            // 4. Open Modal
            const rzp = new (window as any).Razorpay(rzpOptions);
            rzp.open();

        } catch (error: any) {
            options.onError(error);
        }
    }
};