import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../configs";
import axios from "../../helpers/axios";
import toast from "react-hot-toast";
import { t } from "i18next";

export function AsyncResetPassword(token, newPassword, action) {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const response = await axios.put("/user/pass_reset", {
        newPassword,
        token,
      });
      if (response && response.status === 200) {
        toast(response.data.message);
        action();
      }
      dispatch(endFetching());
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleError({ error }));
      } else {
        const error = t("Something went wrong, Try again");
        toast(error);
        dispatch(handleError({ error }));
      }
    }
  };
}

export function AsyncInitResetPassword(email, action) {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const response = await axios.put("/user/pass_recovery", {
        email,
      });
      if (response && response.status === 200) {
        const token = response.data.token;
        action(token);
        toast(t("Check your email"));
      }
      dispatch(endFetching());
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleError({ error }));
      } else if (response && response.status === 404) {
        const error = response.data.error;
        toast(t("There is no user with this email"));
        dispatch(handleError({ error }));
      } else {
        const error = t("Something went wrong, Try again");
        toast(error);
        dispatch(handleError({ error }));
      }
    }
  };
}

export function editPersonalData(password, newPassword, onSuccess) {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const response = await axios.put(
        "/user/informations",
        {
          password,
          newPassword,
        },
        {
          baseURL: BASE_URL,
        }
      );
      //dispatch(setPersonalData(response.data.user))
      onSuccess();
      toast(t("Password changed"));
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.message;
        dispatch(handleError({ error }));
      } else if (response && response.status === 401) {
        const error = response.data.message;
        dispatch(handleError({ error }));
        toast(error);
      } else {
        const error = t("Something went wrong, Try again");
        dispatch(handleError({ error }));
      }
    }
  };
}

export function AsyncActivateUser(token, activationCode, action) {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const response = await axios.post("/user/activate-account", {
        activationCode,
        token,
      });
      action();
      toast(t("Account has been created"));
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleError({ error }));
      }
      if (response && response.status === 500) {
        if (response.data.error) {
          toast(response.data.error);
        }
      } else {
        const error = t("Something went wrong, Try again");
        dispatch(handleError({ error }));
      }
    }
  };
}

export function AsyncSignUp(
  name,
  email,
  password,
  phoneNum,
  address,
  role,
  specialization,
  schedule,
  file,
  action
) {
  return async (dispatch) => {
    dispatch(loading());
    const rawData = { name, email, password, phoneNum, address, role };
    const formData = new FormData();

    if (role === "Doctor") {
      formData.append("file", file);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNum", phoneNum);
      formData.append("address", address);
      formData.append("role", role);
      formData.append("specialization", specialization);
      formData.append("schedule", schedule);
    }
    console.log(formData);

    const headers = file
      ? {
          "Content-Type": "multipart/form-data",
        }
      : {};

    try {
      const response = await axios.post(
        "/user/signup",
        file ? formData : rawData,
        { headers }
      );
      const { token } = response.data;
      toast(t("Check your email"));
      console.log(token);
      action(token);
      //sessionStorage.setItem("userId", user_id)
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleError({ error }));
      } else {
        const error = t("Something went wrong, Try again");
        dispatch(handleError({ error }));
        toast(error);
      }
    }
  };
}

export function autoLogin(token, user) {
  return (dispatch) => {
    sessionStorage.setItem("token", token);
    dispatch(logged());
    dispatch(setPersonalData(JSON.parse(user)));
  };
}

export function login(email, password) {
  return async (dispatch) => {
    dispatch(loading());

    try {
      const response = await axios.post(
        "/user/login",
        {
          email,
          password,
        },
        {
          baseURL: BASE_URL,
        }
      );
      const token = response.data.token;

      sessionStorage.setItem("token", token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      dispatch(setPersonalData(response.data.user));
      dispatch(logged());
    } catch (e) {
      const response = e.response;
      if (response && response.status === 400) {
        const error = response.data.error;
        dispatch(handleError({ error }));
      } else if (response && response.status === 401) {
        toast(t("Email or password is incorrect, try again"));
      } else if (response && response.status === 403) {
        toast(t("Account is not activated"));
      } else {
        const error = t("Something went wrong, Try again");
        dispatch(handleError({ error }));
        toast(error);
      }
    }
  };
}

export function logout(onSuccess) {
  return async (dispatch) => {
    dispatch(loading());

    try {
      const response = await axios.post("/user/logout");
      //sessionStorage.clear()
      localStorage.clear();
      dispatch(removePersonalData());
      dispatch(out());
      toast(t("Logged out"));
      if (onSuccess) {
        onSuccess();
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

export function configLoginMode(mode) {
  return (dispatch) => {
    if (mode === "login" || mode === "signup") {
      if (mode === "login") {
        dispatch(setLoginMode());
      } else {
        dispatch(setSignUpMode());
      }
    }
  };
}

const initialState = {
  mode: "login",
  inProgress: false,
  isAuthenticated: false,
  errorMessage: null,
  name: null,
  email: null,
  role: null,
  c: null,
  avatar: null,
  phoneNum: null,
  address: null,
  createdAt: null,
  updatedAt: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loading(state) {
      state.inProgress = true;
      state.errorMessage = null;
    },
    logged(state) {
      state.isAuthenticated = true;
      state.inProgress = false;
      state.errorMessage = null;
    },
    setLoginMode(state) {
      state.mode = "login";
    },
    setSignUpMode(state) {
      state.mode = "signup";
    },
    setPersonalData(state, action) {
      console.log(action.payload);
      state.name = action.payload?.name;
      state.email = action.payload?.email;
      state.role = action.payload?.role;
      state.id = action.payload?._id;
      state.avatar = action.payload?.avatar;
      state.phoneNum = action.payload?.p_phoneNum;
      state.address = action.payload?.p_Address;
      state.createdAt = action.payload?.createdAt;
      state.updatedAt = action.payload?.updatedAt;
      state.specialization = action.payload?.specialization;
      state.schedule = action.payload?.schedule;
      state.inProgress = false;
    },
    removePersonalData(state) {
      state.name = null;
      state.email = null;
      state.role = null;
      state.id = null;
      state.avatar = null;
      state.phoneNum = null;
      state.address = null;
      state.createdAt = null;
      state.updatedAt = null;
      state.inProgress = false;
    },
    out(state) {
      state.isAuthenticated = false;
    },
    endFetching(state) {
      state.inProgress = false;
      state.errorMessage = null;
    },
    handleError(state, action) {
      const { error } = action.payload;
      state.errorMessage = error;
      state.inProgress = false;
    },
  },
});

const {
  handleError,
  loading,
  logged,
  out,
  setPersonalData,
  setSignUpMode,
  setLoginMode,
  removePersonalData,
  endFetching,
} = loginSlice.actions;
export const reducer = loginSlice.reducer;
