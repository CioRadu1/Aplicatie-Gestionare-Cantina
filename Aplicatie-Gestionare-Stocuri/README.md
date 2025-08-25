# Cantina Management System - Backend

Spring Boot backend application for the cafeteria management system.

## Prerequisites

- **Java 17** or higher
- **Maven** (included with the project)
- **SQL Server** database

## Quick Setup

### 1. Install Java 17
- **Windows**: Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
- **macOS**: `brew install openjdk@17`
- **Linux**: `sudo apt install openjdk-17-jdk`

### 2. Run the Application

```bash
# Navigate to the backend folder
cd Aplicatie-Gestionare-Stocuri

# Run with Maven (Windows)
mvnw.cmd spring-boot:run

# Run with Maven (Linux/Mac)
chmod +x mvnw
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## Database

The database is already configured in `application.properties` and connects to an Azure SQL Server database.

## Build for Production

```bash
# Windows
mvnw.cmd clean package

# Linux/Mac
chmod +x mvnw
./mvnw clean package
```

The JAR file will be created in the `target` folder.

## Frontend Integration

The frontend is configured to connect to this backend on port 8080. Make sure both applications are running:

1. Start the backend (this application)
2. Start the frontend from the `app-cantina-frontend` folder
