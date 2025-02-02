const jwt = require("jsonwebtoken");

class JWTService{
    static jwt_auth = "Apnacollege20453wahab";
    static generateToken = (payload) =>{
        const token = jwt.sign(payload,JWTService.jwt_auth,{
            expiresIn:"30h"
        })
        return token 
    }

    static verifyToken = (token,key) => {
       const payload = jwt.verify(token,JWTService.jwt_auth)
       return payload [key]
    }
}

module.exports = JWTService