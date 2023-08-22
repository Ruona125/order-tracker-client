import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import StaffTab from "../table-tab/StaffTab";

const StaffTableWrapper = () => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Paper sx={{ width: "95%", height: "95%" }} elevation={22}>
            <StaffTab />
        </Paper>
      </Box>
    </div>
  );
};

export default StaffTableWrapper;