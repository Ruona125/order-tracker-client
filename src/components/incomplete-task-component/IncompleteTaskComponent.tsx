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
import moment from "moment";

interface Column {
  id: "task_id" | "user_id" | "task" | "status" | "deadline" | "name";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

interface Data {
  task: string;
  status: string;
  deadline: any;
  task_id: string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 10 },
  { id: "task", label: "Tasks", minWidth: 10 },
  { id: "status", label: "Staus", minWidth: 10 },
  { id: "deadline", label: "Deadline", minWidth: 10 },
];

const IncompleteTaskComponent: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Tasks, setTasks] = useState<Data[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { token } = useSelector(
    (state: any) => state.user.userDetails
  );

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
      const url = "https://order-tracker-api-production.up.railway.app/task/pending";
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

  //   useEffect(() => {
  //     setDeleted(false);
  //   }, [Tasks, searchQuery]);

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

                      if (column.id === "deadline") {
                        const countdown = calculateCountdown(value); // Calculate countdown timer
                        return (
                          <TableCell key={column.id} align="center">
                            {countdown}
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

export default IncompleteTaskComponent;
