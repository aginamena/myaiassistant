import mongoose from "mongoose";

const {Schema} = mongoose

const userSchema = new Schema({
    email:String,
    id:String,
    name:String,
    image:String
})

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);
export default Users;