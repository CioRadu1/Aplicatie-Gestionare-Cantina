# Cantina Management System - Frontend

React frontend for the cantina management system.

## Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

## Quick Setup

### 1. Install Node.js
- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **macOS**: `brew install node`
- **Linux**: `sudo apt install nodejs npm`

### 2. Install Dependencies

```bash
npm install
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
