"use client";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  return (
    <Box>
      <Box>
        <Typography variant="h3">
          Let A.I. post your products while you run your business.
        </Typography>

        <Button
          variant="contained"
          onClick={
            status == "authenticated"
              ? () => router.push("dashboard?tab=settings")
              : () => signIn("google")
          }
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
          Tell A.I. what products to post for you
          {status === "unauthenticated" && (
            <LockIcon style={{ marginLeft: "10px" }} />
          )}
        </Button>
      </Box>
    </Box>
  );
}
