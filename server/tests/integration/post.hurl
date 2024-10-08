# POST request, anon submission
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

[Captures]
short_id: jsonpath "$.short"

[Asserts]
jsonpath "$.full" == "https://www.youtube.com/watch?v=dYkD9qJW-uU"
jsonpath "$.short" isString
jsonpath "$.user" == null

# Clean up
DELETE http://localhost:5001/v1/urls/{{short_id}}
HTTP/1.1 200