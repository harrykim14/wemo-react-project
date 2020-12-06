const userModel = require('../models/Users');

exports.createUser = (req, res) => {
        const createUser = new userModel(req.body)

        console.log("유저 등록 요청")
        createUser.save((err, doc) => {
            if(err) res.json({ success: false, err})
            res.status(200).json({success: true})
        })
        
    
}