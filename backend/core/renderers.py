from rest_framework.renderers import JSONRenderer

class StandardizedJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response')
        
        # Determine success based on status code
        success = response.status_code < 400
        
        # Standardize message
        message = ""
        if isinstance(data, dict):
            # Only pop 'message'. For 'status', just use it as a fallback if message is empty, 
            # but don't remove it from the data block as it might be important domain data (like user account status).
            message = data.pop('message', "")
            if not message:
                message = data.get('status', "")
                
            if not message and not success:
                message = data.get('error', data.get('detail', "An error occurred"))
        elif isinstance(data, list) and not success:
            if data and isinstance(data[0], str):
                message = data[0]
            else:
                message = "Validation error occurred"
        elif isinstance(data, str) and not success:
            message = data
        
        # Extract errors if not success
        errors = None
        if not success:
            errors = data
            if isinstance(data, dict) and ('error' in data or 'detail' in data):
                # If it's a simple error message, we already have it in 'message'
                pass
        
        standardized_data = {
            'success': success,
            'message': str(message),
            'data': data if success else None,
            'errors': errors if not success else None
        }
        
        return super().render(standardized_data, accepted_media_type, renderer_context)
