import { Posts, Users } from "@/lib/models";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AutomatePost() {
  const session = await getServerSession();
  let posts = [];
  if (session?.user) {
    const profile = await Users.findOne({ email: session.user.email });
    //sorts the posts in a way to show the last added first
    posts = await Posts.find({ clientId: profile.id }).sort({ _id: -1 });
  }
  return (
    <Box>
      <Typography
        variant="h4"
        style={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        Step 3: Click on post to set automation
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
              href={`post/${post.id}`}
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
    </Box>
  );
}
