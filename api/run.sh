#!/bin/bash

# Verify the Java version( Java 17 or newer)
java -version

# Set project directory
PROJECT_DIR="$(pwd)"

# Build the project
echo "Building the project..."
./gradlew clean build

# Find the JAR file
JAR_FILE=$(find "$PROJECT_DIR/build/libs" -name "*.jar" -type f)

# Run the application
if [ -n "$JAR_FILE" ]; then
    echo "Running the application..."
    java -jar "$JAR_FILE"
else
    echo "No JAR file found in $PROJECT_DIR/build/libs"
    exit 1
fi