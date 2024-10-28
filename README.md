# Battleship Game Server & RSSchool NodeJS websocket task template

This project is a server-side implementation of a multiplayer battleship game, built with TypeScript and WebSocket.
Assignment link: [https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/battleship/assignment.md](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/battleship/assignment.md)

## Features
- **Player Registration**: Players can register with a name and password.
- **Room Management**: Supports room creation, joining, and updating.
- **Ship Placement**: Players can add ships to rooms with specific positions, directions, and types.
- **Game Progression**: The server manages turn-based gameplay, handling attacks and random attacks.
- **Winner Determination**: Tracks the number of wins and broadcasts updates.
- **Single player**: Option to play with simple algorithm, with automated attacks, game progression and random map templates.

## Running the Server

There are several ways to start the server, depending on your needs:

1. **Production Build**:
   - Build the project with Webpack and start the server:
     ```bash
     npm run start
     ```
   - This command will bundle the TypeScript code into a single JavaScript file using Webpack, then execute it via Node.js from the `dist` folder.

2. **Development Server**:
   - Run the server using `ts-node-dev` for faster development:
     ```bash
     npm run start:dev
     ```
   - This command will directly execute the `src/server.ts` file with `ts-node-dev`, allowing for automatic restarts on file changes.

3. **Frontend Server**:
   - Start the frontend server:
     ```bash
     npm run start:front
     ```
   - This command will run `index.mjs` with Node.js to serve the frontend application.

4. **Frontend Development Server**:
   - Run the frontend server with `nodemon` for live reloads:
     ```bash
     npm run start:front:dev
     ```
   - This will start the frontend using `nodemon`, which watches for file changes and restarts the server as needed.

## Dependencies
- **WebSocket**: Provides real-time communication.
- **dotenv**: For managing environment variables.
- **TypeScript**: Type-safe programming language used to develop the server.
- **Webpack**: Bundles the server code for production.
- **ts-node-dev**: Enables running TypeScript directly with automatic restarts during development.
- **nodemon**: Monitors changes in the backend/frontend files and restarts the server.
