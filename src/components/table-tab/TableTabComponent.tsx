import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CustomerComponent from '../customer-component/CustomerComponent';
import OrderComponent from '../order-component/OrderComponent';
import IncomeComponent from '../income-component/IncomeComponent';
import ExpensesComponent from '../expenses-component/ExpensesComponent';
import MilestoneComponent from '../milestone-component/MileStoneComponent';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TableTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    // Get the current route and set the active tab accordingly
    switch (location.pathname) {
      case '/customer':
        setValue(0);
        break;
      case '/order':
        setValue(1);
        break;
      case '/income':
        setValue(2);
        break;
      case '/expenses':
        setValue(3);
        break;
      case '/milestone':
        setValue(4);
        break;
      default:
        setValue(0);
        break;
    }
  }, [location]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/customer');
        break;
      case 1:
        navigate('/order');
        break;
      case 2:
        navigate('/income');
        break;
      case 3:
        navigate('/expenses');
        break;
      case 4:
        navigate('/milestone');
        break;
      default:
        navigate('/customer');
        break;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {/* Replace the Tabs component with ScrollableTabs */}
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable" // Set variant to 'scrollable'
          scrollButtons="auto" // Set scrollButtons to 'auto' to show scroll buttons when tabs overflow
        >
          <Tab label="Customers" {...a11yProps(0)} />
          <Tab label="Orders" {...a11yProps(1)} />
          <Tab label="Income" {...a11yProps(2)} />
          <Tab label="Expenses" {...a11yProps(3)} />
          <Tab label="Milestones" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CustomerComponent />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <OrderComponent />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <IncomeComponent />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ExpensesComponent />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <MilestoneComponent />
      </TabPanel>
    </Box>
  );
}
