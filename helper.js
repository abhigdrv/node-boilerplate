const { Prisma } = require('@prisma/client')
const bcrypt = require('bcryptjs')

function isCorsEnabled(){
    return true;
}

function standardFormatResponse(data, status = 'success', statusCode = 200, message = ''){
    return {
        status: status,
        statusCode: statusCode,
        data: data,
        message: message
    }
}

function catchPrismaErrors(e, res){
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e.message)
    }
    console.error(e)
    res.status(200).json(standardFormatResponse([], 'fail', 502, e.message));
}

function hashPassword(plainTextPassword) {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(plainTextPassword, salt)
    return hash
}

function comparePassword(plainTextPassword, hash) {
    return bcrypt.compareSync(plainTextPassword, hash)
}

function isUrlHaving(req, key, value){
    if(req.query){
        if(req.query.include){
            return req.query[key].split(',').includes(value)
        }else{
            return false;
        }
    }else{
        return false;
    }
}

module.exports = {
    isCorsEnabled,
    standardFormatResponse,
    catchPrismaErrors,
    hashPassword,
    comparePassword,
    isUrlHaving
};