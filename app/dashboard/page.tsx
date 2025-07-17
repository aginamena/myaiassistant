import { Box, Toolbar } from "@mui/material";
import AutomatePost from "./AutomatePost";
import CreatePost from "./CreatePost";
import PageStructure from "./PageStructure";
import ScanQRData from "./ScanQRData";

export default async function ResponsiveDrawerTabs({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
  }>;
}) {
  const drawerWidth = 240;
  const { tab } = await searchParams;
  const tabs = new Map();
  tabs.set("connect to whatsapp", <ScanQRData />);
  tabs.set("create post", <CreatePost />);
  tabs.set("automate post", <AutomatePost />);

  return (
    <Box sx={{ display: "flex" }}>
      <PageStructure />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {tabs.get(tab)}
      </Box>
    </Box>
  );
}
