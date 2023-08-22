import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ReportTab from "../table-tab/ReportTab";


const ReportTableWrapper = () => {
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
            <ReportTab />
        </Paper>
      </Box>
    </div>
  );
};

export default ReportTableWrapper;