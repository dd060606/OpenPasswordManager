const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const langRoutes = require("./routes/langs");

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/langs', express.static(path.join(__dirname, 'langs')));


app.use("/api/langs", langRoutes);


module.exports = app;