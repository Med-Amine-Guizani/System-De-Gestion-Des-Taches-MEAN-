const express = require('express') 
const mongoose= require('mongoose')
const dotenv = require('dotenv')
const taskroutes= require('./Routes/tasks')
const userroutes= require('./Routes/users')
const categorieroutes= require('./Routes/categorie')
const cors = require('cors')
dotenv.config()
const app = express()

const port = process.env.PORT || 4000

//middleware to analyse the on comming http request as json format
app.use(express.json())
app.use(cors())


mongoose.connect(process.env.mongodburl)
.then(()=>{
    console.log("connected to the database");
    app.listen(port,()=>{
        console.log("app listening on port ")
    })
})

app.use('/tasks',taskroutes)
app.use('/users',userroutes);
app.use('/categories',categorieroutes)
module.exports = app ;