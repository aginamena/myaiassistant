import mongoose from "mongoose";

const {Schema} = mongoose

const userSchema = new Schema({
    email:String,
    id:String,
    name:String,
    image:String,
    connectedToWhatsapp:Boolean
})

const postSchema = new Schema({
    id:String,
    creatorsEmail:String,
    description:String
})

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);
const Posts = mongoose.models.Posts || mongoose.model('Posts', postSchema);

export {
    Users,
    Posts
}
