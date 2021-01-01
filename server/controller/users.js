const userModel = require('../models/Users');

exports.isUniqueId = async (req, res, next) => {
    try {
        const findUserId = await userModel.find(req.body);
        console.log("중복검사:", findUserId);
        res.status(200).json({success: true, findUserId})
    } catch (err) {
        next(err)
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const createUser = await userModel.create(req.body);
        console.log("유저 등록 요청:", req.body.userId)
        res.status(201).json({success: true, createUser})            
    } catch (error){
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try{
        await userModel.findOne({userId: req.body.userId}, (err, userInfo) => {
            console.log("로그인 시도:", userInfo)
            if(!userInfo) return res.json({ loginSuccess: false, message: "해당 유저를 찾지 못했습니다." })
            userInfo.comparePassword(req.body.password, (err, isMatch) => {
                if(!isMatch) return res.json({ loginSuccess: false, message: "패스워드가 틀렸습니다."})

                userInfo.generateToken((err, user) => {
                    if(err) return res.status(400).send(err);
                    res.cookie("_loginExp", user.tokenExp);
                    res.cookie("_loginTkn", user.token)
                        .status(200)
                        .json({ loginSuccess: true, userId: user._id})
                })
            })            
        })

    } catch (err) {
        next (err);
    }
}