const validator = require('validator');

const isStringArray = (arr) => Array.isArray(arr) && arr.every(x => typeof x === 'string')
const isInt = (x) => validator.isInt(x)

const validateQuery = (req, res, next) => {
    const cond = isInt(req.query.limit) && isInt(req.query.page)
    if(cond){
        return next()
    }
    res.status(400).json({message: 'Invalid query'});
}

module.exports = validateQuery