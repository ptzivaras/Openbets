# Openbets
Free bets for anyone. We will help you make your bet

Τραβάει δεδομένα από το OPAP API για το παιχνίδι 
Αποθηκεύει τα δεδομένα σε  database 
Εμφανίζει στατιστικά με charts και πίνακες
Εξάγει αναφορές σε PDF 

ASP.NET Core:
Performance: Πολύ γρήγορο (top 3 παγκοσμίως σε benchmarks)
Απλούστερο για React integration (JSON serialization out of the box)
Καλύτερο tooling στο VS Code με C# Dev Kit
Modern C# είναι πιο καθαρή γλώσσα από Java για APIs
Minimal APIs για πολύ γρήγορη ανάπτυξη
LINQ για queries είναι εξαιρετικό
Καλύτερη async/await υποστήριξη
Spring Boot θα ήταν καλό αν:
Ξέρεις ήδη Java πολύ καλά
Έχεις Java ecosystem dependencies
Θες να χρησιμοποιήσεις μέρος του υπάρχοντα κώδικα
Αρχιτεκτονική που προτείνω:

Frontend (React) ←→ Backend API (ASP.NET Core) ←→ Database
Βάση δεδομένων: ΝΑΙ, χρειάζεται

Γιατί:

Για caching των OPAP API responses (να μην χτυπάς συνέχεια το API)
Για ιστορικά δεδομένα και analytics
Για καλύτερο performance (pre-calculated stats)

Tech Stack που προτείνω:
Backend:

ASP.NET Core 8 Web API
Entity Framework Core
PostgreSQL 
SignalR (για real-time updates αν χρειαστεί)
Frontend:

React + TypeScript
Chart.js ή Recharts (για τα charts)
TanStack Query (για API calls)
Tailwind CSS (για styling)
Deployment:

Docker containers
Azure / Railway / Render (για hosting)

