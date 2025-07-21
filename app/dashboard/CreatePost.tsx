"use client";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data } = useSession();

  async function createPost() {
    if (description.length == 0) {
      alert("You need some description for the post");
      return;
    }
    setLoading(true);
    const req = await fetch("api/users");
    const profile = await req.json();
    const postId = Date.now().toString();
    if (data?.user) {
      fetch(`/api/posts/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: { id: postId },
          document: {
            description,
            id: postId,
            clientId: profile.id,
            images,
          },
        }),
      });
    }
    setLoading(false);
    alert(
      "Post saved. Next is to select the groups you want this post to be send to - automate post!"
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getImageUrl(result: any) {
    setImages((url) => [...url, result.info.secure_url]);
  }
  return (
    <Box>
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        Step 2: Create the post
      </Typography>
      <Typography variant="body1">
        Note: This post will be posted to your selected groups everyday, 8am and
        3pm
      </Typography>

      <Box
        style={{
          border: "2px solid gray",
          padding: "20px",
          textAlign: "center",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <Typography>Select the images for this post. Maximum of 7</Typography>
        <CldUploadWidget
          options={{
            sources: ["local", "camera"],
            multiple: true,
            maxFiles: 7,
            clientAllowedFormats: ["jpg", "jpeg", "png"],
            resourceType: "image",
            cropping: false,
          }}
          uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
          onSuccess={getImageUrl}
        >
          {({ open }) => {
            return (
              <button onClick={() => open()}>Upload Multiple Images</button>
            );
          }}
        </CldUploadWidget>
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description of the post"
      />
      <Box style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={createPost}
          sx={{
            backgroundColor: "#0018FF",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: "999px",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#0012cc",
            },
          }}
        >
          Create Post Now
        </Button>
        {loading && <CircularProgress />}
      </Box>
    </Box>
  );
}
