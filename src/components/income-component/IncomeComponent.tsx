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
    | "Income Id"
    | "ref_no"
    | "amount"
    | "cost_of_order"
    | "Description"
    | "name_of_income"
    | "Date"
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
  Amount: string;
  income_id: string;
  // "Full Name": string;
  "Order Number": number;
  Details: string;
  // costOfOrder: number; // Added property for cost of income
}

const columns: readonly Column[] = [
  { id: "ref_no", label: "ref_no", minWidth: 10 },
  { id: "amount", label: "Amount", minWidth: 10 },
  { id: "cost_of_order", label: "Cost Of Order", minWidth: 10 },
  {
    id: "Description",
    label: "Description",
    minWidth: 10,
  },
  {
    id: "name_of_income",
    label: "Name Of Income",
    minWidth: 10,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  { id: "Date", label: "Date", minWidth: 10 },
  { id: "Order Number", label: "Order Number", minWidth: 10 },
  { id: "full_name", label: "Full Name", minWidth: 10 },
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

const IncomeComponent: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Incomes, setIncome] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleted, setDeleted] = useState(false); // New state for deletion
  const [open, setOpen] = React.useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<Data | null>(null);

  const handleOpen = (income: Data) => {
    setIncomeToDelete(income);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const { token, roles } = useSelector((state: any) => state.user.userDetails);

  useEffect(() => {
    const url = "https://order-tracker-api-production.up.railway.app/income";
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<Data[]>(url, { headers }).then((response) => {
      setIncome(response.data);
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

  const handleDelete = (incomeId: string) => {
    const url = `https://order-tracker-api-production.up.railway.app/income/${incomeId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    axios
      .delete(url, { headers })
      .then(() => {
        setIncome((prevIncomes) =>
          prevIncomes.filter((income) => income.income_id !== incomeId)
        );
        setIncomeToDelete(null);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setDeleted(false);
  }, [Incomes, searchQuery]);

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
              {/* Update key prop */}
              {Incomes.filter((income) =>
                Object.values(income)
                  .join(" ")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((income) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={income.income_id}
                  >
                    {columns.map((column) => {
                      const value = (income as any)[
                        column.id.toLowerCase().replace(" ", "_")
                      ];

                      if (column.id === "Date") {
                        const formattedDate = moment(value).format("DD/MM/YY"); // Format date using Moment.js
                        return (
                          <TableCell key={column.id} align="center">
                            {formattedDate}
                          </TableCell>
                        );
                      }

                      if (column.id === "amount") {
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

                      if (column.id === "Modify" && roles === "admin") {
                        return (
                          <TableCell key={column.id} align="center">
                            <Link to={`/modify/income/${income.income_id}`}>
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
                              onClick={() => handleOpen(income)}
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
                                      if (incomeToDelete) {
                                        handleDelete(incomeToDelete.income_id);
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
          count={Incomes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default IncomeComponent;
