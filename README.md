# Expense Tracker Application

A responsive web application for tracking personal expenses with categorization and visualization features.

## Features

- Dashboard with expense summaries and charts
- Transaction management with filtering and sorting
- Expense categorization
- Analytics and data visualization
- Mobile-responsive design

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express
- **Storage**: In-memory database (with option for PostgreSQL)
- **Styling**: TailwindCSS with theming
- **Routing**: Wouter
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod validation

## Local Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000)

## Docker Setup

### Using Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed on your machine
2. Run the following command in the project root:

```bash
docker-compose up
```

This will start both the application and a PostgreSQL database if configured.

### Using Docker directly

1. Build the Docker image:

```bash
docker build -t expense-tracker .
```

2. Run the container:

```bash
docker run -p 5000:5000 expense-tracker
```

The application will be available at [http://localhost:5000](http://localhost:5000)

## Project Structure

- `client/` - Frontend React application
  - `src/components/` - UI components
  - `src/hooks/` - Custom React hooks
  - `src/lib/` - Utility functions
  - `src/pages/` - Page components
- `server/` - Backend Express server
  - `routes.ts` - API routes
  - `storage.ts` - Data storage implementation
- `shared/` - Shared code between frontend and backend
  - `schema.ts` - Data schemas and types

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense

## Configuration

The application can be configured through environment variables:

- `NODE_ENV` - Environment mode ('development' or 'production')
- `PORT` - Server port (default: 5000)

## License

[MIT](LICENSE)