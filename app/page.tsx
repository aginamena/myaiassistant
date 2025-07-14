import { Box, Button, Grid, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box>
      <Box>
        <Typography variant="h3">
          Let A.I. post your products while you run your business.
        </Typography>
        <Link href="home">
          <Button
            variant="contained"
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
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
