const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskschema = new Schema (
    {
        "title":{
            type:String, 
            required:true
        },
        "desc":{
            type:String,
            required:true
        },
        "time":{
            type:String,
            required:true
        },
        "user_id":{
            type:String,
            require:true
        }
        ,
        "category":{
            type:String,
            require:true
        }
        ,
        "status":{
            type:String,
            require:true
        }, 
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Task',taskschema)