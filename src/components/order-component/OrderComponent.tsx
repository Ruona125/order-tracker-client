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
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface Data {
  "Cost Of Order": string;
  order_id: string;
  "Full Name": string;
  "Order Number": number;
  order_design_artwork: string;
  Details: string;
}

const columns: readonly Column[] = [
  { id: "Full Name", label: "Full Name", minWidth: 100 },
  { id: "Order Number", label: "Order Number", minWidth: 100 },
  {
    id: "cost_of_order",
    label: "Cost Of Order",
    minWidth: 100,
  },
  {
    id: "Details",
    label: "Details",
    minWidth: 100,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },

  { id: "Start Date", label: "Start Date", minWidth: 10 },
  { id: "End Date", label: "End Date", minWidth: 10 },
  { id: "Status", label: "Status", minWidth: 10 },
  { id: "order_design_artwork", label: "Order Design", minWidth: 10 },
  { id: "Create Income", label: "Create Income", minWidth: 10 },
  { id: "Create Expenses", label: "Create Expenses", minWidth: 10 },
  { id: "Create Milestone", label: "Create Milestone", minWidth: 10 },
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

const OrderComponent: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Data | null>(null);

  const handleOpen = (order: Data) => {
    setOrderToDelete(order);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const { token, roles } = useSelector((state: any) => state.user.userDetails);

  useEffect(() => {
    const url = "https://order-tracker-api-production.up.railway.app/order";
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<Data[]>(url, { headers }).then((response) => {
      setOrders(response.data);
    });
  }, [token]);

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

  const handleDelete = (orderId: string) => {
    const url = `https://order-tracker-api-production.up.railway.app/order/${orderId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    axios
      .delete(url, { headers })
      .then(() => {
        setOrders((prevIncomes) =>
          prevIncomes.filter((order) => order.order_id !== orderId)
        );
        setOrderToDelete(null);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setDeleted(false);
  }, [orders, searchQuery]);

  const filteredOrders = orders.filter((order) =>
    Object.values(order)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
              {filteredOrders
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((order) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={order.order_id}
                  >
                    {columns.map((column) => {
                      const value = (order as any)[
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

                      if (column.id === "Create Income") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link to={`/order/income/${order.order_id}`}>
                              <Button variant="contained" color="primary">
                                Income
                              </Button>
                            </Link>
                          </TableCell>
                        );
                      }

                      //{"\u20A6"}
                      if (column.id === "cost_of_order") {
                        const modifiedValue = `\u20A6${new Intl.NumberFormat().format(
                          value
                        )}`; // Prepend "P" to the value
                        return (
                          <TableCell key={column.id} align="center">
                            {column.format && typeof modifiedValue === "number"
                              ? column.format(modifiedValue)
                              : modifiedValue}
                          </TableCell>
                        );
                      }

                      if (column.id === "Create Expenses") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link to={`/order/expenses/${order.order_id}`}>
                              <Button variant="contained" color="primary">
                                Expenses
                              </Button>
                            </Link>
                          </TableCell>
                        );
                      }

                      if (column.id === "Create Milestone") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link to={`/order/milestone/${order.order_id}`}>
                              <Button variant="contained" color="primary">
                                MileStone
                              </Button>
                            </Link>
                          </TableCell>
                        );
                      }

                      if (column.id === "Start Date") {
                        const formattedDate = moment(value).format("DD/MM/YY"); // Format date using Moment.js
                        return (
                          <TableCell key={column.id} align="center">
                            {formattedDate}
                          </TableCell>
                        );
                      }

                      if (column.id === "End Date") {
                        const formattedDate = moment(value).format("DD/MM/YY"); // Format date using Moment.js
                        return (
                          <TableCell key={column.id} align="center">
                            {formattedDate}
                          </TableCell>
                        );
                      }

                      if (column.id === "order_design_artwork") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link to={`/order/design/${order.order_id}`}>
                              <Button variant="contained" color="primary">
                                Design
                              </Button>
                            </Link>
                          </TableCell>
                        );
                      }

                      if (column.id === "Modify" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link to={`/modify/order/${order.order_id}`}>
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
                              onClick={() => handleOpen(order)}
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
                                      if (orderToDelete) {
                                        handleDelete(orderToDelete.order_id);
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
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default OrderComponent;
