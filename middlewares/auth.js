import  jwt  from "jsonwebtoken"
import userModel from "../model/userSchema.js";


export const userAuth = (req,res,next) => {
    try{
        let token = req.headers?.authorization?.split(' ')[1];
        if(token){
            jwt.verify(token,process.env.TOKEN_SECRET,(err,result)=>{
                if(err){
                    res.status(401).json({ authorization: false });
                }else{
                    userModel.findOne({_id:result.userId}).then((user)=>{
                        if(user){
                            req.userLogged = user._id;
                            next()
                        }else{
                            res.status(401).json({ authorization: false });
                        } 
                    })
                }
            })
        }else{
            console.log('asdsa')
            res.status(401).json({ authorization: false });
        }
    }catch(err){
        console.log(err)
        res.status(500);
    }
}