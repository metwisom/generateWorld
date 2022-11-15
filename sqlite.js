const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


const dbPromise = open({
    filename: './db.sqlite',
    driver: sqlite3.cached.Database
})



module.exports = {
    async query(sql) {
        return dbPromise.then(db => db.all(sql));
    },
    async get(sql) {
        return dbPromise.then(db => db.get(sql));
    },
    async set(sql) {
        return dbPromise.then(db => db.run(sql));
    }
};
