
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { IoIosTime } from "react-icons/io";
import { PiTelegramLogoLight } from "react-icons/pi";
import { IoPersonAdd } from "react-icons/io5";

export default function IconLabelTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
      <Tab icon={<IoIosTime />} label="Received requests" />
      <Tab icon={<PiTelegramLogoLight />} label="Sent requests" />
      <Tab icon={<IoPersonAdd />} label="Add friend" />
    </Tabs>
  );
}
