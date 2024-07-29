# E-Mobility Charging Backend

This is the backend component of the E-Mobility Charging application, built using Kotlin and Spring Boot. It provides a RESTful API for managing charge data records and user authentication.


## Design Patterns

This project follows the following design patterns:

- **Repository Pattern**: The `ChargeDataRecordRepository` interface and its implementation separate the data access logic from the business logic, promoting code reusability and testability.
- **Service Layer Pattern**: The `ChargeDataRecordService` encapsulates the business logic related to charge data records, providing a clear separation of concerns.
- **Controller Layer Pattern**: The `ChargeDataRecordController` handles HTTP requests and delegates the processing to the service layer, following the principles of the Model-View-Controller (MVC) pattern.
- **Dependency Injection**: Spring's dependency injection mechanism is used to manage the dependencies between components, promoting loose coupling and easier testability.


## Getting Started


### Prerequisites

- Java 17 or later
- Gradle 6.x or later
- Docker running on your machine

### Building and Running

---
- #### OPTION 1 - Docker and Docker Compose (Most Recommended)

At the root of this repo, `api`, Build and run the Docker images. 

```
docker compose up -d --build
```

This will build the backend and the database images, as well as Seed Mockdata into the `postgres`db


To gracefully shut it down and remove volumes.

```
docker compose down -v
```
 ---

- #### OPTION 2 - Locally (as a standalone application - least recommended)

```
chmod +x run.sh && ./run.sh
```


### Accessing the API

Once the API is running, you can access it at:

```
http://localhost:8080/api/v1/**
```

 

## API Endpoints

This Backend service is exposed at `/api/v1/`. Here are the available endpoints:

### Authentication

- **POST /api/v1/auth/login**: Authenticate a user and obtain a JWT token.
    - Request body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "string" }`

- **POST /api/v1/auth/register**: Register a new user.
  - Request body: `{ "username": "string", "password": "string", "roles": ["string"] }`
  - Response: User registered successfully!
  - roles: `ROLE_USER` or `ROLE_ADMIN`

### Charge Data Records

- **POST /api/v1/charge-data-records**: Create a new charge data record (requires ROLE_ADMIN).
  - Request body:
 ```json
 {
   "chargingSessionId": "string",
   "vehicleId": "string",
   "startTime": "2023-05-05T11:00:00",
   "endTime": "2023-05-05T13:30:00",
   "totalCost": 17.50
 }
 ```
    
    Response: The created charge data record object.

- **GET /api/v1/charge-data-records**: Retrieve a list of all charge data records (requires ROLE_USER).
  - Response: An array of charge data record objects.

- **GET /api/v1/charge-data-records/{id}**: Retrieve a specific charge data record by ID (requires ROLE_USER).
  - Response: The charge data record object with the specified ID.

### Server Status

- **GET /api/v1/auth/alive**: Check if the server is alive and connected.
  - Response: 200 OK if the server is alive.

Note: All endpoints except for login and register require a valid JWT token in the Authorization header.

## API CONSTRAINTS

- **JWT TOKEN**: The JWT token is generated by the server and sent to the client. It is used to authenticate the user and authorize the access to the API.
- **USERNAME**: The username must be unique and cannot be empty.
- **PASSWORD**: The password must be at least 8 characters long and cannot be empty.
- **ROLE**: The role must be either `ROLE_USER` or `ROLE_ADMIN`.
- **START TIME**: The start time must be a valid ISO-8601 date-time string.
- **END TIME**: The end time must be a valid ISO-8601 date-time string.
- **TOTAL COST**: The total cost must be a valid decimal number.
- The **END TIME** cannot be smaller than **START TIME**
- The **START TIME** of an upcoming Charge Data Record for a particular vehicle must always be bigger than the **END TIME** of any previous Charge Data Records.
- The **TOTAL COST** must be greater than 0



## Known Issues

- **Issue 1**: 
  - There is a known issue with the authentication mechanism where the token expiration is not properly handled. This will be addressed in a future release.
- **Issue 2**:
  - The error handling and validation mechanisms are currently basic and need to be improved for better user experience and security.
- **Issue 3**: 
  - The database seeding mechanism is currently basic and needs to be improved for better user experience and
    security.
- **Issue 4**: 
  - Testing is currently limited to manual testing ... would add test case with JUnit or Mockito.
- **Issue 5**: 
  - Document API Using Swagger (OpenAPI)