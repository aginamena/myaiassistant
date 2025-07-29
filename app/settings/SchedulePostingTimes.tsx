"use client";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SchedulePostingTimes() {
  const [morningHours, setMorningHours] = useState<Dayjs>(
    dayjs().hour(9).minute(0)
  );
  const [eveningHours, setEveningHours] = useState<Dayjs>(
    dayjs().hour(16).minute(0)
  );
  const [loading, setLoading] = useState(false);
  const [goToNextStep, setGoToNextStep] = useState(false);

  const router = useRouter();

  const wwebjs_server =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_WWEBJS_LOCAL_SERVER_URL
      : process.env.NEXT_PUBLIC_WWEBJS_LIVE_SERVER_URL;

  async function SchedulePostingTimes() {
    setLoading(true);
    const postId = sessionStorage.getItem("postId");
    if (!postId) {
      alert("Post ID not found. Please try again.");
      setLoading(false);
      return;
    }
    const timesToPost = [
      { time: morningHours.format("hh:mm A") },
      { time: eveningHours.format("hh:mm A") },
    ];

    try {
      await Promise.all([
        fetch(`/api/posts/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: { id: postId },
            document: { timesToPost },
          }),
        }),
        fetch(`${wwebjs_server}/schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            morningHours: `${morningHours.minute()} ${morningHours.hour()} * * *`,
            eveningHours: `${eveningHours.minute()} ${eveningHours.hour()} * * *`,
          }),
        }),
      ]);

      setLoading(false);
      setGoToNextStep(true);
    } catch (error) {
      console.error("Error saving posting times:", error);
      setLoading(false);
    }
  }

  if (goToNextStep) {
    return (
      <>
        <Typography>
          Posting times saved successfully! Time to view your newly created
          post!
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("../posts")}
          sx={{
            backgroundColor: "#0018FF",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            mt: 2,
            borderRadius: "999px",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#0012cc",
            },
          }}
        >
          View your post
        </Button>
      </>
    );
  }
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography>
          Choose the times you want your post to be automatically sent to the
          selected WhatsApp groups.
        </Typography>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TimePicker
            label="Morning time"
            value={morningHours}
            onChange={(time) => setMorningHours(time as Dayjs)}
            minTime={dayjs().hour(5).minute(0)}
            maxTime={dayjs().hour(11).minute(59)}
          />
          <TimePicker
            label="Evening time"
            value={eveningHours}
            onChange={(time) => setEveningHours(time as Dayjs)}
            minTime={dayjs().hour(15).minute(0)} // 3:00 PM
            maxTime={dayjs().hour(21).minute(0)} // 9:00 PM
          />
        </Box>
      </LocalizationProvider>

      <Typography sx={{ mt: 2 }} color="textSecondary">
        Your post will be sent daily at{" "}
        <strong>{morningHours.format("hh:mm A")}</strong> and{" "}
        <strong>{eveningHours.format("hh:mm A")}</strong> to your selected
        groups.
      </Typography>

      <Button
        variant="contained"
        onClick={SchedulePostingTimes}
        disabled={loading}
        sx={{
          backgroundColor: "#0018FF",
          color: "#fff",
          textTransform: "none",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          mt: 2,
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
          "Save posting times"
        )}
      </Button>
    </Box>
  );
}
