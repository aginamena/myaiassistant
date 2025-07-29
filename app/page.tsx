"use client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import {
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const steps = [
    {
      title: "Connect Your WhatsApp Account",
      description:
        "Link your WhatsApp account to the app securely in just a few seconds.",
    },
    {
      title: "Select Your Groups",
      description:
        "Choose the WhatsApp groups where you want your product posts to be sent.",
    },
    {
      title: "Create Your First Post",
      description:
        "Upload product images, write a description, and save your post. It will automatically be sent to your selected groups.",
    },
    {
      title: "Set Your Schedule",
      description:
        "Pick the times (morning and evening) when you would like your posts to go out each day.",
    },
  ];

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Let AI Handle Your WhatsApp Group Posting
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        mb={4}
      >
        Stop wasting time manually posting to your WhatsApp groups every day.
        Let AI do the work, so you can focus on what really matters — growing
        your business.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom>
        How It Works
      </Typography>

      <List>
        {steps.map((step, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  {step.title}
                </Typography>
              }
              secondary={
                <Typography variant="body2">{step.description}</Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="body1" mt={3} color="text.secondary">
        💡 You can create unlimited posts — they’ll be automatically sent to
        your selected groups daily, right on schedule.
      </Typography>
      <Button
        variant="contained"
        onClick={
          status == "authenticated"
            ? () => router.push("settings?step=0")
            : () => signIn("google")
        }
        sx={{
          backgroundColor: "#0018FF",
          color: "#fff",
          textTransform: "none",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          mt: 4,
          borderRadius: "999px",
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "#0012cc",
          },
        }}
      >
        Create your first post now
        {status === "unauthenticated" && (
          <LockIcon style={{ marginLeft: "10px" }} />
        )}
      </Button>
    </Container>
  );
}
