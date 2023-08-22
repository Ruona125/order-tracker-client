import React, { useState, useEffect } from "react";
import axios from "axios";
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
import moment from "moment";

interface Column {
  id:
    | "full_name"
    | "order_id"
    // | "phone_number"
    // | "location"
    | "Milestone Id"
    | "cost_of_order"
    | "Countdown Timer"
    | "description"
    // | "details"
    | "start_date"
    | "end_date"
    // | "status"
    | "income_amount"
    | "expenses_amount"
    // | "Milestone Status"
    | "Order Number"

    | "outstanding_balance";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface Data {
  "Milestone Status": string;
  "Milestone Id": string;
  "description": string;
  "Order Number": number;
  Details: string;
  order_id: string;
  countdown_timer: any;
  // costOfMilestone: number; // Added property for cost of order
}

const columns: readonly Column[] = [
  { id: "full_name", label: "Full Name", minWidth: 10 },
  // { id: "phone_number", label: "Phone Number", minWidth: 10 },
  // { id: "location", label: "Location", minWidth: 10 },
  { id: "cost_of_order", label: "Cost Of Order", minWidth: 10 },
  { id: "Countdown Timer", label: "Countdown Timer", minWidth: 10 },
  { id: "description", label: "Milestone Description", minWidth: 10},
  // { id: "details", label: "Details", minWidth: 10 },
  { id: "start_date", label: "Start Date", minWidth: 10 },
  { id: "end_date", label: "End Date", minWidth: 10 },
  // { id: "status", label: "Status", minWidth: 10 },
  { id: "income_amount", label: "Income Amount", minWidth: 10 },
  { id: "expenses_amount", label: "Expenses Amount", minWidth: 10 },
  // { id: "Milestone Status", label: "Milestone Status", minWidth: 10 },
  { id: "Order Number", label: "Order Number", minWidth: 10 },

  { id: "outstanding_balance", label: "Outstanding Balance", minWidth: 10 },
];

const OngoingOrderComponent = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [OngoingOrders, setOngoingOrders] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [deleted, setDeleted] = useState(false); // New state for deletion

  const { token } = useSelector(
    (state: any) => state.user.userDetails
  );

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
    const fetchOngoingOrders = () => {
      const url = "http://localhost:8000/order/ongoing/order";
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      axios.get<Data[]>(url, { headers }).then((response) => {
        setOngoingOrders(response.data);
        // console.log(response.data);
      });
    };

    fetchOngoingOrders(); // Fetch orders initially

    const interval = setInterval(() => {
      setOngoingOrders((prevOngoingOrders) =>
        prevOngoingOrders.map((order) => ({
          ...order,
          "Countdown Timer": calculateCountdown(order.countdown_timer),
        }))
      );
    }, 1000);

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []); // Empty dependency array, so it runs only once on mount

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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

  useEffect(() => {
    // setDeleted(false);
  }, [OngoingOrders, searchQuery]);

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
                {columns.map((column) => (
                  // Only render Modify and Delete columns if the role is admin

                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {OngoingOrders.filter((OngoingOrders) =>
                Object.values(OngoingOrders)
                  .join(" ")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
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

                      if (column.id === "Countdown Timer") {
                        const countdown = calculateCountdown(value); // Calculate countdown timer
                        return (
                          <TableCell key={column.id} align="center">
                            {countdown}
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

                      if (column.id === "income_amount") {
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

                      if (column.id === "expenses_amount") {
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

                      if (column.id === "outstanding_balance") {
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

                      if (column.id === "start_date") {
                        const formattedDate = moment(value).format("DD/MM/YY"); // Format date using Moment.js
                        return (
                          <TableCell key={column.id} align="center">
                            {formattedDate}
                          </TableCell>
                        );
                      }

                      if (column.id === "end_date") {
                        const formattedDate = moment(value).format("DD/MM/YY"); // Format date using Moment.js
                        return (
                          <TableCell key={column.id} align="center">
                            {formattedDate}
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
          count={OngoingOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default OngoingOrderComponent;
