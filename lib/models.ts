import mongoose from "mongoose";

const {Schema} = mongoose

const userSchema = new Schema({
    email:String,
    id:String, //clientId
    name:String,
    image:String,
    connectedToWhatsapp:Boolean
})

const postSchema = new Schema({
    id:String, //postid
    clientId:String, //clientId of the user
    description:String,
    images:[{type:String}]
})

const groupChatSchema = new Schema({
  clientId: String, // clientId of the user
  connectedGroupChatIds: [
    {
      id: String,
      name: String,
      profilePicture: String,
    },
  ],
});

const selectedGroupsToPostSchema = new Schema({
    id:String, //refers to the postId
    clientId:String, //clientId of the user
    groupChats:[{
      id: String,
      name: String,
      profilePicture: String,
    }]
})

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);
const Posts = mongoose.models.Posts || mongoose.model('Posts', postSchema);
const GroupChats = mongoose.models.GroupChats || mongoose.model('GroupChats', groupChatSchema);
const SelectedGroupsToPost = mongoose.models.SelectedGroupsToPost || mongoose.model('SelectedGroupsToPost', selectedGroupsToPostSchema);
export {
    Users,
    Posts,
    GroupChats,
    SelectedGroupsToPost
}
