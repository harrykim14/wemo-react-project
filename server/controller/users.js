const userModel = require('../models/Users');

exports.createUser = async (req, res, next) => {
    try{
        const createUser = await userModel.create(req.body)
        console.log("createUser", createUser)
        res.status(201).json(createUser)
    } catch(error) {
        next(error);
    }
}