import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../configs";
import axios from "../../helpers/axios";
import toast from "react-hot-toast";

import { t } from "i18next";

export function AsyncgetAllDoctors() {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const response = await axios.get("/patient/doctors");
      if (response.status === 200) {
        const doctors = response.data.doctors;
        dispatch(setDoctors(doctors));
      }
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleError({ error }));
      } else {
        const error = t("Something went wrong, Try again");
        dispatch(handleError({ error }));
      }
    }
  };
}

export function AsyncIsPatientPremium() {
  return async (dispatch) => {
    dispatch(loading());

    try {
      const response = await axios.get("/patient/premium");
      if (response.status === 200) {
        console.log("isPrem : ", response.data);
        const { subscription, isPatientPremium } = response.data;
        dispatch(setPatientPremium(isPatientPremium));
        dispatch(setSubscription(subscription));
      }
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleError({ error }));
      } else if (response && response.status === 404) {
        dispatch(setSubscription(null));
        dispatch(setPatientPremium(false));
      } else {
        const error = t("Something went wrong, Try again");
        dispatch(handleError({ error }));
      }
    }
  };
}

export function AsyncCreateSubscription(patientId, paymentMethodId, priceId) {
  return async (dispatch) => {
    dispatch(loading());

    try {
      const response = await axios.post(
        "/payment/create",
        {
          patientId,
          paymentMethodId,
          priceId,
        },
        {
          baseURL: BASE_URL,
        }
      );
      toast(t("Subscription has been created"));
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleError({ error }));
      } else {
        const error = t("Something went wrong, Try again");
        dispatch(handleError({ error }));
      }
    }
  };
}

const initialState = {
  inProgress: false,
  errorMessage: null,
  subscription: null,
  isPatientPremium: false,
  doctors: [],
};

const paymentrSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    loading(state) {
      state.inProgress = true;
      state.errorMessage = null;
    },
    setSubscription(state, action) {
      state.subscription = action.payload;
      state.inProgress = false;
    },
    setPatientPremium(state, action) {
      state.isPatientPremium = action.payload;
      state.inProgress = false;
    },
    setDoctors(state, action) {
      state.doctors = action.payload;
      state.inProgress = false;
    },
    handleError(state, action) {
      const { error } = action.payload;
      state.errorMessage = error;
      state.inProgress = false;
    },
  },
});

const { handleError, loading, setSubscription, setPatientPremium, setDoctors } =
  paymentrSlice.actions;
export const reducer = paymentrSlice.reducer;