#!/bin/bash

# Define the MongoDB URI and Database
MONGO_URI="mongodb://localhost:27017"  # Use 'mongo' as the host to match the service name
DB_NAME="url_shortner"
COLLECTION_NAME="shorturls"  # Define the collection name variable

# Function to check if MongoDB is up
check_mongo_connection() {
  # Attempt to connect to MongoDB and ping the server
  if mongosh "$MONGO_URI" --eval "db.adminCommand({ ping: 1 })" &> /dev/null; then
    return 0
  else
    echo "MongoDB connection failed."
    return 1
  fi
}


# Wait for MongoDB to be ready
until check_mongo_connection; do
  echo "Waiting for MongoDB to be available..."
  sleep 5
done

echo "MongoDB connection successful!"

# Create the collections and initial data
mongosh "$MONGO_URI/$DB_NAME" --eval "
  db = db.getSiblingDB('$DB_NAME'); // Switch to the 'url_shortner' database

  // Create collections if they don't exist
  db.createCollection('$COLLECTION_NAME');
  db.createCollection('users');

  // Insert initial data if the collections are empty
  if (db.$COLLECTION_NAME.countDocuments() === 0) {
    db.$COLLECTION_NAME.insertMany([
      { full: 'http://example.com', short: 'abc123', clicks: 0, user:'123' },
      { full: 'http://example.org', short: 'def456', clicks: 0 }
    ]);
  }

  print('Initialization script ran successfully.');
" || {
  echo "Failed to initialize MongoDB."
  exit 1
}
