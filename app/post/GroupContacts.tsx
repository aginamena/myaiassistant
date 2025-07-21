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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function GroupContacts({
  clientGroupChats,
  postId,
  disableSaveBtn,
  clientId,
}: {
  clientGroupChats: string;
  postId: string;
  disableSaveBtn: boolean;
  clientId: string;
}) {
  const [groupChats, setGroupChats] = useState([]);
  const [reconnectToWhatsapp, setReconnectToWhatsapp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const selectedGroups = useRef<GroupChat[]>([]);

  const router = useRouter();

  const wwebjs_server =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_WWEBJS_LOCAL_SERVER_URL
      : process.env.NEXT_PUBLIC_WWEBJS_LIVE_SERVER_URL;

  async function saveSelectedGroupsToPost() {
    if (selectedGroups.current.length == 0) {
      alert(
        "You have to select to the groups you want this post to be sent to"
      );
      return;
    }
    try {
      const body = {
        filter: { id: postId },
        document: {
          groupChats: selectedGroups.current,
          clientId,
          id: postId,
        },
      };
      await Promise.all([
        fetch(`/api/selected_groups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
        fetch(`${wwebjs_server}/schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      ]);
      alert("Groups successfully saved");
      location.reload();
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

  async function saveGroupChat(chats: GroupChat) {
    await fetch(`/api/group_chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: { clientId },
        document: { connectedGroupChatIds: chats },
      }),
    });
  }

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      try {
        if (!clientGroupChats) {
          const response = await fetch(
            `${wwebjs_server}/all_whatsapp_groups_client_is_part_of/${clientId}`
          );
          const result = await response.json();
          if (result.status) {
            setReconnectToWhatsapp(true);
            fetch("/api/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filter: { id: clientId },
                document: { connectedToWhatsapp: false },
              }),
            });
          } else if (result.error) {
            setError(true);
          } else {
            setGroupChats(result.groupChats);
            saveGroupChat(result.groupChats);
          }
        } else {
          setGroupChats(JSON.parse(clientGroupChats));
        }
      } catch (error) {
        setError(true);
        console.error(error);
      }
      setLoading(false);
    }
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography fontWeight="bold">
          Loading your whatsapp contacts. Just a moment...
        </Typography>
        <CircularProgress style={{ marginTop: "10px", marginBottom: "10px" }} />
        <Typography>
          If loading continues for more than 2mins, pls refresh the browser.
        </Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Typography variant="h6" fontWeight="bold">
        An error occurred! Pls inform Mena about this!{" "}
      </Typography>
    );
  }
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Select the groups you want to send this message to
      </Typography>
      {reconnectToWhatsapp ? (
        <Box>
          <Typography>
            Could not connect to your whatsapp. You have to authenticate again
          </Typography>
          <Button
            onClick={() => router.push(`../dashboard?tab=connect to whatsapp`)}
          >
            Reconnect to Whatsap
          </Button>
        </Box>
      ) : groupChats.length == 0 ? (
        <Typography>You have no group chats</Typography>
      ) : (
        <Box>
          <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {groupChats.map((groupChat: GroupChat) => (
              <Box
                sx={{
                  maxWidth: 345,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  boxShadow: 1,
                  margin: 2,
                }}
                key={groupChat.id}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <Avatar alt={groupChat.name} src={groupChat.profilePicture} />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ marginBottom: 0 }}>
                      {groupChat.name}
                    </Typography>
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
            disabled={disableSaveBtn}
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
            Save groups
          </Button>
        </Box>
      )}
    </Box>
  );
}
