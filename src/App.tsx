import Login from "./pages/Login/Login";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";
import Profile from "./pages/profile";
import HomePage from "./pages/HomePage/HomePage";
import StaffAccount from "./pages/StaffAccount/StaffAccount";
import CreateCustomer from "./pages/CreateCustomer/CreateCustomer";
import ModifyCustomer from "./pages/ModifyCustomer/ModifyCustomer";
import ModifyIncome from "./pages/ModifyIncome/ModifyIncome";
import ModifyExpenses from "./pages/ModifyExpenses/ModifyExpenses";
import ModifyMilestone from "./pages/ModifyMilestone/ModifyMilestone";
import ModifyOrder from "./pages/ModifyOrder/ModifyOrder";
import CreateOrder from "./pages/CreateOrder/CreateOrder";
import CreateIncome from "./pages/CreateIncome/CreateIncome";
import CreateExpenses from "./pages/CreateExpenses/CreateExpenses";
import CreateMilestone from "./pages/CreateMilestone/CreateMilestone";
import Staffs from "./pages/Staffs/Staffs";
import OngoingOrders from "./pages/OngoingOrder/OngoingOrder";
import Reports from "./pages/Reports/Reports";
import CreateTask from "./pages/CreateTask/CreateTask";
import ModifyTask from "./pages/ModifyTask/ModifyTask";
import Task from "./pages/Tasks/Task";
import OrderDesign from "./pages/OrderDesign/OrderDesign";
// import {RootState} from "./Redux/rootReducer"
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function App() {
  const isSignedIn = useSelector((state:any) => state.user.isSignedIn)
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={isSignedIn ? <Profile /> : <Login />} />
          <Route path="/home" element={isSignedIn ? <HomePage /> : <Login />} />

          <Route path="/staffs" element={isSignedIn ? <Staffs /> : <Login />} />
          <Route path="/staff/task/:user_id" element={isSignedIn ? <CreateTask /> : <Login />} />

          <Route path="/modify/customer/:customer_id" element={isSignedIn ? <ModifyCustomer /> : <Login />} />
          <Route path="/modify/income/:income_id" element={isSignedIn ? <ModifyIncome /> : <Login />} />
          <Route path="/modify/expenses/:expenses_id" element={isSignedIn ? <ModifyExpenses /> : <Login />} />
          <Route path="/modify/milestone/:milestone_id" element={isSignedIn ? <ModifyMilestone /> : <Login />} />
          <Route path="/modify/order/:order_id" element={isSignedIn ? <ModifyOrder /> : <Login />} />

          <Route path="/staff-account" element={isSignedIn ? <StaffAccount /> : <Login />} />

          <Route path="/create-customer" element={isSignedIn ? <CreateCustomer /> : <Login />} />
          <Route path="/change-password" element={isSignedIn ? <ChangePassword /> : <Login />} />
          <Route path="/forgot/password" element={ <ForgotPassword />} />
          <Route path="/reset/passwords" element={ <ResetPassword />} />

          <Route path="/order/customer/:customer_id" element={isSignedIn ? <CreateOrder /> : <Login />} />
          <Route path="/order/income/:order_id" element={isSignedIn ? <CreateIncome /> : <Login />} />
          <Route path="/order/expenses/:order_id" element={isSignedIn ? <CreateExpenses /> : <Login />} />
          <Route path="/order/milestone/:order_id" element={isSignedIn ? <CreateMilestone /> : <Login />} />
          <Route path="/ongoing-order" element={isSignedIn ? <OngoingOrders /> : <Login />} />
          <Route path="/order/design/:order_id" element={isSignedIn ? <OrderDesign /> : <Login />} />
          <Route path="/reports" element={isSignedIn ? <Reports /> : <Login />} />

          <Route path="/task" element={isSignedIn ? <Task /> : <Login />} />

          <Route path="/updateTasks/:task_id" element={isSignedIn ? <ModifyTask /> : <Login />} />

          {/* url for home page */}
          <Route path="/income" element={isSignedIn ? <HomePage /> : <Login />} />
          <Route path="/order" element={isSignedIn ? <HomePage /> : <Login />} />
          <Route path="/customer" element={isSignedIn ? <HomePage /> : <Login />} />
          <Route path="/expenses" element={isSignedIn ? <HomePage /> : <Login />} />
          <Route path="/milestone" element={isSignedIn ? <HomePage /> : <Login />} />

           {/* url for staff page */}
           <Route path="/tasks" element={isSignedIn ? <Staffs /> : <Login />} />
           <Route path="/complete-task" element={isSignedIn ? <Staffs /> : <Login />} />
           <Route path="/pending-task" element={isSignedIn ? <Staffs /> : <Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
