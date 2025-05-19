import { Autocomplete, Chip, FormHelperText, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import {
  AsyncCreateAppointment,
  AsyncEditAppointment,
} from "../AppointmentSlice";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useTranslation } from "react-i18next";

function handleError(schema, name) {
  if (schema.touched[name] && schema.errors[name]) {
    return schema.errors[name];
  }

  return null;
}

export default function AppointmentEditDialog(props) {
  const { role, name } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const { open, handleClose, isUpdate, model, handleRefresh } = props;
  const { editInProgress, errorMessage } = useSelector(
    (state) => state.appointment
  );
  // const { name } = useSelector((state) => state.login);

  const [accepted, setAccepted] = useState(false);

  const { t } = useTranslation();
  const [dateTime, setDateTime] = useState(
    isUpdate ? dayjs(model.date) : dayjs()
  );
  const [status, setStatus] = useState(isUpdate ? model.status : "Pending");

  const handleDateTimeChange = (newDateTime) => {
    setDateTime(dayjs(newDateTime));
  };

  const handleSubmit = async () => {
    console.log(dateTime);
    if (isUpdate) {
      dispatch(
        AsyncEditAppointment(model._id, role, dateTime, dateTime, status)
      );
    } else {
      dispatch(AsyncCreateAppointment(dateTime, dateTime));
    }
    await handleRefresh();
    handleClose();
  };

  const shouldDisableTime = (value, view) => {
    if (view === "hours") {
      const hour = value.hour();
      return hour < 9 || hour > 17;
    }
    if (view === "minutes") {
      const minute = value.minute();
      return minute % 15 !== 0;
    }
    return false;
  };

  const disableWeekend = (date) => {
    const day = date.day();
    return day === 5 || day === 6;
  };

  const handleDateError = (e) => {
    if (e === null) {
      setAccepted(true);
    } else {
      setAccepted(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isUpdate ? t("Update appointment") : t("Create appointment")}
      </DialogTitle>
      <DialogContent>
        <Grid spacing={2} container sx={{ alignItems: "center" }}>
          <Grid item size={12}>
            <TextField
              fullWidth
              value={name}
              disabled
              margin="dense"
              name="Name"
              label={t("Name")}
              type="select"
            />
          </Grid>
          <Grid item container sx={{ alignItems: "center" }} size={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                onError={(e) => handleDateError(e)}
                timeSteps={15}
                shouldDisableTime={shouldDisableTime}
                shouldDisableDate={disableWeekend}
                sh
                sx={{ width: "100%" }}
                ampm={false}
                reduceAnimations
                onChange={handleDateTimeChange}
                orientation="landscape"
                disablePast
                value={dateTime}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item size={12}>
            <Autocomplete
              options={["Pending", "Cancelled"]}
              value={status}
              disabled={!isUpdate}
              disablePortal
              fullWidth
              renderInput={(params) => {
                return (
                  <TextField
                    fullWidth
                    {...params}
                    margin="dense"
                    name="Status"
                    label={t("Status")}
                    type="select"
                  />
                );
              }}
            />
          </Grid>
        </Grid>
        {errorMessage && (
          <Grid item xs={12}>
            <FormHelperText error>{errorMessage}</FormHelperText>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={editInProgress}
          onClick={() => {
            handleClose();
          }}
        >
          {t("Cancel")}
        </Button>
        {isUpdate ? (
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={model?.date === dateTime}
          >
            {t("Save")}
          </Button>
        ) : (
          <Button type="submit" onClick={handleSubmit} disabled={!accepted}>
            {t("Save")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
