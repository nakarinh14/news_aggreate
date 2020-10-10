const { Pool } = require('pg')

const pool = new Pool()

module.exports = { 
    findNews: (user, callback) => {
        return pool.query(
            "SELECT * FROM news_source n WHERE n.publisher NOT IN " +
            "(SELECT u.publisher FROM user_settings u WHERE u.user=$1)",
            [user],
            callback)
    },
    findAllNews: (callback) => {
        return pool.query(
            "SELECT * FROM news_source n",
            callback
        )
    },
    addUser: (values, callback) => {
        return pool.query(
            "INSERT INTO users(username, password) VALUES($1, $2)",
            values,
            callback
        )
    },
    findUser: (values, callback) => {
        return pool.query(
            "SELECT * FROM users u WHERE u.username=$1",
            values,
            callback
        )
    },
    updateSetting: (values, callback) => {
        return pool.query(
            "UPDATE user_settings SET",
            values,
            callback
        )
    }
}