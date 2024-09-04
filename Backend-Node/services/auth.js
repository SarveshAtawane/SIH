const jwt= require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

const jwtsign = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
    return token;
}

const jwtverify = (token) => {
    
    try{
        if(!token){
            throw new Error();
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if(!user){
            throw new Error();
        }
        // console.log(user);
        return user;
    }
    catch(error){
        return resizeBy.send(401).json({message: 'Please authenticate'});
    }
}

module.exports = {jwtsign, jwtverify};