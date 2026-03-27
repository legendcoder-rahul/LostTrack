# Lost and Found Backend - Spring Boot API

A RESTful API backend for the Lost and Found System built with Spring Boot, Spring Security, JWT authentication, and MySQL.

## Features

- User Authentication (Register & Login)
- JWT Token-based Authorization
- Secure Password Encryption (BCrypt)
- CORS Support
- Validation & Error Handling
- MySQL Database Integration
- Spring Data JPA for ORM

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Git

## Installation & Setup

### 1. Clone or Extract the Project

```bash
cd Backend
```

### 2. Create MySQL Database

```sql
CREATE DATABASE lost_found_db;
USE lost_found_db;
```

### 3. Update Database Configuration

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lost_found_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. JWT Secret Configuration

Update the JWT secret in `application.properties`:

```properties
app.jwtSecret=yourSecretKeyHereChangeThisInProductionEnvironmentWithVeryLongRandomString123456789
```

⚠️ **Important**: Change this to a strong secret key in production!

### 5. Install Dependencies & Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start at `http://localhost:8080/api`

## API Endpoints

### Authentication

#### Register
- **Endpoint**: `POST /api/auth/register`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

- **Response** (201):
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER",
  "message": "User registered successfully"
}
```

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER",
  "message": "Logged in successfully"
}
```

#### Health Check
- **Endpoint**: `GET /api/health`
- **Response** (200): `Backend is running...`

## Authentication

Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```
Backend/
├── src/main/java/com/lostfound/
│   ├── controller/
│   │   └── AuthController.java
│   ├── service/
│   │   └── AuthService.java
│   ├── entity/
│   │   ├── User.java
│   │   └── UserRole.java
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── AuthResponse.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   └── JwtAuthenticationFilter.java
│   ├── config/
│   │   └── SecurityConfig.java
│   └── LostFoundApplication.java
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── README.md
```

## Technologies Used

- **Spring Boot 3.1.5** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - ORM
- **JWT (jjwt)** - Token Generation & Validation
- **MySQL** - Database
- **Lombok** - Boilerplate Reduction
- **Validation** - Input Validation

## Configuration

### CORS
Configure allowed origins in `SecurityConfig.java` to enable requests from your frontend:

```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
```

### Database Profiles
Switch between development and production configurations:

```bash
# Development
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Production
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

## Security Best Practices

1. ✅ Use strong JWT secrets in production
2. ✅ Never commit secrets to version control
3. ✅ Use HTTPS in production
4. ✅ Implement rate limiting for auth endpoints
5. ✅ Use environment variables for sensitive data
6. ✅ Regularly update dependencies

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Verify database credentials in `application.properties`
- Check if the database exists: `CREATE DATABASE lost_found_db;`

### Port Already in Use
```bash
# Change server port in application.properties
server.port=8081
```

### JWT Token Expires
- Adjust expiration time in `application.properties`:
```properties
app.jwtExpirationMs=86400000 # 24 hours
```

## Next Steps

1. Implement Lost/Found Item endpoints
2. Add image upload functionality
3. Implement notification system
4. Add API documentation (Swagger/SpringDoc)
5. Add comprehensive logging
6. Write unit and integration tests

## Support & Contributing

For issues or questions, please refer to the project documentation or create an issue.

---

**Happy Coding!** 🚀
