# Cafeteria Management System - Backend

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

# Run with Maven
chmod +x mvnw
./mvnw spring-boot:run
```

Or on Windows:
```bash
mvnw.cmd spring-boot:run
```

The application will start on `http://localhost:8080`

## Database

The database is already configured in `application.properties` and connects to an Azure SQL Server database.

## Build for Production

```bash
./mvnw clean package
```

The JAR file will be created in the `target` folder.

## Frontend Integration

The frontend is configured to connect to this backend on port 8080. Make sure both applications are running:

1. Start the backend (this application)
2. Start the frontend from the `app-cantina-frontend` folder


# Cantina Management System - Frontend

React frontend for the cantina management system.

## Prerequisites

- **Node.js** (version 20+ or higher)
- **npm** (comes with Node.js)

## Quick Setup

### 1. Install Node.js
- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **macOS**: `brew install node`
- **Linux**: `sudo apt install nodejs npm`

### 2. Install Dependencies

```bash
npm install
npm install -D vite@latest @tailwindcss/vite@latest
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check code quality

## Backend Integration

Make sure the Spring Boot backend is running on `http://localhost:8080` before starting the frontend.

## Build for Production

```bash
npm run build
```

The built files will be copied to the backend's static resources folder.


