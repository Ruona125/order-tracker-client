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
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

interface Column {
  id: "name" | "email" | "roles" | "user_id" | "Delete" | "Tasks";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface Data {
  name: string;
  email: string;
  roles: string;
  user_id: string;
}

const columns: readonly Column[] = [
  { id: "name", label: "name", minWidth: 10 },
  { id: "email", label: "email", minWidth: 10 },
  // { id: "roles", label: "roles", minWidth: 20 },
  { id: "Delete", label: "Delete", minWidth: 10 },
  { id: "Tasks", label: "Create Tasks", minWidth: 10 },
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

const StaffComponent: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [staffs, setStaffs] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Data | null>(null);
  const handleOpen = (staff: Data) => {
    setStaffToDelete(staff);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const { token, roles } = useSelector((state: any) => state.user.userDetails);

  useEffect(() => {
    const url = "http://localhost:8000/user/register";
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<Data[]>(url, { headers }).then((response) => {
      setStaffs(response.data);
      // console.log(response.data);
    });
  }, []);

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

  const handleDelete = (user_id: string) => {
    const url = `http://localhost:8000/user/register/${user_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    axios
      .delete(url, { headers })
      .then(() => {
        setStaffs((prevStaff) =>
          prevStaff.filter((staff) => staff.user_id !== user_id)
        );
        setStaffToDelete(null);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setDeleted(false);
  }, [staffs, searchQuery]);

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
                  column.id === "Delete" && roles !== "admin" ? null : (
                    <TableCell
                      key={column.id}
                      // align={column.align}
                      align="center"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody key={deleted.toString()}>
              {" "}
              {/* Update key prop */}
              {staffs
                .filter((staff) =>
                  Object.values(staff)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((staff) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={staff.user_id}
                  >
                    {columns.map((column) => {
                      const value = (staff as any)[
                        column.id.toLowerCase().replace(" ", "_")
                      ];

                      if (column.id === "Delete" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpen(staff)} // Call handleDelete on click
                              disabled={deleted}
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
                                      if (staffToDelete) {
                                        handleDelete(staffToDelete.user_id);
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

                      if (column.id === "Tasks" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link to={`/staff/task/${staff.user_id}`}>
                              <Button
                                variant="contained"
                                color="primary"
                                //   onClick={() => handleDelete(staff.id)} // Call handleDelete on click
                              >
                                Task
                              </Button>
                            </Link>
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
          count={staffs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default StaffComponent;
