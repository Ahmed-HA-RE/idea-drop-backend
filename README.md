# IdeaDrop Backend

This is the **backend** of a MERN stack application the frontend can be found [here](https://github.com/Ahmed-HA-RE/idea-drop-frontend).

The Backend was built with:

- ⚡ Node.js
- 🚂 Express.js
- 🍃 MongoDB (Mongoose)
- 🔐 JWT Authentication with Access & Refresh tokens

## 🚀 Features

- REST API for authentication and ideas management
- JWT-based authentication with access and refresh tokens
- Protected routes with authorization checks
- Refresh tokens stored securely in HTTP-only cookies

## ⚙️ Installation

```bash
# Navigate to backend
cd idea-drop-backend

# Install dependencies
npm install

# Create .env file
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Run development server
npm run dev
```

## 📑 API Documentation

### 🔐 Auth Routes (/api/auth)

| Method | Endpoint    | Description                              | Auth Required   |
| ------ | ----------- | ---------------------------------------- | --------------- |
| POST   | `/register` | Register a new user                      | ❌ No           |
| POST   | `/login`    | Log in an existing user                  | ❌ No           |
| POST   | `/refresh`  | Get new access token using refresh token | ✅ Yes (cookie) |
| POST   | `/logout`   | Log out and clear refresh token          | ✅ Yes (cookie) |

### 💡 Idea Routes (/api/ideas)

| Method | Endpoint | Description                    | Auth Required         |
| ------ | -------- | ------------------------------ | --------------------- |
| GET    | `/`      | Get all public ideas           | ❌ No                 |
| GET    | `/:id`   | Get a single idea by ID        | ❌ No                 |
| POST   | `/`      | Create a new idea              | ✅ Yes (access token) |
| DELETE | `/:id`   | Delete an idea (only if owner) | ✅ Yes (access token) |
| PUT    | `/:id`   | Update an idea (only if owner) | ✅ Yes (access token) |
