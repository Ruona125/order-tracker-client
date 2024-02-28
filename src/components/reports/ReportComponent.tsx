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
    | "Countdown Timer"
    | "description"
    | "phone_number"
    | "location"
    | "Milestone Id"
    | "cost_of_order"
    | "details"
    | "start_date"
    | "end_date"
    | "status"
    | "income_amount"
    | "expenses_amount"
    | "Milestone Status"
    | "Order Number"
    | "outstanding_balance"
    | "gross_profit";
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
  countdown_timer: any
  // costOfMilestone: number; // Added property for cost of report
}

const columns: readonly Column[] = [
  { id: "full_name", label: "Full Name", minWidth: 100 },
  { id: "Countdown Timer", label: "Countdown Timer", minWidth: 100 },
  { id: "description", label: "Milestone Description", minWidth: 10},
  { id: "phone_number", label: "Phone Number", minWidth: 100 },
  { id: "location", label: "Location", minWidth: 100 },
  { id: "cost_of_order", label: "Cost Of Order", minWidth: 100 },
  { id: "details", label: "Details", minWidth: 100 },
  { id: "start_date", label: "Start Date", minWidth: 100 },
  { id: "end_date", label: "End Date", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "income_amount", label: "Income Amount", minWidth: 100 },
  { id: "expenses_amount", label: "Expenses Amount", minWidth: 100 },
  { id: "Milestone Status", label: "Milestone Status", minWidth: 100 },
  { id: "Order Number", label: "Order Number", minWidth: 100 },
  { id: "outstanding_balance", label: "Outstanding Balance", minWidth: 100 },
  { id: "gross_profit", label: "Gross Profit", minWidth: 100 },
];

const ReportComponent = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Reports, setReports] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleted, setDeleted] = useState(false); // New state for deletion

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
    const fetchReports = () => {
      const url = "https://order-tracker-api-production.up.railway.app/report";
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      axios.get<Data[]>(url, { headers }).then((response) => {
        setReports(response.data);
        // console.log(response.data);
      });
    };

    fetchReports(); // Fetch orders initially

    const interval = setInterval(() => {
      setReports((prevReports) =>
        prevReports.map((report) => ({
          ...report,
          "Countdown Timer": calculateCountdown(report.countdown_timer),
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
    setDeleted(false);
  }, [Reports, searchQuery]);
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
            <TableBody  key={deleted.toString()}>
              {Reports.filter((Reports) =>
                Object.values(Reports)
                  .join(" ")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                  >
                    {columns.map((column) => {
                      const value = (report as any)[
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

                      if (column.id === "gross_profit") {
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
          count={Reports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default ReportComponent;
