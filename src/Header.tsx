import { IconButton, InputBase, Menu, MenuItem, Toolbar } from "@mui/material";
import { useState } from "react";
import { MoreHoriz as MoreHorizIcon } from "@mui/icons-material";

function Header({
  search,
  onSearchChange,
  setShowProgressDialog,
}: {
  search: string;
  onSearchChange: (newSearch: string) => void;
  setShowProgressDialog: (show: boolean) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Toolbar disableGutters sx={{ padding: 1, bgcolor: "#222", color: "#fff" }}>
      <InputBase
        size="small"
        fullWidth
        placeholder="Search…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          backgroundColor: "#444",
          color: "#fff",
          borderRadius: "999px",
          padding: "8px 16px",
        }}
      />
      <IconButton
        aria-label="More"
        color="inherit"
        sx={{ marginLeft: 0.5 }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ sx: { bgcolor: "#222", color: "#fff", borderRadius: 0 } }}
      >
        <MenuItem sx={{ bgcolor: "#222", color: "#fff" }}>View as</MenuItem>
        <MenuItem sx={{ bgcolor: "#222", color: "#fff" }}>Sort by</MenuItem>
        <MenuItem
          sx={{ bgcolor: "#222", color: "#fff" }}
          onClick={() => {
            setAnchorEl(null);
            setShowProgressDialog(true);
          }}
        >
          Progress
        </MenuItem>
      </Menu>
    </Toolbar>
  );
}

export default Header;
