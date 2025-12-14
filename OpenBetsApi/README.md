# OpenBets API

ASP.NET Core 8.0 Web API with PostgreSQL for the OpenBets application.

## Technologies

- **.NET 8.0**
- **ASP.NET Core Web API** (with Controllers)
- **Entity Framework Core 8.0**
- **PostgreSQL** (with Npgsql provider)
- **Swagger/OpenAPI** for documentation

## Requirements

- .NET 8.0 SDK
- PostgreSQL 12 or newer

## Installation

1. Install dependencies:
```bash
dotnet restore
```

2. **Configuration Setup (IMPORTANT - Security)**:
   - ⚠️ **DO NOT** commit `appsettings.Development.json` with real credentials!
   - `appsettings.Development.json` is already in `.gitignore`
   - Open `appsettings.Development.json.example` and create your own `appsettings.Development.json`
   - Add your PostgreSQL credentials

3. Database creation:
   - Open **pgAdmin**
   - Create database named: `openbets_db`
   - Owner: `postgres`
   - Encoding: `UTF8`

4. Run migrations (when added):
```bash
dotnet ef database update
```

## Running

```bash
dotnet run
```

API will be available at: `https://localhost:5001` or `http://localhost:5000`

Swagger UI: `https://localhost:5001/swagger`

## Project Structure

```
OpenBetsApi/
├── Controllers/     # API Controllers
├── Data/           # DbContext and Database configuration
├── Models/         # Entity models
├── DTOs/           # Data Transfer Objects
├── Services/       # Business logic
└── Program.cs      # Application entry point
```

## API Endpoints

### Health Check
- `GET /api/health` - API status check

## Database Migrations

Create migration:
```bash
dotnet ef migrations add InitialCreate
```

Apply migration:
```bash
dotnet ef database update
```

Remove last migration:
```bash
dotnet ef migrations remove
```

## CORS Configuration

API is configured with CORS to accept requests from:
- `http://localhost:3000` (React development server)
- `http://localhost:5173` (Vite development server)
