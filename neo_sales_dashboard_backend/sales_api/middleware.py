from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
import json
import traceback
import logging

logger = logging.getLogger(__name__)

class APIErrorMiddleware(MiddlewareMixin):
    """
    Middleware to ensure consistent error handling for all API responses.
    This catches any unhandled exceptions that might occur in the API views
    and formats them according to our standard error response format.
    """
    
    def process_exception(self, request, exception):
        """
        Process exceptions raised during request processing.
        Returns a JsonResponse with a standardized error format.
        """
        # Log the exception for debugging purposes
        logger.error(f"Unhandled exception: {str(exception)}")
        logger.error(traceback.format_exc())
        
        # Only handle API requests (those starting with /api/)
        if not request.path.startswith('/api/'):
            return None
        
        # Create a standardized error response
        error_response = {
            "error": {
                "code": "server_error",
                "message": "An unexpected error occurred."
            }
        }
        
        # Return a JSON response with a 500 status code
        return JsonResponse(error_response, status=500)