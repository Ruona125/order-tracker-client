import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useSelector } from "react-redux";

import Button from "@mui/material/Button";
import moment from "moment";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

interface Column {
  id:
    | "task_id"
    | "user_id"
    | "task"
    | "status"
    | "deadline"
    | "Modify"
    | "name"
    | "Delete";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface Data {
  task: string;
  status: string;
  deadline: any;
  task_id: any;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 10 },
  { id: "task", label: "Tasks", minWidth: 10 },
  { id: "status", label: "Staus", minWidth: 10 },
  { id: "deadline", label: "Deadline", minWidth: 10 },
  { id: "Modify", label: "Modify", minWidth: 10 },
  { id: "Delete", label: "Delete", minWidth: 10 },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
};

const TaskComponent: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Tasks, setTasks] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Data | null>(null);
  const handleOpen = (task: Data) => {
    setTaskToDelete(task);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const { token, roles } = useSelector((state: any) => state.user.userDetails);

  const calculateCountdown = (endTime: string) => {
    const currentTime = moment();
    const endTimeMoment = moment(endTime); // Use the endTime directly as a valid date-time string
    const duration = moment.duration(endTimeMoment.diff(currentTime));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const fetchTask = () => {
      const url = "https://order-tracker-api-production.up.railway.app/task";
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      axios.get<Data[]>(url, { headers }).then((response) => {
        setTasks(response.data);
        // console.log(response.data);
      });
    };

    fetchTask(); // Fetch tasks initially

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          "Countdown Timer": calculateCountdown(task.deadline),
        }))
      );
    }, 1000);

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);

  const handleChangePage = (event: any) => {
    setPage(event.newPage);
    setSearchQuery("");
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setSearchQuery("");
  };

  const handleDelete = (taskId: string) => {
    const url = `https://order-tracker-api-production.up.railway.app/task/${taskId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    axios
      .delete(url, { headers })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.task_id !== taskId)
        );
        setTaskToDelete(null);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setDeleted(false);
  }, [Tasks, searchQuery]);

  return (
    <>
      <div className="topnav">
        <input
          type="text"
          placeholder="Search.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) =>
                  // Only render Modify and Delete columns if the role is admin
                  (column.id === "Modify" || column.id === "Delete") &&
                  roles !== "admin" ? null : (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {Tasks.filter((Tasks) =>
                Object.values(Tasks)
                  .join(" ")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((task) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={task.task_id}
                  >
                    {columns.map((column) => {
                      const value = (task as any)[
                        column.id.toLowerCase().replace(" ", "_")
                      ];

                      if (column.id === "Modify" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link to={`/updateTasks/${task.task_id}`}>
                              <Button variant="contained">Modify</Button>
                            </Link>
                          </TableCell>
                        );
                      }

                      if (column.id === "deadline") {
                        const countdown = calculateCountdown(value); // Calculate countdown timer
                        return (
                          <TableCell key={column.id} align="center">
                            {countdown}
                          </TableCell>
                        );
                      }

                      if (column.id === "Delete" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Button
                              variant="contained"
                              onClick={() => handleOpen(task)}
                              disabled={deleted} // Disable button if task is already deleted
                            >
                              Delete
                            </Button>
                            <Modal
                              aria-labelledby="transition-modal-title"
                              aria-describedby="transition-modal-description"
                              open={open}
                              onClose={handleClose}
                              closeAfterTransition
                              slots={{ backdrop: Backdrop }}
                              slotProps={{
                                backdrop: {
                                  timeout: 500,
                                },
                              }}
                            >
                              <Fade in={open}>
                                <Box sx={style}>
                                  <Typography
                                    id="transition-modal-title"
                                    variant="h6"
                                    component="h2"
                                  >
                                    Are you sure you want to delete this?
                                  </Typography>
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      if (taskToDelete) {
                                        handleDelete(taskToDelete.task_id);
                                      }
                                    }}
                                    color="primary"
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    variant="contained"
                                    onClick={handleClose}
                                    color="primary"
                                  >
                                    No
                                  </Button>
                                </Box>
                              </Fade>
                            </Modal>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={column.id} align="center">
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={Tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default TaskComponent;
