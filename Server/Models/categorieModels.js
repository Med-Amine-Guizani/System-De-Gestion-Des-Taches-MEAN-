const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorieschema = new Schema (
    {
        "title":{
            type:String, 
            required:true
        },
        "user_id":{
            type:String,
            require:true
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Categorie',categorieschema)