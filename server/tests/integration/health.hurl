# Health Check Test
GET http://localhost:5001

# We expect an HTTP 1.1 200 response
HTTP/1.1 200

# We expect a non-cacheable response (cache-control header)
Cache-Control: no-cache
