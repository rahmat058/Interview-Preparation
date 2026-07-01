---
title: "MERN Common Commands Cheatsheet"
description: "Quick reference for MongoDB shell, Express/Node npm, React CLI, and Git commands used in MERN development."
tags: ["mern", "commands", "mongodb", "git", "cheatsheet"]
level: "All levels"
---

# Common Commands Cheatsheet

Quick reference for daily MERN development and interviews.

---

<a id="quick-index"></a>

## Quick index

| # | Section |
| --- | --- |
| <span id="i1"></span>1 | [MongoDB Commands](#p1) |
| <span id="i2"></span>2 | [Express / Node Commands](#p2) |
| <span id="i3"></span>3 | [React Commands](#p3) |
| <span id="i4"></span>4 | [Git Commands](#p4) |
| <span id="i5"></span>5 | [MERN Full-Stack Quick Start](#p5) |

---
<a id="p1"></a>

## MongoDB Commands

### Connect & databases

```bash
mongosh                          # open MongoDB shell
show dbs                         # list databases
use ecommerce                    # switch/create database
db                               # current database name
```

### CRUD operations

```javascript
// Create
db.users.insertOne({ name: "Rahul", email: "r@kpmg.com", role: "admin" });
db.users.insertMany([
  { name: "Alice", email: "a@x.com" },
  { name: "Bob", email: "b@x.com" },
]);

// Read
db.users.find(); // all documents
db.users.findOne({ email: "r@kpmg.com" }); // single document
db.users.find({ role: "admin" }).pretty();
db.products.find({ price: { $gte: 1000, $lte: 50000 } });
db.orders.find().sort({ createdAt: -1 }).limit(10);

// Update
db.users.updateOne({ email: "r@kpmg.com" }, { $set: { role: "superadmin" } });
db.products.updateMany({ category: "sale" }, { $inc: { discount: 10 } });

// Delete
db.users.deleteOne({ email: "spam@test.com" });
db.logs.deleteMany({ level: "debug" });
```

### Indexes & aggregation

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.getIndexes();

db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
]);
```

### Useful helpers

```javascript
db.users.countDocuments({ active: true })
db.products.distinct("category")
show collections
db.users.drop()
```

---


<p><a href="#i1">Back to index</a></p>

<a id="p2"></a>

## Express / Node Commands

### Project setup

```bash
mkdir server && cd server
npm init -y                      # create package.json
npm install express              # web framework
npm install mongoose             # MongoDB ODM
npm install cors dotenv          # CORS + env vars
npm install jsonwebtoken bcryptjs  # JWT auth
npm install --save-dev nodemon   # auto-restart dev server
```

### Run server

```bash
node index.js                    # start once
npx nodemon index.js             # dev with auto-reload
npm run dev                      # if script defined in package.json
```

### Common packages

```bash
npm install express-rate-limit   # rate limiting
npm install multer               # file uploads
npm install helmet morgan          # security + logging
npm install socket.io            # WebSockets
npm install jest supertest --save-dev  # API testing
```

### package.json scripts example

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  }
}
```

### Environment

```bash
# .env (never commit)
PORT=5000
MONGO_URI=mongodb://localhost:27017/mernapp
JWT_SECRET=your-secret-here
CLIENT_URL=http://localhost:3000
```

---


<p><a href="#i2">Back to index</a></p>

<a id="p3"></a>

## React Commands

### Create & run

```bash
# Vite (recommended)
npm create vite@latest client -- --template react
cd client
npm install
npm run dev                      # http://localhost:5173

# Create React App (legacy)
npx create-react-app client
cd client
npm start                        # http://localhost:3000
```

### Build & production

```bash
npm run build                    # production build → dist/ or build/
npm run preview                  # preview Vite build locally
```

### Common installs (MERN frontend)

```bash
npm install react-router-dom     # routing
npm install axios                # HTTP client
npm install @tanstack/react-query  # server state / caching
npm install react-hook-form zod  # forms + validation
npm install socket.io-client     # real-time
```

### Testing

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
npm test
```

---


<p><a href="#i3">Back to index</a></p>

<a id="p4"></a>

## Git Commands

### Initialize & daily workflow

```bash
git init                         # new repo
git clone git@github.com:user/mern-app.git

git status                       # see changes
git add .                        # stage all
git add src/App.jsx              # stage one file
git commit -m "feat: add login API"
```

### Branches

```bash
git branch                       # list branches
git checkout -b feature/auth     # create + switch
git switch main                  # switch branch (modern)
git merge feature/auth           # merge into current branch
```

### Remote sync

```bash
git remote add origin git@github.com:user/mern-app.git
git push -u origin main          # first push
git push origin main             # subsequent pushes
git pull origin main             # fetch + merge
git fetch origin                 # fetch only
```

### Undo & inspect

```bash
git log --oneline -10            # recent commits
git diff                         # unstaged changes
git diff --staged                # staged changes
git restore file.js              # discard local changes
git reset HEAD file.js           # unstage
```

### Useful for MERN teams

```bash
git stash                        # save WIP temporarily
git stash pop                    # restore stashed changes
git tag v1.0.0                   # release tag
git push origin v1.0.0
```

---


<p><a href="#i4">Back to index</a></p>

<a id="p5"></a>

## MERN Full-Stack Quick Start

```bash
# 1. Clone / create project
mkdir mern-app && cd mern-app

# 2. Backend
mkdir server && cd server
npm init -y
npm install express mongoose cors dotenv jsonwebtoken bcryptjs
npm install --save-dev nodemon
# create index.js, .env, routes

# 3. Frontend
cd ..
npm create vite@latest client -- --template react
cd client
npm install axios react-router-dom

# 4. MongoDB (local or Atlas)
mongosh
use mernapp

# 5. Run (two terminals)
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

### Typical dev URLs

| Service      | URL                       |
| ------------ | ------------------------- |
| React (Vite) | http://localhost:5173     |
| React (CRA)  | http://localhost:3000     |
| Express API  | http://localhost:5000     |
| MongoDB      | mongodb://localhost:27017 |

---

## Interview Quick Recall

| Tool    | One command to remember                        |
| ------- | ---------------------------------------------- |
| MongoDB | `db.collection.find({ filter })`               |
| Express | `npm install express && node index.js`         |
| React   | `npm create vite@latest`                       |
| Git     | `git add . && git commit -m "msg" && git push` |

---

**Back to:** [MERN README](./README.md)


<p><a href="#i5">Back to index</a></p>