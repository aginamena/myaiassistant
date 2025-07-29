import { Posts } from "@/lib/models";
import { GroupChat } from "@/lib/types";
import { Avatar, Box, Container, Typography } from "@mui/material";
import mongoose from "mongoose";
import ImageGalleryCmp from "../ImageGalleryCmp";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await mongoose.connect(process.env.MONGODB_URI as string);
  const post = await Posts.findOne({ id });

  return (
    <Container sx={{ mt: 4, mb: 4, textAlign: "center" }}>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Post Preview
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textDecoration: "underline",
              mt: 1,
              color: "text.secondary",
            }}
          >
            This post will be automatically sent to your selected groups every
            day at <strong>{post.timesToPost[0].time}</strong> and{" "}
            <strong>{post.timesToPost[1].time}</strong>.
          </Typography>

          {post.images.length > 0 && (
            <ImageGalleryCmp
              images={post.images.map((image: string) => ({
                thumbnail: image,
                original: image,
              }))}
            />
          )}

          <Typography sx={{ mt: 3, fontSize: "1rem" }}>
            {post.description}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Groups This Post Will Be Sent To
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {post.groupChats.map((groupChat: GroupChat) => (
              <Box
                sx={{
                  maxWidth: 345,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  boxShadow: 1,
                  m: 2,
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
                  <Avatar alt={groupChat.name} src={groupChat.profilePicture} />
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 0, fontSize: "1rem", fontWeight: 500 }}
                    >
                      {groupChat.name}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
