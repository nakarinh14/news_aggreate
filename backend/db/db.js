const { Pool } = require('pg')

const pool = new Pool()

function queryPool(query) {
    return function(values, callback){
        const start = Date.now()
        return pool.query(query, values, (err, res) => {
            const duration = Date.now() - start
            console.log('Executed Query', {query, duration})
            if(typeof callback !== "undefined") callback(err, res)
        })
    }
}

module.exports = {

    findNews: queryPool("SELECT * FROM news_source n WHERE n.publisher != ALL($1)"),

    findAllNews: queryPool("SELECT * FROM news_source n"),

    findNewsOffsetLimit: queryPool(
        "SELECT * FROM news_source n WHERE n.publisher != ALL($1)" +
        "ORDER BY date desc LIMIT $2 OFFSET $3"),

    findUserSettings: queryPool("SELECT * FROM user_news_settings usn WHERE usn.username = $1"),

    addUser: queryPool("INSERT INTO users(username, password) VALUES($1, $2)"),

    addUserSettings: queryPool("INSERT INTO user_news_settings VALUES ($1, array[]::text[], array[]::text[])"),
    
    findUser: queryPool("SELECT * FROM users u WHERE u.username=$1"),

    checkUserExist: queryPool("SELECT TOP 1 u.username FROM users u WHERE u.username = $1"),

    updateSetting: queryPool("UPDATE user_news_setting SET news_blacklist = $1 WHERE username = $2 ")

}