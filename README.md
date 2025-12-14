# OpenBets

Lottery draw tracking and analysis system with ASP.NET Core API and React frontend.

## Features

- 🎯 Track lottery draw results
- 📊 View winning numbers history
- 🔄 Real-time latest draw display
- 📱 Clean, responsive UI

## Tech Stack

### Backend (OpenBetsApi)
- **ASP.NET Core 8.0** Web API with Controllers
- **Entity Framework Core 8.0** with PostgreSQL
- **Npgsql** - PostgreSQL provider
- **Swagger/OpenAPI** documentation

### Frontend (openbets-client)
- **React 18** with JavaScript
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - API client
- Clean, modern CSS

### Database
- **PostgreSQL** 12+

## Project Structure

```
Openbets/
├── OpenBetsApi/           # ASP.NET Core API
│   ├── Controllers/       # API endpoints
│   ├── Models/           # Entity models
│   ├── Data/             # DbContext
│   ├── DTOs/             # Data transfer objects
│   └── Services/         # Business logic
│
└── openbets-client/      # React frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   └── services/     # API service
    └── public/
```

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- PostgreSQL 12+

### Database Setup
1. Open **pgAdmin**
2. Create database: `openbets_db`
3. Owner: `postgres`
4. Encoding: `UTF8`

### Backend Setup

1. Navigate to API directory:
```bash
cd OpenBetsApi
```

2. Configure database connection:
   - Copy `appsettings.Development.json.example` to `appsettings.Development.json`
   - Update PostgreSQL credentials

3. Apply migrations:
```bash
dotnet ef database update
```

4. Run the API:
```bash
dotnet run
```

API will be available at: `http://localhost:5000`  
Swagger UI: `http://localhost:5000/swagger`

### Frontend Setup

1. Navigate to client directory:
```bash
cd openbets-client
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## API Endpoints

- `GET /api/Health` - Health check
- `GET /api/WinningColumns` - Get all draws (paginated)
- `GET /api/WinningColumns/latest` - Get latest draw
- `GET /api/WinningColumns/{id}` - Get specific draw
- `POST /api/WinningColumns` - Create new draw

## Development

### Run Both (Backend + Frontend)

**Terminal 1 - API:**
```bash
cd OpenBetsApi
dotnet run
```

**Terminal 2 - Client:**
```bash
cd openbets-client
npm run dev
```

### Database Migrations

Create new migration:
```bash
cd OpenBetsApi
dotnet ef migrations add MigrationName
```

Apply migration:
```bash
dotnet ef database update
```

## Security

⚠️ **Important:** Never commit sensitive credentials!
- `appsettings.Development.json` is in `.gitignore`
- Use the `.example` files as templates
- Update credentials locally only

## License

MIT

## Run Commands
1.
-cd OpenBetsApi
-dotnet run

2.
-cd openbets-client
-npm run dev