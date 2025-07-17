import { Posts } from "@/lib/models";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AutomatePost() {
  const session = await getServerSession();
  let posts = [];
  if (session?.user) {
    posts = await Posts.find({ creatorsEmail: session.user.email });
  }

  return (
    <Box>
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        Step 3: Set automation on posts
      </Typography>
      {posts.map((post) => (
        <Link key={post.id} href={`post/${post.id}`}>
          <Card sx={{ maxWidth: 345 }}>
            {/* <CardMedia
              component="img"
              height="194"
              s
              image="/static/images/cards/paella.jpg"
              alt="Paella dish"
            /> */}
            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                This impressive paella is a perfect party dish and a fun meal to
                cook together with your guests. Add 1 cup of frozen peas along
                with the mussels, if you like.
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Box>
  );
}
