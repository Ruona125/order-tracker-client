import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import OngoingOrderTab from "../table-tab/OngoingOrderTab";


const OngointOrderTableWrapper = () => {
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
            <OngoingOrderTab />
        </Paper>
      </Box>
    </div>
  );
};

export default OngointOrderTableWrapper;