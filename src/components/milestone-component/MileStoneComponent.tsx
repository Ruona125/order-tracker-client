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
// import { RootState } from "../../Redux/rootReducer";
import Button from "@mui/material/Button";
import moment from "moment";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

interface Column {
  id:
    | "Milestone Id"
    | "Milestone Status"
    | "Description"
    | "Countdown Timer"
    | "Order Id"
    | "Order Number"
    | "full_name"
    | "Modify"
    | "Delete";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface Data {
  "Milestone Status": string;
  milestone_id: string;
  Description: string;
  "Order Number": number;
  Details: string;
  countdown_timer: any;
  // costOfMilestone: number; // Added property for cost of milestone
}

const columns: readonly Column[] = [
  { id: "Milestone Status", label: "Milestone Status", minWidth: 100 },
  { id: "Description", label: "Description", minWidth: 100 },
  { id: "Countdown Timer", label: "Countdown Timer", minWidth: 100 },
  { id: "Order Number", label: "Order Number", minWidth: 100 },
  { id: "full_name", label: "Full Name", minWidth: 100 },
  { id: "Modify", label: "Modify", minWidth: 100 },
  { id: "Delete", label: "Delete", minWidth: 100 },
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

const MilestoneComponent: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Milestones, setMilestones] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleted, setDeleted] = useState(false); // New state for deletion
  const [open, setOpen] = React.useState(false);
  const [mileStoneToDelete, setMileStoneToDelete] = useState<Data | null>(null);

  const handleOpen = (milestone: Data) => {
    setMileStoneToDelete(milestone);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const { token, roles } = useSelector((state: any) => state.user.userDetails);

  const calculateCountdown = (endTime: string) => {
    const currentTime = moment();
    const endTimeMoment = moment(endTime); // Use the endTime directly as a valid date-time string
    const duration = moment.duration(endTimeMoment.diff(currentTime));
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const fetchMilestones = () => {
      const url = "http://localhost:8000/milestone";
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      axios.get<Data[]>(url, { headers }).then((response) => {
        setMilestones(response.data);
        // console.log(response.data);
      });
    };

    fetchMilestones(); // Fetch milestones initially

    const interval = setInterval(() => {
      setMilestones((prevMilestones) =>
        prevMilestones.map((milestone) => ({
          ...milestone,
          "Countdown Timer": calculateCountdown(milestone.countdown_timer),
        }))
      );
    }, 1000);

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []); // Empty dependency array, so it runs only once on mount

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(isNaN(newPage) ? 0 : newPage);
    setSearchQuery("");
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setSearchQuery("");
  };

  const handleDelete = (milestoneId: string) => {
    const url = `http://localhost:8000/milestone/${milestoneId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    axios
      .delete(url, { headers })
      .then(() => {
        setMilestones((prevMilestones) =>
          prevMilestones.filter(
            (milestone) => milestone.milestone_id !== milestoneId
          )
        );
        setMileStoneToDelete(null);
        setOpen(false);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setDeleted(false);
  }, [Milestones, searchQuery]);

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
              {Milestones.filter((Milestones) =>
                Object.values(Milestones)
                  .join(" ")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((milestone) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={milestone.milestone_id}
                  >
                    {columns.map((column) => {
                      const value = (milestone as any)[
                        column.id.toLowerCase().replace(" ", "_")
                      ];

                      if (column.id === "Order Number") {
                        const modifiedValue = `P${value}`; // Prepend "P" to the value
                        return (
                          <TableCell key={column.id} align="center">
                            {column.format && typeof modifiedValue === "number"
                              ? column.format(modifiedValue)
                              : modifiedValue}
                          </TableCell>
                        );
                      }

                      if (column.id === "Countdown Timer") {
                        const countdown = calculateCountdown(value); // Calculate countdown timer
                        return (
                          <TableCell key={column.id} align="center">
                            {countdown}
                          </TableCell>
                        );
                      }

                      if (column.id === "Modify" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link
                              to={`/modify/milestone/${milestone.milestone_id}`}
                            >
                              <Button variant="contained">Modify</Button>
                            </Link>
                          </TableCell>
                        );
                      }

                      if (column.id === "Delete" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpen(milestone)}
                              disabled={deleted} // Disable button if milestone is already deleted
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
                                      if (mileStoneToDelete) {
                                        handleDelete(
                                          mileStoneToDelete.milestone_id
                                        );
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
          count={Milestones.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default MilestoneComponent;
