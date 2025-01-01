"use strict";

// -- Check how many connections the system has? --
const mongoose = require("mongoose");
const countConnect = () => {
    const numConnect = mongoose.connections.length;
    console.log(`Number of connections::${numConnect}`);
};

// -- Check over load database --
const os = require("os");
const _SECONDS = 5000;
const checkOverload = () => {
    setInterval(() => {
        const numConnect = mongoose.connections.length;
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Example maxium number of connections based on numbers of cores
        const maxConenctions = numCore * 5;

        console.log("Actice connections::", numConnect);
        console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`);

        if (numConnect > maxConenctions) {
            console.log(
                `Warning: Overload database, number of connections::${numConnect}`,
            );
        }
    }, _SECONDS); // Monitor every 5 seconds
};

module.exports = { countConnect, checkOverload };
