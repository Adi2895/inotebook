const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost/inotebook";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI);
}

module.exports = connectToMongo; 