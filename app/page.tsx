"use client";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Button, Container, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  return (
    <Container>
      <Box
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h3"
            style={{ marginBottom: "20px" }}
            fontWeight="bold"
          >
            Let A.I. post your products while you run your business.
          </Typography>

          <Button
            variant="contained"
            onClick={
              status == "authenticated"
                ? () => router.push("dashboard?tab=connect to whatsapp")
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
    </Container>
  );
}
