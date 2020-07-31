const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const appointmentRoutes = require('./api/routes/appointment');


mongoose.connect('mongodb://localhost:27017/appointment-app', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

if(!db)
    console.log("Error connecting db");
else
    console.log("Db connected successfully");

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true); 

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Content-Type, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use("/appointment", appointmentRoutes);

module.exports = app;