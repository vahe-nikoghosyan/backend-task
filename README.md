
---
# NestJS Backend Task

## Description

This project is a simple REST application built using the NestJS framework. It interacts with the Reqres API and includes CRUD operations for users, along with handling user avatars.

## File Structure

```
src/
├── app.module.ts
├── main.ts
├── config/
│   ├── configuration.ts
├── services/
│   ├── reqres.service.ts
│   ├── reqres.service.spec.ts
├── mocks/
│   ├── reqres.mock.ts
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   ├── schemas/
│   │   ├── user.schema.ts
│   ├── users.controller.ts
│   ├── users.controller.spec.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.service.spec.ts
```

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vahe-nikoghosyan/backend-task.git
   cd backend-task
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost/nest
   REQRES_API_URL=https://reqres.in/api
   RABBITMQ_URL=amqp://localhost
   ```

## Running the Application

### Local Development

1. **Start MongoDB**

   Ensure MongoDB is installed and running on your machine. If not, you can install it using Homebrew (macOS) or by following the installation instructions for your operating system from the [official MongoDB documentation](https://docs.mongodb.com/manual/installation/).

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   brew services start mongodb-community
   ```

   Alternatively, you can use Docker to run MongoDB:

   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Start RabbitMQ**

   Ensure RabbitMQ is installed and running on your machine. If not, you can install it using Homebrew (macOS) or by following the installation instructions for your operating system from the [official RabbitMQ documentation](https://www.rabbitmq.com/download.html).

   ```bash
   brew install rabbitmq
   brew services start rabbitmq
   ```

   Alternatively, you can use Docker to run RabbitMQ:

   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

3. **Start the NestJS Application**

   ```bash
   npm run start:dev
   ```

   The application will be running at `http://localhost:3000`.

## Running Tests

1. **Unit and Integration Tests**

   ```bash
   npm run test
   ```

2. **End-to-End Tests**

   ```bash
   npm run test:e2e
   ```

## API Endpoints

1. **Create User**

   ```http
   POST /api/users
   ```

   Request Body:

   ```json
   {
     "name": "John Doe",
     "email": "john.doe@example.com",
     "avatar": "https://reqres.in/img/faces/1-image.jpg"
   }
   ```

2. **Get User by ID**

   ```http
   GET /api/users/:userId
   ```

3. **Get User Avatar**

   ```http
   GET /api/users/:userId/avatar
   ```

4. **Delete User Avatar**

   ```http
   DELETE /api/users/:userId/avatar
   ```

## Contributing

1. **Fork the repository**

2. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

4. **Commit your changes**

   ```bash
   git commit -m "Add some feature"
   ```

5. **Push to the branch**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a pull request**

## License

This project is licensed under the MIT License.

---

