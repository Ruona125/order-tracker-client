import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StaffComponent from '../staff-component/StaffComponent';
import TaskComponent from '../task-component/TaskComponent';
import CompleteTaskComponent from '../complete-task-component/CompleteTaskComponent';
import IncompleteTaskComponent from '../incomplete-task-component/IncompleteTaskComponent';

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
      case '/staffs':
        setValue(0);
        break;
      case '/tasks':
        setValue(1);
        break;
      case '/complete-task':
        setValue(2);
        break;
      case '/pending-task':
        setValue(3);
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
        navigate('/staffs');
        break;
      case 1:
        navigate('/tasks');
        break;
      case 2:
        navigate('/complete-task');
        break;
      case 3:
        navigate('/pending-task');
        break;
      default:
        navigate('/staffs');
        break;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} 
        onChange={handleChange} 
        aria-label="basic tabs example"
        variant="scrollable" // Set variant to 'scrollable'
        scrollButtons="auto" // Set scrollButtons to 'auto' to show scroll buttons when tabs overflow
        >
          <Tab label="Staffs" {...a11yProps(0)} />
          <Tab label="Tasks " {...a11yProps(1)} />
          <Tab label="Completed task " {...a11yProps(2)} />
          <Tab label="Pending task " {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <StaffComponent />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TaskComponent />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CompleteTaskComponent />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <IncompleteTaskComponent />
      </TabPanel>
    </Box>
  );
}