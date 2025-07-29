import mongoose from "mongoose";

const {Schema} = mongoose

const userSchema = new Schema({
    email:String,
    id:String, //clientId
    name:String,
    image:String,
    connectedToWhatsapp:Boolean,
    groupChats:[{
      name:String,
      id:String,
      profilePicture:String
    }]
})

const postSchema = new Schema({
    id:String, //postid
    clientId:String, //clientId
    email:String, //email of the user
    description:String,
    images:[{type:String}],
    groupChats:[{
      name:String,
      id:String,
      profilePicture:String
    }],
    timesToPost:[{
      time:String, //time in HH:MM format
    }]
})

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);
const Posts = mongoose.models.Posts || mongoose.model('Posts', postSchema);

export {
    Users,
    Posts,
}
