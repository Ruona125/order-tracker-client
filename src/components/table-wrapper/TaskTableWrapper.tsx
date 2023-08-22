import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TaskTab from "../table-tab/TaskTab";

const TaskTableWrapper = () => {
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
            <TaskTab />
        </Paper>
      </Box>
    </div>
  );
};

export default TaskTableWrapper;