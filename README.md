# CineTrack

CineTrack is a movie and TV show tracking app I built as part of my CIS 4004 term project. The idea is pretty simple you log in, browse a catalog of shows, add things to your watchlist, and leave reviews. There's also an admin side that lets you manage all the content.

The frontend is built with React. Right now it runs on mock data so you don't need a backend to get it going locally.

---

## What's inside

- Login and register pages
- A catalog you can search and filter by genre or type
- Show detail modal with reviews and a watchlist button
- A personal watchlist with status tracking (Watching, Completed, etc.)
- Admin dashboard with show, user, and review management
- Role-based navigation — admins and regular users see different things

---

## How to run it

You'll need Node.js installed. If you don't have it, grab it at nodejs.org (download the LTS version).

Once you have that, open the project folder in your terminal and run:

```
npm install
```

Then:

```
npm start
```

It'll open at localhost:3000 in your browser.

---

## Logging in

There are two demo accounts built in:

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| User  | anything | anything  |

Any username and password combination that isn't the admin account will log you in as a standard user.

---

## Notes

This is the frontend-only version — all the data is hardcoded in `src/data/mockData.js`. If you want to change the shows, users, or reviews that's the file to edit. The full MERN backend is being handled separately. 

---

## Running the Backend

Need to have MongoDB running - Connection string: (mongodb://127.0.0.1:27017/)

1. Open a terminal and navigate to the `server` folder:
```
cd server
```
```
npm install
```

4. Start the server:
```
node server.js
```

It runs on **http://localhost:5000**

---

## MongoDB Collection

- `users` — stores user accounts and roles
- `shows` — stores the show/movie catalog
- `genres` — stores genre categories
- `watchlists` — stores each user's watchlist entries
- `reviews` — stores user reviews and ratings

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/api/users` | Manage users |
| GET/POST/PUT/DELETE | `/api/shows` | Manage shows |
| GET/POST/PUT/DELETE | `/api/genres` | Manage genres |
| GET/POST/PUT/DELETE | `/api/watchlist` | Manage watchlist |
| GET/POST/PUT/DELETE | `/api/reviews` | Manage reviews |
