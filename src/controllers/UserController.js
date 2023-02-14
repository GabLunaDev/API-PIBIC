const user = require("../models/user")
const Logging = require("../utils/logging")
const argon2 = require("argon2")

module.exports = {
    async create(req, res, next) {
        try {
            const body = req.body;
    
            if(!body){
                return res.status(400).send({ message: "the body is empty" })
            }
    
            if(!body.name){
                return res.status(400).send({ message: "cannot create without a name"})
            }
    
            if(!body.username){
                return res.status(400).send({ message: "cannot create without a username"})
            }
    
            if(!body.password){
                return res.status(400).send({ message: "cannot create without a password"})
            }
    
            body.password = await argon2.hash(body.password)
    
            await user.create(body)
            
            res.status(200).send({message: "User created with success"})
        } catch (error) {
            Logging.error(error)
            req.status(500).send({message: "Internal Server Error!"})
        }
    }
}