import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormHelperText,
  Alert,
  AlertTitle,
  Avatar,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
// import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import StarIcon from "@mui/icons-material/Star";

// import { BASE_URL } from "../../configs";
import axios from "../../helpers/axios";

export default function ScanUpload({ onUploadSuccess }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const { isPatientPremium } = useSelector((state) => state.payment);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError(t("Invalid file type. Please upload an image or PDF."));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(t("File size exceeds 10MB limit."));
      return;
    }

    setSelectedFile(file);
    setUploadError(null);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, use a placeholder
      setPreviewUrl(null);
    }

    // Open the upload dialog
    setUploadDialogOpen(true);
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Close dialog and reset states
  const handleCloseDialog = () => {
    setUploadDialogOpen(false);
    setUploadError(null);
    setUploadSuccess(false);
  };

  // Handle scan upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append("image", selectedFile);
    // formData.append("patientId", id);
    // formData.append("description", description);

    try {
      const response = await axios.post("/patient/scans", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Success handling
      setUploadSuccess(true);

      // Reset form after 1.5 seconds
      setTimeout(() => {
        if (onUploadSuccess && typeof onUploadSuccess === "function") {
          onUploadSuccess(response.data);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadDialogOpen(false);
        setUploadSuccess(false);
        setIsUploading(false);
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error.response?.data?.message ||
          t("Failed to upload scan. Please try again.")
      );
      setIsUploading(false);
    }
  };

  // Only render this component for premium patients
  if (!isPatientPremium) {
    return null;
  }

  return (
    <Card
      sx={{
        borderRadius: "24px",
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(236, 72, 153, 0.2)",
        mb: 4,
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(to right, #ec4899, #8b5cf6)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: "rgba(236, 72, 153, 0.1)",
              color: "#ec4899",
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            <StarIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="white">
              {t("Upload New Scan")}
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              {t("Premium members can upload scans directly")}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 4,
            borderRadius: "16px",
            border: "2px dashed rgba(139, 92, 246, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(139, 92, 246, 0.05)",
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              borderColor: "rgba(139, 92, 246, 0.5)",
              background: "rgba(139, 92, 246, 0.1)",
              transform: "translateY(-2px)",
            },
            position: "relative",
            overflow: "hidden",
          }}
          onClick={handleButtonClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/gif,application/pdf"
          />

          <CloudUploadIcon
            sx={{
              fontSize: 60,
              color: "#8b5cf6",
              mb: 2,
              opacity: 0.8,
            }}
          />

          <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
            {t("Upload Your Medical Scan")}
          </Typography>

          <Typography
            variant="body2"
            color="rgba(255, 255, 255, 0.7)"
            align="center"
            sx={{ mb: 3, maxWidth: 500 }}
          >
            {t(
              "Drop your file here or click to browse. Supports JPEG, PNG, GIF and PDF formats up to 10MB."
            )}
          </Typography>

          <Button
            variant="contained"
            startIcon={<ImageIcon />}
            sx={{
              background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
              color: "white",
              borderRadius: "12px",
              py: 1,
              px: 3,
              fontWeight: 600,
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #7c3aed, #db2777)",
                boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {t("Select File")}
          </Button>
        </Box>
      </CardContent>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={!isUploading ? handleCloseDialog : undefined}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 16,
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background:
              "linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          {t("Upload Scan")}
          {!isUploading && (
            <IconButton
              onClick={handleCloseDialog}
              size="small"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {uploadError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                "& .MuiAlert-icon": {
                  color: "#ef4444",
                },
              }}
            >
              <AlertTitle>{t("Error")}</AlertTitle>
              {uploadError}
            </Alert>
          )}

          <Fade in={uploadSuccess}>
            <Box
              sx={{
                display: uploadSuccess ? "flex" : "none",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 64,
                  color: "#10b981",
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                color="white"
                align="center"
                gutterBottom
              >
                {t("Upload Successful!")}
              </Typography>
              <Typography
                variant="body2"
                color="rgba(255, 255, 255, 0.7)"
                align="center"
              >
                {t(
                  "Your scan has been uploaded and will be processed shortly."
                )}
              </Typography>
            </Box>
          </Fade>

          {!uploadSuccess && (
            <>
              {/* File Preview */}
              <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                {previewUrl ? (
                  <Box
                    sx={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      width: "100%",
                      maxWidth: 300,
                      maxHeight: 200,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Scan preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      borderRadius: "8px",
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      width: "100%",
                      maxWidth: 300,
                    }}
                  >
                    <DescriptionIcon
                      sx={{
                        fontSize: 40,
                        color: "rgba(255, 255, 255, 0.5)",
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="rgba(255, 255, 255, 0.7)"
                    >
                      {selectedFile?.name || t("PDF Document")}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* File Information */}
              {selectedFile && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: "8px",
                    backgroundColor: "rgba(139, 92, 246, 0.05)",
                    border: "1px solid rgba(139, 92, 246, 0.1)",
                  }}
                >
                  <Typography variant="subtitle2" color="white" gutterBottom>
                    {t("File Details")}
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    <strong>{t("Name")}:</strong> {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    <strong>{t("Type")}:</strong> {selectedFile.type}
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    <strong>{t("Size")}:</strong>{" "}
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <Box sx={{ textAlign: "center", my: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={uploadProgress}
                    size={60}
                    thickness={4}
                    sx={{
                      color: "#8b5cf6",
                      mb: 2,
                    }}
                  />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    {uploadProgress}% {t("Uploaded")}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        {!uploadSuccess && (
          <DialogActions
            sx={{
              borderTop: "1px solid rgba(139, 92, 246, 0.2)",
              p: 2,
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={handleCloseDialog}
              disabled={isUploading}
              startIcon={<CancelIcon />}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                color: "white",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": {
                  background: "linear-gradient(45deg, #7c3aed, #db2777)",
                },
                "&.Mui-disabled": {
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {isUploading ? t("Uploading...") : t("Upload Scan")}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Card>
  );
}
