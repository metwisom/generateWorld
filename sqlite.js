
var dbPromise = require(`better-sqlite3`)(`./db.sqlite`, {/*verbose: console.log*/});


module.exports = {
    async query(sql) {
        return dbPromise.prepare(sql).all();
    },
    async get(sql) {
        return dbPromise.prepare(sql).get();
    },
    async set(sql) {
        return dbPromise.prepare(sql).run();
    }
};
