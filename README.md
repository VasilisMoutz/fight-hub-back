# FightHub Backend
This application is to be used as the backend of [FightHub](https://github.com/VasilisMoutz/fight-hub-frontend)

## Project Status
🚧 **Work in Progress** 🚧

## Prerequisites
Before you begin installing this project, ensure that you have `npm` and `node` installed globally on your machine:
 - Download and install Node.js and npm from the official website: [Node.js Downloads](https://nodejs.org/).
 - Verify the installation by running the following commands in your terminal or command prompt:

   ```bash
   node -v
   npm -v
   ```
   
## Setup
Once you have installed the prerequisites, follow these steps to set up your development environment:
1. **Clone this repository to your local machine:**
   ```bash
   git clone https://github.com/VasilisMoutz/fight-hub-backend.git
   
2. **Navigate to the project directory:**
   ```bash
   cd fight-hub-backend

3. **Install project dependencies:**
   ```bash
   npm install

4. **Configure MongoDB Atlas:**
   You need to set up a [MongoDB Atlas](https://www.mongodb.com/atlas/database) cluster and obtain the connection URL
    - Visit MongoDB Atlas and sign in or create an account.
    - Create a new cluster or use an existing one.
    - In the cluster dashboard, click on "CONNECT" and then choose "Connect your application."
    - Copy the connection string provided.
   
6. **Create .env file**
   Create a new file named .env in the root directory of the project.

