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

    findBookedNews: queryPool("SELECT n.*, b.bookmark_id" +
        " FROM news_source n INNER JOIN bookmarks b ON n.id=b.news_id WHERE b.user_id=$1"),

    addBookedNews: queryPool("INSERT INTO bookmarks (user_id, news_id) VALUES ($1, $2) ON CONFLICT (user_id, news_id) DO NOTHING"),

    removeBookedNews: queryPool("DELETE FROM bookmarks b WHERE b.user_id=$1 AND b.news_id=$2"),

    findNewsOffsetLimit: queryPool(
        "SELECT * FROM news_source n " +
        "WHERE n.publisher != ALL($1) ORDER BY timestamp DESC LIMIT $2 OFFSET $3"),

    findNewsOffsetLimitAuth: queryPool(
        "SELECT n.*, b.bookmark_id " +
        "FROM news_source n LEFT JOIN bookmarks b ON n.id=b.news_id AND b.user_id=$4 " +
        "WHERE n.publisher = ANY($1) ORDER BY timestamp DESC LIMIT $2 OFFSET $3"
    ),
    findUserSettings: queryPool("SELECT * FROM user_news_settings usn WHERE usn.username = $1"),

    addUser: queryPool("INSERT INTO users(username, password) VALUES($1, $2)"),

    addUserSettings: queryPool("INSERT INTO user_news_settings VALUES ($1, array[]::text[], array[]::text[])"),

    findHistory: queryPool("SELECT ns.*, nh.timestamp AS last_access FROM news_history nh LEFT JOIN news_source ns " +
        "ON nh.news_id=ns.id WHERE nh.user_id=$1 ORDER BY nh.timestamp DESC"),

    addHistory: queryPool("INSERT INTO news_history (user_id, news_id, timestamp) VALUES($1, $2, $3)"),
    
    findUser: queryPool("SELECT * FROM users u WHERE u.username=$1"),

    findUserById: queryPool("SELECT * FROM users u WHERE u.id=$1"),

    checkUserExist: queryPool("SELECT TOP 1 u.username FROM users u WHERE u.username = $1"),

    updateSetting: queryPool("UPDATE user_news_setting SET news_blacklist = $1 WHERE username = $2 "),

    findUrlById: queryPool("SELECT n.url FROM news_source n WHERE n.id=$1")

}