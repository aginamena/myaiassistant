import { Posts } from "@/lib/models";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AllPosts() {
  const session = await getServerSession();
  let posts = [];
  if (session?.user) {
    //sorts the posts in a way to show the last added first
    await mongoose.connect(process.env.MONGODB_URI as string);
    posts = await Posts.find({ email: session.user.email }).sort({ _id: -1 });
  }
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        All Posts
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
        Here are all the posts you have created. Click on a post to view its
        details.
      </Typography>

      <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {posts.length == 0 ? (
          <Typography>
            You have no posts. Go to create post to create one.
          </Typography>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`posts/${post.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  {post.images.length > 0 && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={post.images[0]}
                      alt="green iguana"
                    />
                  )}
                  <CardContent>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {post.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))
        )}
      </Box>
    </Container>
  );
}
