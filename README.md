<p align="center">
    <img src="https://opm.dd06-dev.rh-web.eu/assets/images/icon.png" alt="Logo" width="50" height="63">

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
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#license">License</a></li>
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
3. Install frontend and backend dependencies
   ```sh
   cd /webapp/frontend
   npm i
   cd ../backend
   npm i
   ```

4. Complete the config
  
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

## Features
  - Passwords are securely encrypted with AES
  - Credentials are stored in a database and accessible from your account
  - Simple to use
  - Light theme and dark theme

## To do
  - A desktop app with Electron
  - A react native app

## License

Distributed under the GNU General Public License v3.0 License. See `LICENSE` for more information.
