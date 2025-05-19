import axios from "../../helpers/axios";
import toast from "react-hot-toast";

import { t } from "i18next";

export async function AsyncUploadScan(patient_id, formData, handleClose) {
  console.log(formData);
  try {
    const response = await axios.post(`/admin/scans/${patient_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response && response.status === 201) {
      toast(response.data.message);
    }
    handleClose();
    //toast("Scan")
  } catch (e) {
    const response = e.response;
    if (response && response.status === 400) {
      const error = response.data.error;
      toast(error);
    } else {
      const error = t("Something went wrong, Try again");
      toast(error);
    }
  }
}
