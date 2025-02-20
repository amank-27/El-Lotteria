import user from "../models/userModel.js";

export async function saveSet(req,res){

    try{
        const {userOne,userTwo}= req.body;
        const newUser= new user({
            userOne,userTwo
        });
       const response= await newUser.save();

    return res.status(201).json({_id:response._id});

}
catch(err){
    console.log(err)
    return res.status(500).json(err.message);
}
}

export async function changeandcheck(req,res){

    try{
        const {_id,array,userNum}= req.body;
        let game;
        if(userNum==1)
       {  game= await user.updateOne({_id:_id},{ $set: { userOne:array} });}
        if(userNum==2){
             game= await user.updateOne({_id:_id},{ $set: { userTwo:array} });
        }
        return res.status(200).json({victory:false});
 }
 catch(err){
     return res.status(500).json(err);
 }
 }
 