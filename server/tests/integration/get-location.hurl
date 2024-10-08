# 1. POST request, reseed db
POST http://localhost:5001/v1/urls
Content-Type: application/json

{
    "full": "https://www.youtube.com/watch?v=dYkD9qJW-uU"
}

HTTP/1.1 201

[Asserts]
jsonpath "$.full" == "https://www.youtube.com/watch?v=dYkD9qJW-uU"
jsonpath "$.short" isString
jsonpath "$.user" == null
jsonpath "$.clicks" == 0

[Captures]
short_id: jsonpath "$.short"
init_clicks: jsonpath "$.clicks"

# 2. GET via short id from unknown location
GET http://localhost:5001/v1/urls/{{short_id}}
HTTP/1.1 200

[Asserts]
jsonpath "$.shortUrl.short" == {{short_id}}
jsonpath "$.shortUrl.clicks" == 1
jsonpath "$.shortUrl.accessed" exists
jsonpath "$.shortUrl.accessed['N/A']" exists
jsonpath "$.shortUrl.accessed['N/A']" == 1

# 2. GET via short id from CA location
GET http://localhost:5001/v1/urls/{{short_id}}
X-Forwarded-For: 104.143.8.255
HTTP/1.1 200

[Asserts]
jsonpath "$.shortUrl.short" == {{short_id}}
jsonpath "$.shortUrl.clicks" == 2 # 2 becuase it was accessed in previous call
jsonpath "$.shortUrl.accessed" exists
jsonpath "$.shortUrl.accessed['N/A']" exists
jsonpath "$.shortUrl.accessed['N/A']" == 1
jsonpath "$.shortUrl.accessed['CA']" exists
jsonpath "$.shortUrl.accessed['CA']" == 1 

# Clean up
DELETE http://localhost:5001/v1/urls/{{short_id}}
HTTP/1.1 200
