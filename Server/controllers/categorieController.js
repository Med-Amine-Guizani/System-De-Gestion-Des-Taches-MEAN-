const Categorie = require('../Models/categorieModels')



module.exports={
    AddCategorie:async (req , res,next )=>{     
        try{       
            
                    const ui = req.user._id
                    if((await Categorie.countDocuments({title:req.body.title,user_id:ui}))==0){
                        const t = await Categorie.create({title:req.body.title,user_id:ui}) 
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
    ShowUserCategories:async (req , res , next)=>{
        const ui = req.user._id
        if((await Categorie.countDocuments({user_id:ui})==0)){
            res.status(404).json({"message":"no Tasks for this user"})
        }else{
            const results = await Categorie.find({user_id:ui}).sort({createdAt:-1})
            res.status(200).json(results)
        }
    }
    
}