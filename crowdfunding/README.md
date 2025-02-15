# Crowdfunding API

This API provides a sample implementation of a crowdfunding platform. It allows users to sign in, sign up, and manage projects for crowdfunding. The API uses PostgreSQL as the database, Bearer Token for authentication, and Swagger UI for a visual interface.

---

## Features

- **Authentication**: Sign in or sign up users using JWT tokens.
- **Project Management**: View existing projects, upload new ones, and manage project details.
- **Roles**: Supports roles for different users (creator, supporter, admin).

---

## Setup and Initialization

1. **Connect to PostgreSQL**: Ensure the API is linked to a local PostgreSQL database.
2. **Run the API**: Start the API application.
3. **Automatic Data Creation**:
  - The `InitialDataService` class will generate:
    - 3 users: `creator`, `supporter`, and `admin` (passwords are identical to usernames).
    - 3 roles: `ROLE_CREATOR`, `ROLE_SUPPORTER`, and `ROLE_ADMIN`.
    - A few sample projects with random attributes.

---

## Usage Instructions

1. **Access Swagger UI**:
  - Open [http://localhost:9090/swagger-ui/index.html](http://localhost:9090/swagger-ui/index.html) to view and test the API endpoints.

2. **Endpoints**:
  - **Sign In**:  
    Use `POST /api/auth/signin` to log in as either `creator` or `supporter`.  
    After signing in, you will receive a JWT token for authentication.
  - **Sign Up**:  
    Use `POST /api/auth/signup` to register a new user.
  - **View Projects**:  
    Use `GET /api/project` to retrieve all existing projects.
  - **Upload a Project**:  
    Use `POST /api/project` to add a new project.
  - **Update a Project**:  
    Use `PUT /api/project/{id}` to update an existing project.
  - **Delete a Project**:  
    Use `DELETE /api/project/{id}` to remove a project.

---

## Error Handling

### Authentication Errors
- **Class**: `AuthEntryPointJwt`  
  Handles failures when a user attempts to access a protected resource without proper credentials.  
  Sends an HTTP 401 Unauthorized response with the message:  
  **"Error: Unauthorized"**.

### Token Validation
- **Class**: `AuthTokenFilter`  
  Validates JWT tokens on every request:
  - Sets authentication for valid tokens.
  - Logs errors for invalid tokens.
  - Ensures request processing continues even after failed authentication.

### Token Management
- **Class**: `JwtUtils`  
  Creates, parses, and validates JWT tokens:
  - Logs errors for expired or invalid tokens.
  - Returns `false` for invalid tokens to ensure stability.

### Authentication and Registration
- **Class**: `AuthController`
  - **Sign In**:
    - Validates login credentials.
    - Generates JWT tokens for authenticated users.
    - Returns user details.
  - **Sign Up**:
    - Checks for duplicate usernames or emails.
    - Assigns appropriate roles.
    - Encrypts passwords.
    - Saves new users.
    - Handles errors such as duplicate data or missing roles using `MessageResponse`.

---

## Technologies Used

- **Database**: PostgreSQL
- **Authentication**: Bearer Token (JWT)
- **Interface**: Vue.js, Swagger UI

---

## Additional Information

- The application is configured to run on port 9090 as specified in `application.properties`.
- Ensure that the PostgreSQL database is running and accessible with the credentials provided in the `application.properties` file.

---