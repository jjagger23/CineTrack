# CineTrack

CineTrack is a movie and TV show tracking app built as part of our CIS 4004 term project. You log in, browse a catalog of shows, add things to your watchlist, and leave reviews. There's also an admin side for managing all the content.

Built with the MERN stack — MongoDB, Express, React, Node.js.

---

## initial setup
first change remove the .example portion from the .env.example files

then add a 256 random JWT secret key as the key in the .env for the server. You can use any JWT generator from the internet or your own tools.

## Running the Frontend

You'll need Node.js installed. Grab it at nodejs.org (download the LTS version).

Open the `frontend` folder in your terminal and run:

```
npm install
```

Then:

```
npm start
```

Opens at **http://localhost:3000** in your browser.

---

## Running the Backend

Need to have MongoDB running — Connection string: `mongodb://127.0.0.1:27017/` or whatever you have it configured as in the .env

1. Open a terminal and navigate to the `server` folder:

```
cd server
```

2. Install dependencies:

```
npm install
```

3. Start the server:

```
node server.js
```

Runs on **http://localhost:5000** by default unless you change it.

---

## Logging In

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| User  | anything | anything  |

---

## What's Inside (Frontend)

- Login and register pages
- Catalog organized by genre with search, filter, and view toggle
- Show detail modal with community reviews and watchlist button
- Personal watchlist with status tracking and episode progress bars
- Profile page with your stats — shows completed, avg rating, favorite genre
- Admin dashboard and manage pages for shows, users, and reviews
- Role-based navigation — admins and users see different things

---

## MongoDB Collections

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

---

## Notes

Currently no known issues.
