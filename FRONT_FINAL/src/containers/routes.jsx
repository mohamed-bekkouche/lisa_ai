import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import Appointment from "./Appointment/Appointment";

import GroupIcon from "@mui/icons-material/Group";
import User from "./User/User";

import SettingsIcon from "@mui/icons-material/Settings";
import Settings from "./Settings/Settings";

import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationTable } from "./Notification/Notification";

import DashboardIcon from "@mui/icons-material/Dashboard";
import Dashboard from "./Dashboard/Dashboard";

import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import Scan from "./Scan/Scan";

import MessageIcon from "@mui/icons-material/Message";
import Chat from "./Message/Message";

import PersonIcon from "@mui/icons-material/Person";
import Profile from "./Profile/Profile";

import PaidIcon from "@mui/icons-material/Paid";
import Payment from "./Payment/Payment";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Doctors from "./Payment/Doctor";

import FlipIcon from "@mui/icons-material/Flip";
import ScanResult from "./Scan/ScanResult";
import AdminScans from "./Scan/AdminScans";

export const routes = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    component: <Dashboard />,
    role: "Admin",
  },
  {
    path: "/profile",
    title: "Profile",
    icon: <PersonIcon />,
    component: <Profile />,
    role: "Any",
  },
  {
    path: "/apointments",
    title: "Apointments",
    icon: <EditCalendarIcon />,
    component: <Appointment />,
    role: "Any",
  },
  {
    path: "/manage-scans",
    title: "Manage-Scans",
    icon: <EditCalendarIcon />,
    component: <AdminScans />,
    role: "Admin",
  },
  {
    path: "/users",
    title: "User Management",
    icon: <GroupIcon />,
    component: <User />,
    role: "Admin",
  },
  {
    path: "/scans",
    title: "Scans",
    icon: <DocumentScannerIcon />,
    component: <Scan />,
    role: "Patient",
  },
  {
    path: "/results",
    title: "Scan Results",
    icon: <FlipIcon />,
    component: <ScanResult />,
    role: "Patient",
  },
  {
    path: "/notifications",
    title: "Notifications",
    icon: <NotificationsIcon />,
    component: <NotificationTable />,
    role: "Any",
  },
  {
    path: "/messages",
    title: "Messages",
    icon: <MessageIcon />,
    component: <Chat />,
    role: "Any",
    notFor: "Doctor",
  },
  {
    path: "/doctor",
    title: "Doctors",
    icon: <LocalHospitalIcon />,
    component: <Doctors />,
    role: "Patient",
  },
  {
    path: "/subscription",
    title: "Subscription",
    icon: <PaidIcon />,
    component: <Payment />,
    role: "Patient",
  },
  {
    path: "/settings",
    title: "Settings",
    icon: <SettingsIcon />,
    component: <Settings />,
    role: "Any",
  },
];
