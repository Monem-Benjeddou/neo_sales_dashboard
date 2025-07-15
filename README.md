# Neo Sales Dashboard

This repository contains a sales dashboard application with a Django backend and React frontend.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

Adjust the values according to your preferences.

## Running the Backend

1. Start the backend services using Docker Compose:

```bash
docker compose up -d
```

This command will:
- Create and start a PostgreSQL database container
- Create and start a Redis container
- Build and start the Django backend container
- Run database migrations automatically
- Seed the database with initial data
- Start the Django development server on port 8000

2. The backend will be available at: http://localhost:8000/

## Running the Frontend

1. Navigate to the frontend directory:

```bash
cd neo_sales_dashboard_frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. The frontend will be available at the URL shown in your terminal (typically http://localhost:5173/)

## Application Structure

- `neo_sales_dashboard_backend/`: Django backend application
  - Uses Django REST Framework for API endpoints
  - PostgreSQL for database
  - Redis for caching

- `neo_sales_dashboard_frontend/`: React frontend application
  - Built with Vite, React, and TypeScript
  - Uses Material UI and TailwindCSS for styling
  - Redux Toolkit for state management

## Stopping the Application

To stop the backend services:

```bash
docker compose down
```

To stop the frontend, press `Ctrl+C` in the terminal where it's running.