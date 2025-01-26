import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Avatar, Tooltip, IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { useContext, useState } from "react";
import { UserContext } from "../Context";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);
  const username = user.username;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const pages = ["Home", "Meetups", "Forum"];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    setUser({
      id: 0,
      username: "",
      email: "",
      isAdmin: false,
    });
    document.cookie =
      "CarerConnect_user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navBarNavigate("login");
  };

  // Function uses react-router-dom to navigate to the selected route,
  // using the replace: true to change the url for the user
  const navBarNavigate = (page: string) => {
    navigate(page === "Home" ? "/" : `/${page.toLowerCase()}`, {
      replace: true,
    });
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              textAlign: "left",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <AddCommentIcon
              sx={{
                fontSize: "1.8rem",
                marginTop: "0px",
                alignSelf: "center",
              }}
            />
            CarerConnect
          </Typography>
          {/* Only show user details and navigation options if we have a logged in user */}
          {username && (
            <>
              {/* Desktop Navigation */}
              <Box
                sx={{
                  flexGrow: 1,
                  justifyContent: "flex-end",
                  display: { xs: "none", sm: "flex" },
                }}
              >
                {pages.map((page, index) => (
                  <Tooltip key={index} title={`View ${page} page`}>
                    <Button
                      onClick={() => navBarNavigate(page)}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  </Tooltip>
                ))}
              </Box>

              {/* Mobile Navigation */}
              <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleMobileMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchorEl}
                  open={Boolean(mobileMenuAnchorEl)}
                  onClose={handleClose}
                  keepMounted
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {pages.map((page, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => navBarNavigate(page)}
                      sx={{
                        color: "secondary.main",
                      }}
                    >
                      {page}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* User Menu */}
              <div>
                <Button color="inherit" onClick={handleMenu}>
                  {username && (
                    <Avatar>
                      {username
                        .split(" ")
                        .map((name) => name[0])
                        .slice(0, 2)
                        .join("")}
                    </Avatar>
                  )}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{ marginTop: "10px" }}
                >
                  <MenuItem>
                    <Typography variant="h6" color="secondary">
                      {username}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Box sx={{ width: "100%" }}>
                      <Typography
                        variant="body1"
                        color="error"
                        sx={{ textAlign: "center" }}
                      >
                        Logout
                      </Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
