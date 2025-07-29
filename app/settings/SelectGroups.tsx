"use client";

import { GroupChat } from "@/lib/types";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SelectedGroups() {
  const { data } = useSession();

  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [goToNextStep, setGoToNextStep] = useState(false);
  const [savingSelectedGroups, setSavingSelectedGroups] = useState(false);

  const selectedGroups = useRef<GroupChat[]>([]);
  const router = useRouter();

  const wwebjs_server =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_WWEBJS_LOCAL_SERVER_URL
      : process.env.NEXT_PUBLIC_WWEBJS_LIVE_SERVER_URL;

  async function saveGroupChats(groupChats: GroupChat) {
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: { email: data?.user?.email ?? "" },
          document: { groupChats },
        }),
      });
    } catch (error) {
      console.error("Error saving group chats:", error);
    }
  }
  async function saveSelectedGroupsToPost() {
    setSavingSelectedGroups(true);
    if (selectedGroups.current.length == 0) {
      alert(
        "You have to select at least 1 group you want this post to be sent to"
      );
      return;
    }
    const postId = Date.now().toString();
    sessionStorage.setItem("postId", postId);
    const clientId = sessionStorage.getItem("clientId");
    try {
      const body = {
        filter: { id: postId },
        document: {
          groupChats: selectedGroups.current,
          email: data?.user?.email,
          id: postId,
          clientId,
        },
      };
      await fetch(`/api/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setGoToNextStep(true);
    } catch (error) {
      console.error(error);
    }
  }
  function handleCheckedGroup(groupInfo: GroupChat, isChecked: boolean) {
    if (isChecked) {
      selectedGroups.current.push(groupInfo);
    } else {
      selectedGroups.current = selectedGroups.current.filter(
        (group) => group.id !== groupInfo.id
      );
    }
  }
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const profile = await (await fetch("api/users")).json();

        if (profile.groupChats?.length > 0) {
          setGroups(profile.groupChats);
        } else {
          const { groupChats } = await (
            await fetch(`${wwebjs_server}/all-groups/${profile.id}`)
          ).json();
          saveGroupChats(groupChats);
          setGroups(groupChats);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Fetching your WhatsApp groups...
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }} color="text.secondary">
          Please hold on while we load your groups.
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (goToNextStep) {
    return (
      <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Groups saved successfully!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You are all set to create your first post.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("settings?step=2")}
          sx={{
            backgroundColor: "#0018FF",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            mt: 3,
            borderRadius: "999px",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#0012cc",
            },
          }}
        >
          Create your post
        </Button>
      </>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select the WhatsApp groups you want to post to:
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {groups.map((groupChat) => (
          <Box
            key={groupChat.id}
            sx={{
              maxWidth: 345,
              border: "1px solid #ddd",
              borderRadius: 2,
              boxShadow: 1,
              m: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                borderBottom: "1px solid #eee",
              }}
            >
              <Avatar alt={groupChat.name} src={groupChat.profilePicture} />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1">{groupChat.name}</Typography>
              </Box>
              <Checkbox
                sx={{ ml: "auto" }}
                onChange={(e) =>
                  handleCheckedGroup(
                    {
                      id: groupChat.id,
                      name: groupChat.name,
                      profilePicture: groupChat.profilePicture,
                    },
                    e.target.checked
                  )
                }
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Button
        variant="contained"
        onClick={saveSelectedGroupsToPost}
        disabled={savingSelectedGroups}
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
        {savingSelectedGroups ? (
          <>
            Saving...
            <CircularProgress size={20} sx={{ color: "#fff", ml: 2 }} />
          </>
        ) : (
          "Save selected groups"
        )}
      </Button>
    </Box>
  );
}
