const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memoSchema = mongoose.Schema({
    userId: {
        type : String,
        required: true
    },
    memoNum: {
        type: Number,
        unique: 1
    },
    memoCategory : {
        type: String,
        required: true
    },
    height: {
        type:String,
        default: '250px'
    },
    width: {
        type:String,
        default:'250px'        
    },
    x : {
        type: Number,
        default: 30
    },
    y: {
        type:Number,
        default:30
    },
    bgColor: {
        type :String,
        default: '#fff44f'
    },
    memoContext: {
        type:String,
        default: '새 메모'
    },
    memoLocked:{
        type:Boolean,
        default: false
    },
    memoImport:{
        type:Boolean,
        default: false
    },
    zIndex: {
        type:Number,
        default: 999
    },
    createDate:{
        type: Date,
    }
})

const Memo = mongoose.model("WemoMemos", memoSchema);

module.exports = Memo;