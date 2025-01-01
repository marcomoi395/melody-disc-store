"use strict";
/*
-- Level 0 --
const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/shopDEV';

mongoose.connect(connectString).then(_ => console.log('Connected to MongoDB')).catch(err => console.error(err));

//Dev
if (1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}
*/

// -- PRO (Recommend)
const mongoose = require("mongoose");
const { countConnect } = require("../helper/check.connect");
const {
    db: { host, name, port },
} = require("../configs/config.mongodb");
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    // Connect
    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }

        mongoose
            .connect(connectString, { maxPoolSize: 50 })
            .then((_) => {
                console.log("Connected to MongoDB", countConnect());
            })
            .catch((err) => console.error(err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
