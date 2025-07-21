import { GroupChats, Posts, SelectedGroupsToPost } from "@/lib/models";
import { GroupChat } from "@/lib/types";
import { Avatar, Box, Container, Typography } from "@mui/material";
import mongoose from "mongoose";
import GroupContacts from "../GroupContacts";
import ImageGalleryCmp from "../ImageGalleryCmp";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await mongoose.connect(process.env.MONGODB_URI as string);
  const post = await Posts.findOne({ id });
  const groupChats = await GroupChats.findOne({ clientId: post.clientId });
  const selectedGroupsToPost = await SelectedGroupsToPost.findOne({ id });
  const excludedIds = new Set(
    selectedGroupsToPost?.groupChats.map((gc: GroupChat) => gc.id)
  );
  const filteredGroupChats = groupChats?.connectedGroupChatIds.filter(
    (chat: GroupChat) => !excludedIds.has(chat.id)
  );

  return (
    <Container style={{ textAlign: "center" }}>
      <Box>
        {selectedGroupsToPost && (
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Here are the groups this message will be sent to
            </Typography>

            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {selectedGroupsToPost.groupChats.map((groupChat: GroupChat) => (
                <Box
                  sx={{
                    maxWidth: 345,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    boxShadow: 1,
                    margin: 2,
                  }}
                  key={groupChat.id}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: 2,
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <Avatar
                      alt={groupChat.name}
                      src={groupChat.profilePicture}
                    />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" sx={{ marginBottom: 0 }}>
                        {groupChat.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <Box sx={{ mb: 5, mt: 5 }}>
          <Typography variant="h4" fontWeight="bold">
            Post Content
          </Typography>
          <Typography variant="body1" style={{ textDecoration: "underline" }}>
            Note: This post will be posted to your selected groups everyday, 8am
            and 3pm
          </Typography>
          {post.images.length > 0 && (
            <ImageGalleryCmp
              images={post.images.map((image: string) => ({
                thumbnail: image,
                original: image,
              }))}
            />
          )}

          <Typography sx={{ mt: 3 }}>{post.description}</Typography>
        </Box>
        <GroupContacts
          clientGroupChats={
            filteredGroupChats?.length > 0
              ? JSON.stringify(filteredGroupChats)
              : ""
          }
          postId={id}
          disableSaveBtn={selectedGroupsToPost ? true : false}
          clientId={post.clientId}
        />
      </Box>
    </Container>
  );
}
