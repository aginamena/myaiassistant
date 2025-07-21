"use client";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { data } = useSession();

  async function getImageUrls() {
    const uploadPromises = images.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_UPLOAD_PRESET as string
      );

      return fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());
    });

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map((result) => result.secure_url);
    return imageUrls;
  }

  async function createPost() {
    if (description.length == 0) {
      alert("You need some description for the post");
      return;
    }
    setLoading(true);
    const req = await fetch("api/users");
    const profile = await req.json();
    const postId = Date.now().toString();
    const imageUrls = images.length > 0 ? await getImageUrls() : [];
    console.log(imageUrls);
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
            images: imageUrls,
          },
        }),
      });
    }
    setLoading(false);
    setImages([]);
    setDescription("");
    alert(
      "Post saved. Next is to select the groups you want this post to be send to - automate post!"
    );
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    if (images.length + newFiles.length > 7) {
      alert("The maximum number of images is 7");
      return;
    }
    setImages((prev) => [...prev, ...newFiles]);
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
        <input
          type="file"
          multiple
          accept="image/*"
          style={{ marginTop: "20px", marginBottom: "20px" }}
          onChange={handleImageUpload}
        />
        <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {images.map((image, key) => (
            <Image
              key={key}
              src={URL.createObjectURL(image)}
              height={200}
              width={200}
              alt="post pictures"
              style={{ objectFit: "cover" }}
            />
          ))}
        </Box>
      </Box>
      <TextField
        fullWidth
        multiline
        value={description}
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
