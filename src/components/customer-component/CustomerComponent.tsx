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
import "./customercomponent.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

interface Column {
  id:
    | "Full Name"
    | "Customer Id"
    | "Phone Number"
    | "Email"
    | "Location"
    | "Create Order"
    | "Modify"
    | "Delete";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
  customer_id: string;
}

const columns: readonly Column[] = [
  { id: "Full Name", label: "Full Name", minWidth: 10 },
  { id: "Phone Number", label: "Phone Number", minWidth: 10 },
  {
    id: "Email",
    label: "Email",
    minWidth: 10,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "Location",
    label: "Location",
    minWidth: 10,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  { id: "Create Order", label: "Create Order", minWidth: 10 },
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

const CustomerComponent: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customers, setCustomers] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleted, setDeleted] = useState(false); // New state for deletion
  const [open, setOpen] = React.useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Data | null>(null);
  const handleOpen = (customer: Data) => {
    setCustomerToDelete(customer);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const { token, roles } = useSelector((state: any) => state.user.userDetails);

  useEffect(() => {
    const url = "https://order-tracker-api-production.up.railway.app/customer";
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<Data[]>(url, { headers }).then((response) => {
      setCustomers(response.data);
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

  const handleDelete = (customerId: string) => {
    const url = `https://order-tracker-api-production.up.railway.app/customer/${customerId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    axios
      .delete(url, { headers })
      .then(() => {
        setCustomers((prevCustomers) =>
          prevCustomers.filter(
            (customer) => customer.customer_id !== customerId
          )
        );
        setCustomerToDelete(null);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setDeleted(false);
  }, [customers, searchQuery]);

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
            <TableBody key={deleted.toString()}>
              {" "}
              {/* Set the key to trigger re-render */}
              {customers
                .filter((customer) =>
                  Object.values(customer)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={customer.code}
                  >
                    {columns.map((column) => {
                      const value = (customer as any)[
                        column.id.toLowerCase().replace(" ", "_")
                      ];
                      if (column.id === "Modify" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link
                              to={`/modify/customer/${customer.customer_id}`}
                            >
                              <Button variant="contained" color="primary">
                                Modify
                              </Button>
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
                              onClick={() => handleOpen(customer)}
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
                                      if (customerToDelete) {
                                        handleDelete(
                                          customerToDelete.customer_id
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

                      if (column.id === "Create Order") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link
                              to={`/order/customer/${customer.customer_id}`}
                            >
                              <Button variant="contained" color="primary">
                                Order
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
          count={customers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};
export default CustomerComponent;
