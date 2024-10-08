# 1. POST request,reseed db
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

# 2. return 200, Delete known short via short id
DELETE http://localhost:5001/v1/urls/{{short_id}}
HTTP/1.1 200

# 3. return 404 , Delete short id that does not exist
DELETE http://localhost:5001/v1/urls/fake-short-id
HTTP/1.1 404

# Note: Clean up is not needed