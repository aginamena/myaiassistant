"use client";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const { data } = useSession();
  async function createPost() {
    if (data?.user) {
      fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: { id: Date.now().toString() },
          document: {
            description,
            creatorsEmail: data.user.email,
          },
          collection: "Posts",
        }),
      });
    }
  }
  return (
    <Box>
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        Step 2: Create the post you want to automate
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description of the post"
      />
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
          marginTop: "20px",
          borderRadius: "999px",
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "#0012cc",
          },
        }}
      >
        Create Post Now
      </Button>
    </Box>
  );
}
