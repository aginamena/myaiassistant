import { Box, Toolbar, Typography } from "@mui/material";
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
  tabs.set("settings", <ScanQRData />);
  tabs.set("create post", <Typography>create post</Typography>);
  tabs.set("profile", <Typography>Profile Content</Typography>);

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
