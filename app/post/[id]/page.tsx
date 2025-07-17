import { Posts } from "@/lib/models";
import { Box } from "@mui/material";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Contacts from "../Contacts";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  const { id } = await params;

  if (session?.user) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    await Posts.findOne({ id });
  }
  // const post = await Posts.findOne({id})
  return (
    <Box>
      asfasf
      <Contacts />
    </Box>
  );
}
