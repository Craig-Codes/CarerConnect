// Page controls the user login / register functionality

import { AppBar, Box, Paper, Tab, Tabs } from "@mui/material";
import LoginForm from "../components/LoginForm";
import { useState } from "react";
import RegisterForm from "../components/RegisterForm";

// Required tab properties to switch between the login / register tabs
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

// Function controls which tab value is shown under the tabs header
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const LoginPage = () => {
  const [value, setValue] = useState(0); // state stores currently selected tab

  // function unpades the selected tab, capturing the tab click event
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper id="login-paper" elevation={5} sx={{ padding: "40px" }}>
        <AppBar position="static">
          {/* Render the tabs for the user */}
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              "& .MuiTabs-indicator": {
                height: 5,
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </AppBar>
        {/* If tab 0 is selected show LoginForm, if tab 1 is selected show register form */}
        <TabPanel value={value} index={0}>
          <LoginForm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RegisterForm />
        </TabPanel>
      </Paper>
    </>
  );
};
