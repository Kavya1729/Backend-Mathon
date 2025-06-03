const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:true,
        trim: true,
    },
    chapter:{
        type: String,
        required: true,
        trim: true,
    },
    class:{
        type: String,
        required: true,
        trim: true,
    },
    unit:{
        type: String,
        required: true,
        trim: true,
    },
    yearWiseQuestionCount:{
        type:Map,
        of: Number,
        default:{},
    },
    questionSolved:{
        type:Number,
        required:true,
        default: 0,
        min:0,
    },
    status:{
        type:String,
        required:true,
        default: 'Not Started',
    },
    isWeakChapter:{
        type:Boolean,
        required:true,
        default:false,
    },
},{timestamps:true});


const Chapter = mongoose.model('Chapter', chapterSchema);
module.exports = Chapter;