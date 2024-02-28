import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { RootState } from "../../Redux/rootReducer";
import axios, { AxiosResponse } from "axios";
import Logo from "../../assets/order.jpg";
import { TextField, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment"
interface ExpensesData {
  amount: number;
  description: string;
  name_of_expenses: string;
  date: Date;
}

const ModifyExpensesComponent: React.FC = () => {
  const { expenses_id } = useParams();
  const { token } = useSelector((state: any) => state.user.userDetails);

  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [name_of_expenses, setNameOfExpenses] = useState<string>("");
  const [date, setDate] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false);
  // const [full_name, setFullName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const url = `https://order-tracker-api-production.up.railway.app/expenses/${expenses_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    axios.get<ExpensesData>(url, { headers }).then((response) => {
      const { amount, description, name_of_expenses, date } = response.data;
      // console.log(response.data)
      setAmount(amount);
      setDescription(description);
      setNameOfExpenses(name_of_expenses);
      setDate(moment(date).format("YYYY-MM-DD"));
    });
  }, [expenses_id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://order-tracker-api-production.up.railway.app/expenses/${expenses_id}`;
    const data: ExpensesData = {
      amount,
      name_of_expenses,
      description,

      date: new Date(date),
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    setLoading(true)

    try {
      const res: AxiosResponse = await axios.put(url, data, { headers });
      if (res.status === 200) {
        navigate("/expenses");
        setLoading(false)
      } else {
        setError("error sending data")
      }
    } catch (err) {
      setError("error sending data")
    }
  };

  return (
    <>
      <div className="container">
        <center>
          <img src={Logo} className="img-logo" alt="logo" />
        </center>
        <h2 className="login-heading">Modify Expenses</h2>
        <form
          style={{ display: "grid", marginTop: "23px" }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            id="amount"
            label="Amount"
            variant="outlined"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="name_of_expenses"
            label="Name of Expenses"
            variant="outlined"
            type="text"
            value={name_of_expenses}
            onChange={(e) => setNameOfExpenses(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="description"
            label="Description"
            variant="outlined"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          <TextField
            id="date"
            label="Date"
            variant="outlined"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ style: { color: "red" } }}
          />
          <br />

          {loading ? (
            <center>
              <CircularProgress style={{ color: "red" }} />
            </center>
          ) : (
            <Button
              type="submit"
              variant="contained"
              className="login-button"
              style={{
                color: "#fff",
                backgroundColor: "red",
                marginTop: "23px",
              }}
            >
              Modify Expenses
            </Button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default ModifyExpensesComponent;
