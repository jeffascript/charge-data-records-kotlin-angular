# E-Mobility Charging Platform

## Overview

This project is an Angular-based application for managing e-mobility charging solutions. It provides a platform for handling Charge Data Records (CDR) in real-time for a network of Charge Point Operators (CPO).

## Features

- User authentication (login/register) for both Admin and User roles
- Real-time display of charging records
- Ability to add new charging records (admin only)
- Sorting and filtering of charging data
- Offline functionality with local storage
- Server status monitoring
- Run independently with seeded mock json depending on whether the backend service is running or not - same for login & signup

## Technologies Used

- Angular 18
- NgRx Signals for state management
- Angular Material for UI components
- RxJS for reactive programming
- Docker for containerization

## Prerequisites

- Node.js (v18.19.1 or later - use nvm to toggle)
- npm (v6 or later)
- Docker (optional, for containerized deployment)

## Installation

1. Navigate to the Project root directory:

````
cd client
````
2. Install dependencies

````
npm install
````

## Running the Application

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Production build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Docker

To run the application using Docker:

1. Build the Docker image:

````
docker build -t charging-app .
````

2. Start the Docker container:

````
docker run -p 4201:4200 charging-app
````
Navigate to `http://localhost:4201/`. 



## Backend (API endpoints)

- check the README of `api` repo 

## Testing

### Running unit tests

Run locally: 

    ng test
     
 to execute the unit tests via [Karma](https://karma-runner.github.io).

 

## Design Patterns

### Repository Pattern

The application uses the Repository pattern to abstract the data layer. This is implemented in the `ChargeDataService` which acts as a mediator between the data source (API or local storage) and the rest of the application.

### Observable Pattern

RxJS Observables are used extensively for handling asynchronous operations and data streams, providing a reactive approach to managing state and user interactions.

### Dependency Injection

Angular's built-in dependency injection system is used throughout the application to manage component and service dependencies, promoting loose coupling and easier testing.

## Known Issues

1. Offline mode may not sync properly with the server when connection is restored.
2. Some UI elements may not be fully responsive on smaller screen sizes.
3. Error handling for network issues could be improved.

## Future Improvements

1. Implement data synchronization for offline mode.
2. Enhance error handling and user feedback.
3. Add more comprehensive e2e tests.
4. Improve accessibility features.

 
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


----

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.



 
## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
