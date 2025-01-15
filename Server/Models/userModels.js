const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const validator = require('validator')
const userSchema = new Schema (
    {
        "username":{
            type:String,
            require:true,
        },
        "email":{
            type:String ,
            require:true,
            unique:true,
        },
        "password":{
            type:String,
            require:true,
        }
    }
)



//static methodes for this schema : 
//signup using Hashing for Protection
userSchema.statics.signup = async function  (username,email,password){
    
    if(!email || !password){
        throw Error("all fields must be filled")
    }
    
    if(!validator.isEmail(email)){
        throw Error("Email not valid")
    }
    
    if(!validator.isStrongPassword(password)){
        throw Error("password not strong enough")
    }
    
     const exist = await  this.findOne({"email":email})
     if(exist){
        throw Error("email already exists")
     }
     
     const salt  =await bcrypt.genSalt(10)
     const hash = await bcrypt.hash(password , salt)
     const user = await this.create({"username":username ,"email":email , "password":hash})
     return user;

}
//singin 
userSchema.statics.signin = async function (email,password){
    if(!email || !password){
        throw Error("all fields must be filled")
    }
    const user = await this.findOne({email}) 

    if (!user){
        throw Error('Inorrect email')
    }

    const match = await bcrypt.compare(password , user.password)
    if(!match){
        throw Error("incorrect password")
    }
    return user
}
module.exports= mongoose.model('User',userSchema)