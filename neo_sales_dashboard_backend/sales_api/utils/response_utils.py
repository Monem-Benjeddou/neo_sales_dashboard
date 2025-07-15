from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.utils import IntegrityError
from django.http import Http404


def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent API error responses.

    Returns a Response with a standardized error format:
    {
        "error": {
            "code": "error_code",
            "message": "Human-readable error message",
            "details": {} # Optional additional error details
        }
    }
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # If response is None, it's an unhandled exception
    if response is None:
        if isinstance(exc, DjangoValidationError):
            data = {
                "error": {
                    "code": "validation_error",
                    "message": "Validation error occurred.",
                    "details": exc.message_dict if hasattr(exc, 'message_dict') else {'non_field_errors': [str(exc)]}
                }
            }
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        elif isinstance(exc, IntegrityError):
            data = {
                "error": {
                    "code": "integrity_error",
                    "message": "Database integrity error occurred.",
                    "details": {"error": str(exc)}
                }
            }
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        elif isinstance(exc, Http404):
            data = {
                "error": {
                    "code": "not_found",
                    "message": "The requested resource was not found."
                }
            }
            return Response(data, status=status.HTTP_404_NOT_FOUND)

        # For any other unhandled exceptions, return a 500 error
        data = {
            "error": {
                "code": "server_error",
                "message": "An unexpected error occurred."
            }
        }
        return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # For handled exceptions, standardize the response format
    if hasattr(response, 'data'):
        error_data = {
            "error": {
                "code": get_error_code_from_status(response.status_code),  # Using existing utility
                "message": get_error_message_from_status(response.status_code),  # Using existing utility
            }
        }

        # Add details if available
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                error_data["error"]["details"] = {"detail": response.data["detail"]}
            else:
                error_data["error"]["details"] = response.data

        response.data = error_data

    return response


# --- Your existing utility functions below ---

def api_response(data=None, message=None, status_code=status.HTTP_200_OK, errors=None):
    """
    Utility function to standardize API responses.

    Args:
        data (dict, optional): The data to be returned in the response.
        message (str, optional): A message to be included in the response.
        status_code (int, optional): The HTTP status code for the response.
        errors (dict, optional): Any errors to be included in the response.

    Returns:
        Response: A standardized DRF Response object.
    """
    response_data = {}

    if data is not None:
        response_data.update(data)

    if message:
        response_data['message'] = message

    if errors:
        response_data['error'] = {
            'code': get_error_code_from_status(status_code),
            'message': message or get_error_message_from_status(status_code),
            'details': errors
        }

    return Response(response_data, status=status_code)


def error_response(message, status_code=status.HTTP_400_BAD_REQUEST, code=None, details=None):
    """
    Utility function to create standardized error responses.
    """
    if not code:
        code = get_error_code_from_status(status_code)

    error_data = {
        'error': {
            'code': code,
            'message': message
        }
    }

    if details:
        error_data['error']['details'] = details

    return Response(error_data, status=status_code)


def get_error_code_from_status(status_code):
    """
    Map status codes to error codes.
    """
    status_code_map = {
        400: "bad_request",
        401: "unauthorized",
        403: "forbidden",
        404: "not_found",
        405: "method_not_allowed",
        406: "not_acceptable",
        409: "conflict",
        415: "unsupported_media_type",
        429: "too_many_requests",
        500: "server_error",
    }

    return status_code_map.get(status_code, f"error_{status_code}")


def get_error_message_from_status(status_code):
    """
    Map status codes to human-readable error messages.
    """
    status_code_map = {
        400: "The request was invalid or cannot be served.",
        401: "Authentication is required and has failed or has not been provided.",
        403: "You do not have permission to perform this action.",
        404: "The requested resource was not found.",
        405: "The method is not allowed for the requested URL.",
        406: "The requested resource is capable of generating only content not acceptable.",
        409: "The request could not be completed due to a conflict with the current state of the resource.",
        415: "The media type of the request data is not supported by the server.",
        429: "Too many requests have been sent in a given amount of time.",
        500: "An unexpected error occurred on the server.",
    }

    return status_code_map.get(status_code, f"An error occurred with status code {status_code}.")