# 1. POST request, reseed db
POST http://localhost:5001/v1/urls
Content-Type: application/json

{
    "full":"https://www.youtube.com/watch?v=dYkD9qJW-uU"
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

# 2. GET via short id
GET http://localhost:5001/v1/urls/{{short_id}}
HTTP/1.1 200

[Asserts]
jsonpath "$.shortUrl.short" == {{short_id}}
jsonpath "$.shortUrl.clicks" == 1

# 3. GET, return 404 if the given short id does not exist
GET http://localhost:5001/v1/urls/fake-short-url
HTTP/1.1 404

# 5. GET, all urls
GET http://localhost:5001/v1/urls
HTTP/1.1 200


# Clean up
DELETE http://localhost:5001/v1/urls/{{short_id}}
HTTP/1.1 200