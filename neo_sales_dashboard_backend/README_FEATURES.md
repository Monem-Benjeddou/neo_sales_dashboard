# Neo Sales Dashboard - New Features

## 1. Caching Implementation

Caching has been implemented for the `/api/dashboard/kpis/` endpoint to improve performance. The cache is set to expire after 10 minutes.

### Implementation Details

- Using Django's built-in caching framework with Redis as the backend
- Cache timeout: 10 minutes (600 seconds)
- The cache is applied at the view level using the `@cache_page` decorator

### Configuration

The Redis cache is configured in `settings.py`:

```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://0.0.0.0:6379/1',  # Adjust host/port/DB as needed
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'TIMEOUT': 600,  # 10 minutes (60 seconds * 10)
    }
}
```

### Usage

The caching is transparent to API consumers. The first request to the endpoint will be processed normally, and subsequent requests within the 10-minute window will be served from the cache.

## 2. Consistent Error Handling

A standardized error response format has been implemented across the entire API to ensure consistency.

### Error Response Format

All API errors now follow this standard format:

```json
{
    "error": {
        "code": "error_code",
        "message": "Human-readable error message",
        "details": {} // Optional additional error details
    }
}
```

### Implementation Components

1. **Custom Exception Handler**: Intercepts and formats all DRF exceptions
2. **API Error Middleware**: Catches unhandled exceptions in API views
3. **Response Utilities**: Helper functions for creating consistent responses

### Usage

#### Using the Response Utilities

For successful responses:

```python
from sales_api.utils.response_utils import api_response

# In your view
return api_response(
    data=your_data,
    message="Optional success message"
)
```

For error responses:

```python
from sales_api.utils.response_utils import error_response

# In your view
return error_response(
    message="Error message",
    status_code=status.HTTP_400_BAD_REQUEST,
    code="custom_error_code",  # Optional
    details={"field": "Error details"}  # Optional
)
```

#### Error Handling in Try/Except Blocks

```python
try:
    # Your code here
    return api_response(data=result)
except Exception as e:
    return error_response(
        message=f"Operation failed: {str(e)}",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
```

### Benefits

- Consistent error format across the entire API
- Improved error messages for API consumers
- Easier debugging with standardized error codes
- Better separation of concerns with utility functions