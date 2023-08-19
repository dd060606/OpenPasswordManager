<p align="center">
    <img src="https://opm.dd06-dev.fr/assets/images/logo.png" alt="Logo" width="120" height="110">

</p>

# OpenPasswordManager - Free cross-platform and open source password manager

OpenPasswordManager is a browser and desktop password manager. The app can run either in browser, or as a desktop app.
OpenPasswordManager use ReactJS for the frontend and ExpressJS for the backend.

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#start-the-website">Start the website</a></li>
        <li><a href="#build-the-react-native-app">Build the react native app</a></li>
        <li><a href="#migrate">Migrate from backend 1.0.0 to 1.1.0</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#demo">Demo</a></li>

  </ol>
</details>

## Getting Started

### Prerequisites

You need to install NodeJS and NPM and you also need to have a MySQL database

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/dd060606/OpenPasswordManager.git
   cd OpenPasswordManager
   ```
2. Install frontend and backend dependencies

   ```sh
   cd /webapp/frontend
   npm i
   cd ../backend
   npm i
   ```

3. Complete the config

   Rename `.env.example` in `webapp/frontend/` and in `webapp/backend` to `.env` and complete them.

### Start the website

1. Start the react website

```sh
 # In webapp/frontend
 npm start
```

2. Start the express server

```sh
 # In webapp/backend
 node server
```

### Build the react native app

1. Install dependencies
   ```sh
   cd /opm-react-native
   yarn install
   ```
2. Edit the config.json file and complete it with your backend API

3. Build the app for Android
   ```sh
   yarn run build
   ```

### Migrate

You have to migrate only if you already have a backend installation lower than **1.1.0** (check your version in package.json)

1. Go to the backend folder on your server
2. Make a **backup** of your database
3. Run the migrate.js script
   ```sh
   node migrate.js
   ```
4. You are ready to use the new backend!

## Features

- Passwords are securely encrypted with AES
- Credentials are stored in a database and accessible from your account
- Simple to use
- Light theme and dark theme
- Credentials sorting system
- Electron app for Windows, Linux and MacOS (in dev)
- The electron app updates itself
- A react native app (Android and iOS)
- Offline mode in the mobile app

## To do

...

## License
