import { createSlice } from "@reduxjs/toolkit";
import axios from "../../helpers/axios";

import { t } from "i18next";
import toast from "react-hot-toast";

// export function AsyncRequstScan(scanId) {
//     return async (dispatch) => {
//         dispatch(fetching())
//         try {
//             const response = await axios.post(
//                 `/patient/scans/${scanId}`,
//             )
//             if(response.status===200)
//             {
//                 toast(t(response.data.message))
//             }

//         } catch (e) {
//             const response = e.response
//             if (response && response.status === 400) {
//                 const error = response.data.error
//                 dispatch(handleErrors({ error }))
//             }
//             else if(response && response.status === 500)
//             {
//                 toast(t(response.data.error))
//             }
//             else {
//                 const error = t("Something went wrong, Try again")
//                 dispatch(handleErrors({ error }))
//             }
//         }
//     }
// }

export function AsyncGetScansResults() {
  return async (dispatch) => {
    dispatch(fetching());
    try {
      const response = await axios.get("/patient/scanResults");
      const scanResults = response.data.scanResults;
      console.log("scanResults :::::::::: ", scanResultSlice);
      dispatch(setScanResults(scanResults));
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleErrors({ error }));
      } else {
        const error = t("Something went wrong, Try again");
        dispatch(handleErrors({ error }));
      }
    }
  };
}

const initialState = {
  errorMessage: null,
  fetchingInProgress: false,
  scanResults: [],
};

const scanResultSlice = createSlice({
  name: "scanResult",
  initialState,
  reducers: {
    fetching(state) {
      state.fetchingInProgress = true;
    },
    setScanResults(state, action) {
      state.scanResults = action.payload;
      state.fetchingInProgress = false;
    },
    handleErrors(state, action) {
      state.errorMessage = action.payload.error;
      state.fetchingInProgress = false;
    },
  },
});

const { fetching, handleErrors, setScanResults } = scanResultSlice.actions;
export const reducer = scanResultSlice.reducer;
