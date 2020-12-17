const userModel = require('../models/Users');

exports.createUser = async (req, res, next) => {
    try {
        const createUser = await userModel.create(req.body);
        console.log("유저 등록 요청", req.body.userid)
        res.status(201).json({success: true, createUser})            
    } catch (error){
        next(error);
    }
}