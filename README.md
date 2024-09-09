server-11 Server
This project is a server-side application built using Express.js, MongoDB, and other related technologies. It provides APIs for handling assignments, user authentication, and various features for an educational platform.

## Table of Contents
# Features: 
- User authentication with JWT.
- CRUD operations for assignments.
- Manage assignment submissions.
- Fetch and manage features for the platform.
- Secure API endpoints with token verification.

# Installation
To set up the project locally, follow these steps:
1. Clone the repository:
git clone https://github.com/yourusername/server-11.git
cd server-11
Install dependencies:

2. npm install

3. Create a .env file in the root directory and add the following environment variables:

    PORT=5000
    DB_USER=yourMongoDBUsername
    DB_PASS=yourMongoDBPassword
    ACCESS_TOKEN_SECRET=yourSecretKey
    NODE_ENV=development

4. Start the server: npm start

# Configuration
The project uses environment variables for configuration. Ensure you have a .env file with the necessary variables:

- PORT: The port number for the server.
- DB_USER: Your MongoDB username.
- DB_PASS: Your MongoDB password.
- ACCESS_TOKEN_SECRET: The secret key for JWT.
- NODE_ENV: Set to development or production.

# Usage
Once the server is running, it will be accessible at 
http://localhost:5000. You can interact with the API using a tool like Postman or through your front-end application.

# API Endpoints

- Auth Endpoints
POST /jwt: Generate JWT for user authentication.
POST /logout: Logout the user by clearing the JWT cookie.

- Assignment Endpoints
GET /assignment: Fetch all assignments.
GET /assignment/:id: Fetch a single assignment by ID.
POST /assignment: Create a new assignment.
PUT /assignment/:id: Update an assignment by ID.
DELETE /assignment/:id: Delete an assignment by ID.

- Submission Endpoints
GET /submitPending: Fetch all pending submissions (requires token).
GET /submit/:id: Fetch a single submission by ID (requires token).
GET /submit: Fetch all submissions (requires token).
GET /mySubmit/:email: Fetch submissions for a specific email (requires token).
POST /submit: Create a new submission.
PUT /submit/:id: Update a submission by ID.

- Features Endpoints
GET /features: Fetch all features.

- Root Endpoint
GET /: Base endpoint to check if the server is running.

# Middleware
logger: Logs request method and URL.
verifyToken: Verifies JWT token for protected routes.
