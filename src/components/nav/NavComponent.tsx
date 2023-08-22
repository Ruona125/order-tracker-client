import React, {
  useState,
  KeyboardEvent,
  MouseEvent,
  useRef,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { RootState } from "../../Redux/rootReducer";
import { logout } from "../../Redux/User/userAction";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

type Anchor ="left" | "top" | "bottom" ;

const NavComponent: React.FC = () => {
  const { roles, token } = useSelector((state: any) => state.user.userDetails);

  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const navigate = useNavigate();

  const [state, setState] = useState<{ [key in Anchor]: boolean }>({
    left: false,
    top: false,
    bottom: false,
  });
  

  const toggleDrawer =
    (
      anchor: Anchor,
      open: boolean
    ): ((event: KeyboardEvent | MouseEvent) => void) =>
    (event) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const handleLogout = () => {
    dispatch(logout(token));
    navigate("/");
  };

  //auto logout

  const timeOut = 3600000;
  const logoutTimer = useRef<number | null>(null);

  useEffect(() => {
    const startTimeout = () => {
      logoutTimer.current = setTimeout(() => {
        dispatch(logout(token));
        navigate("/");
      }, timeOut);
    };

    const resetTimeout = () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
      startTimeout();
    };

    startTimeout();
    resetTimeout();

    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, [dispatch, navigate, timeOut, token]);

  const list = (anchor: Anchor) => {
    const menuItems = [
      "Home",
      "Create Customer",
      "Reports",
      "Ongoing Order",
      "Change Password",
    ];
    if (roles === "admin") {
      menuItems.splice(1, 0, "Create Staff Account");
      menuItems.splice(2, 0, "Staff Accounts");
    } else if (roles === "staff") {
      menuItems.splice(3, 0, "task");
    }
    return (
      <Box
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {menuItems.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  text === "Create Customer"
                    ? "/create-customer"
                    : text === "Reports"
                    ? "/reports"
                    : text === "Create Staff Account"
                    ? "/staff-account"
                    : text === "Staff Accounts"
                    ? "/staffs"
                    : text === "Home"
                    ? "/home"
                    : text === "Ongoing Order"
                    ? "/ongoing-order"
                    : text === "task"
                    ? "/task"
                    : text === "Change Password"
                    ? "/change-password"
                    : ""
                }
              >
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: "red" }}>
          <Toolbar>
            {(["left"] as const).map((anchor) => (
              <React.Fragment key={anchor}>
                <Button onClick={toggleDrawer(anchor, true)}>
                  <MenuIcon className="menu-icon" />
                </Button>
                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Order Tracker 
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default NavComponent;
