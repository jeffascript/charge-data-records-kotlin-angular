# Build Stage
FROM openjdk:17-jdk-slim AS build
WORKDIR /app
COPY gradle gradle
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .
RUN ./gradlew downloadDependencies

COPY src src
RUN ./gradlew bootJar

# Run Stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
