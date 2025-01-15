const Task = require('../Models/taskModels')
module.exports={
    AddTask:async (req , res,next )=>{     
        try{        
                    const ui = req.user._id
                    if((await Task.countDocuments({title:req.body.title,user_id:ui}))==0){
                        const t = await Task.create({title:req.body.title,desc:req.body.desc,status:req.body.status,category:req.body.category,time:req.body.time,user_id:ui}) 
                        res.status(200).json(t)
                        
                    }
                    else
                    {
                        res.json({"message":"Tasks allready exists for this user"})
                    }    
            }
             
            catch(error){
                console.log(error.message)
             res.status(400).json({error:error})
        }
    }
    ,
    ShowTasks:async (req , res , next)=>{
        const ui = req.user._id
        if((await Task.countDocuments({user_id:ui})==0)){
            res.status(404).json({"message":"no Tasks for this user"})
        }else{
            const results = await Task.find({user_id:ui}).sort({createdAt:-1})
            res.status(200).json(results)
        }
    }
    ,
    ShowTask:async(req , res , next )=>{
        try{
            if((await Task.countDocuments({title:req.params.title})==0)){
                res.status(200).json({"message":"no Tasks exist here"})
            }else{
                const results = await Task.findOne({title:req.params.title})
                if(results){
                    res.status(200).json(results)
                }else{
                    res.status(404).json({"message":"couldnt find this Task for the user"})
                }
            }
        }catch(error){
            res.status(400).json(error.message)
        }
    }
    ,
    DeleteTask:async(req,res,next)=>{
        const ui = req.user._id
        const id = req.params.id
        try{
            
            if((await Task.countDocuments({_id:id}))==0){
                res.status(404).json({"message":"couldnt find this Task mate"})
                console.log('could not find the task')
            }else{
                const deletedmovies = await Task.deleteOne({_id:id})
                res.status(200).json({"message":"Task was deleted successfully"})
                console.log('found the task')
               
            }

        }catch(error){
            res.status(400).json(error.message)
            console.log(error.message)
        } 
    }
    ,
    ModifieTask:async(req,res,next)=>{
        console.log("request sent from the front")
        const ui = req.user._id
        const {id} = req.params
        try{  
            console.log("modification request sent from front")
            const task = await Task.findByIdAndUpdate(
                id,
                {title:req.body.title,category:req.body.category,status:req.body.status,desc:req.body.desc,time:req.body.time},
                { new: true }
              );
            if(!task){
                res.status(400).send('task not found')
            }else{
                res.status(200).json(task)
            }
        }catch(error){
            res.status(400).json(error.message)
            console.log(error.message)
            
        }
        
    }
}