# E-Mobility Charging Platform

## Overview

This repository contains the source code for an e-mobility charging solutions platform. The project provides a REST API and an Angular App capable of managing Charge Data Records (CDR) in real time for a network of Charge Point Operators (CPO).

## Features

- User authentication (login/register) for both Admin and User roles
- Real-time display of charging records
- Ability to add new charging records (admin only)
- Sorting and filtering of charging data
- Offline functionality with local storage
- Server status monitoring
- Run independently with seeded mock JSON depending on whether the backend service is running or not - same for login & signup

## Technologies Used

- Angular 18
- NgRx Signals for state management
- Angular Material for UI components
- RxJS for reactive programming
- Docker for containerization
- Kotlin and Spring Boot for the backend

## Prerequisites

- Node.js (v18.19.1 or later - use nvm to toggle)
- npm (v6 or later)
- Docker (optional, for containerized deployment)
- Java 17 or later (for backend)
- Gradle 6.x or later (for backend)



## Running the Application

### Development server

#### Frontend

```shell
 cd client
 npm install && npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

#### Backend

Run the backend using Docker:
```shell
cd api
docker compose up -d --build
```
or

Run the backend using Gradle:
```
cd api
chmod +x run.sh && ./run.sh
```

> **Note:** Additional documentation is available in the `api` and `client` directories.


## Design Patterns

### Frontend

- **Repository Pattern**: The application uses the Repository pattern to abstract the data layer. This is implemented in the `ChargeDataService` which acts as a mediator between the data source (API or local storage) and the rest of the application.
- **Observable Pattern**: RxJS Observables are used extensively for handling asynchronous operations and data streams, providing a reactive approach to managing state and user interactions.
- **Dependency Injection**: Angular's built-in dependency injection system is used throughout the application to manage component and service dependencies, promoting loose coupling and easier testing.

### Backend

- **Repository Pattern**: The `ChargeDataRecordRepository` interface and its implementation separate the data access logic from the business logic, promoting code reusability and testability.
- **Service Layer Pattern**: The `ChargeDataRecordService` encapsulates the business logic related to charge data records, providing a clear separation of concerns.
- **Controller Layer Pattern**: The `ChargeDataRecordController` handles HTTP requests and delegates the processing to the service layer, following the principles of the Model-View-Controller (MVC) pattern.
- **Dependency Injection**: Spring's dependency injection mechanism is used to manage the dependencies between components, promoting loose coupling and easier testability.

## Known Issues

1. Offline mode may not sync properly with the server when connection is restored.
2. Some UI elements may not be fully responsive on smaller screen sizes.
3. Error handling for network issues could be improved.
4. There is a known issue with the authentication mechanism where the token expiration is not properly handled.
5. The error handling and validation mechanisms are currently basic and need to be improved for better user experience and security.
6. The database seeding mechanism is currently basic and needs to be improved for better user experience and security.
7. Testing is currently limited to manual testing ... would add test case with JUnit or Mockito.
8. Document API Using Swagger (OpenAPI)

## Future Improvements

1. Implement data synchronization for offline mode.
2. Enhance error handling and user feedback.
3. Add more comprehensive e2e tests.
4. Improve accessibility features.
5. Improve database seeding mechanism.
6. Add automated tests using JUnit or Mockito.
7. Document API using Swagger (OpenAPI).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Contributing:

We welcome contributions! Please read our Contributing Guidelines before submitting a pull request.
 