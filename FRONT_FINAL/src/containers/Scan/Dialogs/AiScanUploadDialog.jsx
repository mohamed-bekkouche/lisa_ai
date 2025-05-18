"use client"

import { FormHelperText, Grid, Box, Typography, Autocomplete, Avatar } from "@mui/material"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import ImageIcon from "@mui/icons-material/Image"
import TextField from "@mui/material/TextField"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AsyncRequstScan } from "../ScanSlice"
import { useTranslation } from "react-i18next"

import * as Yup from "yup"

function handleError(schema, name) {
  if (schema.touched[name] && schema.errors[name]) {
    return schema.errors[name]
  }

  return null
}

export default function AiScanUploadDialog(props) {
  const { open, handleClose, isUpdate, model } = props
  const { scans } = useSelector((state) => state.scan)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (open) {
      setLoaded(true)
    } else {
      setTimeout(() => {
        setLoaded(false)
      }, 300)
    }
  }, [open])

  const schema = useFormik({
    initialValues: { scanId: "" },
    validationSchema: Yup.object({
      scanId: Yup.object().required(t("Required.")),
    }),
    onSubmit: (values) => {
      const formData = new FormData()
      dispatch(AsyncRequstScan(values.scanId._id))
      handleClose()
    },
  })

  useEffect(() => {
    if (scans.length !== 0) {
      schema.setFieldValue("scanId", scans[0])
    } else {
      schema.setFieldValue("scanId", "")
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(to right, #8b5cf6, #ec4899)",
          },
        },
      }}
    >
      <Box
        component="form"
        onSubmit={schema.handleSubmit}
        sx={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            fontWeight: 700,
            background: "linear-gradient(to right, #ffffff, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            pb: 1,
          }}
        >
          {t("Upload scan")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(139, 92, 246, 0.1)",
                color: "#8b5cf6",
                mr: 2,
              }}
            >
              <ImageIcon />
            </Avatar>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
              {t("Select a scan to process with AI analysis")}
            </Typography>
          </Box>

          <Grid spacing={2} container sx={{ alignItems: "center" }}>
            <Grid item xs={12}>
              <Autocomplete
                error={!!handleError(schema, "ScanId")}
                helperText={handleError(schema, "ScanId")}
                onChange={(even, value, reason) => {
                  console.log(value)
                  schema.setFieldValue("scanId", value)
                }}
                disablePortal
                fullWidth
                options={scans}
                value={schema.values.scanId}
                onBlur={schema.handleBlur}
                getOptionLabel={(option) => {
                  return `${option.imageURL.split("/").pop()}`
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      margin="dense"
                      name="scan"
                      label={t("Scan")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.4)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#8b5cf6",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />
                  )
                }}
                sx={{
                  "& .MuiAutocomplete-paper": {
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    borderRadius: "12px",
                  },
                  "& .MuiAutocomplete-option": {
                    "&:hover": {
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(139, 92, 246, 0.2)",
                    },
                  },
                }}
              />
              {handleError(schema, "ScanId") && <FormHelperText error>{handleError(schema, "ScanId")}</FormHelperText>}
            </Grid>
          </Grid>

          <Box
            sx={{
              p: 3,
              mt: 3,
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
              border: "1px solid rgba(236, 72, 153, 0.2)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography color="rgba(255, 255, 255, 0.9)" variant="body2">
              {t(
                "The selected scan will be processed by our AI system for enhanced analysis and diagnosis assistance.",
              )}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              handleClose()
            }}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.2)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            disabled={!schema.isValid}
            type="submit"
            sx={{
              background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
              color: "white",
              borderRadius: "12px",
              fontWeight: 600,
              boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #7c3aed, #db2777)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(236, 72, 153, 0.4)",
              },
              transition: "all 0.3s ease",
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            {t("Process Scan")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
