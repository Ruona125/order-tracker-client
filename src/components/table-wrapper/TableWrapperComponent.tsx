import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableTab from "../table-tab/TableTabComponent";

const TableWrapperComponent = () => {
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
            <TableTab />
        </Paper>
      </Box>
    </div>
  );
};

export default TableWrapperComponent;
