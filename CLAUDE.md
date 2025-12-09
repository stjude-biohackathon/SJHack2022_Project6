# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimplySamples is a sample management web application built for lab scientists to view, edit, filter, and export sample data from multiple related tables. The system loads CSV files into a PostgreSQL database and provides a dynamic React frontend with table filtering and cross-table joins.

## Architecture

Three-tier Docker architecture:
- **Database (db)**: PostgreSQL database storing sample data
- **Backend (backend)**: Django REST API serving data and schema endpoints
- **Frontend (frontend)**: React application with React Table for dynamic data visualization

Data flow:
1. CSV files are loaded into PostgreSQL via Django ORM
2. Backend exposes REST API endpoints for schema metadata and sample data
3. Frontend fetches schema to build dynamic filters, then queries data with table and column filters
4. React Table component renders filtered data with cross-table relationships

## Development Commands

### Initial Setup

Start services in order (database must be ready before backend):

```bash
docker-compose build
docker-compose up db
```

Wait for log: `db_1 | LOG: database system is ready to accept connections`

Then in a new terminal:

```bash
docker-compose up backend
```

Wait for log: `web_1 | Starting development server at http://0.0.0.0:8000/`

Load initial database by visiting: http://localhost:8000/

Then in a new terminal:

```bash
docker-compose up frontend
```

Frontend available at: http://localhost:3000/
Backend API at: http://localhost:8000/

### Frontend Development

```bash
cd frontend
npm start          # Start dev server (inside Docker or locally)
npm test           # Run tests
npm run build      # Production build
```

### Backend Development

Django management commands run inside Docker container:

```bash
docker-compose exec backend python backend/manage.py <command>
```

Common commands:
- `makemigrations` - Create new migrations
- `migrate` - Apply migrations
- `createsuperuser` - Create admin user
- `shell` - Django shell

### Database Management

Reset and reload database:
1. Visit http://localhost:8000/update_database
2. Click "Update Database" button
3. System deletes all data and reloads from CSV files in `backend/raw_data/`

## Key Components

### Backend (Django)

**Models (rest_api_app/models.py)**:
- `Table`: Stores table names
- `Schema`: Metadata for columns (name, type, primary/foreign key relationships)
- `Data`: EAV pattern storing actual data (table_name, column, value triples)

**Views (rest_api_app/views.py)**:
- `load_csv_data()`: Parses CSVs from `backend/raw_data/`, creates schema and data records
- `SchemaViewSet`: REST endpoint at `/api/schema/` returning column metadata
- `DataViewSet`: REST endpoint at `/api/data/` with filtering by table_name and column

**API Endpoints**:
- `GET /api/schema/` - Returns all schema metadata
- `GET /api/data/?table_name=<table>` - Returns data for single table
- `GET /api/data/?table_name__in=<table1>,<table2>&column__in=<col1>,<col2>` - Filtered multi-table data

### Frontend (React)

**App.js**: Main component managing state for schema, samples, columns, and loading status

**Components**:
- `Nav.js`: Top navigation with login functionality
- `Filters.js`: Dynamic filter checkboxes built from schema metadata
- `Table.js`: React Table implementation with export to CSV
- `CheckboxesGroup.js`: Checkbox group for column selection

**Data Flow**:
1. Fetches schema from `/api/schema/`
2. Loads default table data
3. User selects columns in Filters component
4. `handleFilterCallback` determines visible tables and connecting columns (primary/foreign keys)
5. Fetches filtered data with visible columns plus relationship columns
6. Table renders with cross-table joins

### CSV Data Loading

Place CSV files in `backend/raw_data/` directory. Format:
- First row: column names
- First column: treated as primary key
- All subsequent columns: stored as strings

The system automatically:
- Creates Table record for each CSV file
- Creates Schema records for each column
- Creates Data records for each cell value

## Technology Stack

- Django 3.x with Django REST Framework
- PostgreSQL database
- React 17 with React Table 7
- Tailwind CSS for styling
- Docker for containerization

## Database Schema

Uses Entity-Attribute-Value (EAV) pattern:
- Schema is dynamic and loaded from CSV headers
- Data stored as (table_name, column, value) triples
- Enables arbitrary table structures without migrations
- Trade-off: queries require filtering on table_name and column

## Testing

Frontend uses React Testing Library and Jest (configured in package.json).

Backend tests in `rest_api_app/tests.py` (run with Django test runner).

## Important Notes

- Database must start before backend (backend depends on db service)
- Initial database load happens on first visit to http://localhost:8000/
- Frontend expects backend at http://localhost:8000 (hardcoded URLs in App.js:21-23)
- Login is frontend-only with hardcoded credentials (admin/123) - not production-ready
- EAV pattern means all data stored as strings - type information in Schema model not enforced
- React Table v7 uses hooks API (not v8)
