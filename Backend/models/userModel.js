import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    "userOne":{type:Array,required:true},
    "userTwo":{type:Array,required:true}
});

const user =mongoose.model("ElLotteriesUser",userSchema);

export default user;