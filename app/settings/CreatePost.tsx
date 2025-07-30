"use client";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [goToNextStep, setGoToNextStep] = useState(false);

  const router = useRouter();

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
    const postId = sessionStorage.getItem("postId");
    if (!postId) {
      alert("Post ID not found. Please try again.");
      setLoading(false);
      return;
    }
    const imageUrls = images.length > 0 ? await getImageUrls() : [];
    fetch(`/api/posts/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { id: postId },
        document: {
          description,
          images: imageUrls,
        },
      }),
    });

    setLoading(false);
    setGoToNextStep(true);
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

  if (goToNextStep) {
    return (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your post has been saved!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Now, let’s set the times you want this post to be automatically sent
          to your selected WhatsApp groups.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("settings?step=4")}
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
          Set posting times
        </Button>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          border: "2px solid #ccc",
          padding: 3,
          textAlign: "center",
          mb: 3,
          mt: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Upload images for this post (maximum of 7)
        </Typography>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginBottom: "20px" }}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            mt: 2,
          }}
        >
          {images.map((image, key) => (
            <Image
              key={key}
              src={URL.createObjectURL(image)}
              height={200}
              width={200}
              alt="Post image preview"
              style={{ objectFit: "cover", borderRadius: 8 }}
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
        placeholder="Write a short description for your post"
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={createPost}
        disabled={loading}
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
        {loading ? (
          <>
            Saving...
            <CircularProgress size={20} sx={{ color: "#fff", ml: 2 }} />
          </>
        ) : (
          "Save post"
        )}
      </Button>
    </>
  );
}
