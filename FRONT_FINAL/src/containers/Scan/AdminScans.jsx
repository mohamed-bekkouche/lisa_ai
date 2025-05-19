// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   IconButton,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Avatar,
//   useTheme,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Button,
//   Tooltip,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";

// // Icons
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import ImageIcon from "@mui/icons-material/Image";
// import StarIcon from "@mui/icons-material/Star";
// import CloseIcon from "@mui/icons-material/Close";
// import WarningIcon from "@mui/icons-material/Warning";
// import axios from "../../helpers/axios";
// import { BASE_URL } from "../../configs";

// export default function AdminScans() {
//   const { t } = useTranslation();
//   const { role } = useSelector((state) => state.login);
//   const isAdmin = role === "Admin";

//   const [currentPage, setCurrentPage] = useState(1);
//   const [nbOfPages, setNbOfPages] = useState(1);
//   const [limit, setLimit] = useState(10);

//   // State for scans data
//   const [scans, setScans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // State for delete confirmation
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [scanToDelete, setScanToDelete] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   // State for preview dialog
//   const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
//   const [currentPreview, setCurrentPreview] = useState(null);

//   // Fetch all scans
//   useEffect(() => {
//     if (!isAdmin) return;

//     const fetchScans = async () => {
//       try {
//         const { data } = await axios.get("/admin/scans", {
//           params: {
//             page: currentPage,
//             limit,
//           },
//         });
//         setScans(data?.scans);
//         setNbOfPages(data?.NbOfPages);
//         setLoading(false);
//       } catch (err) {
//         console.error("Failed to fetch scans:", err);
//         setError(t("Failed to load scans. Please try again."));
//         setLoading(false);
//       }
//     };

//     fetchScans();
//   }, [isAdmin, t]);

//   // Handle delete confirmation
//   const handleDeleteClick = (scan) => {
//     setScanToDelete(scan);
//     setDeleteDialogOpen(true);
//   };

//   // Handle actual deletion
//   const handleConfirmDelete = async () => {
//     if (!scanToDelete) return;

//     setDeleting(true);
//     try {
//       await axios.delete(`/admin/scans/${scanToDelete._id}`);
//       setScans(scans.filter((scan) => scan._id !== scanToDelete._id));
//       setDeleteDialogOpen(false);
//       setScanToDelete(null);
//     } catch (err) {
//       console.error("Failed to delete scan:", err);
//       setError(t("Failed to delete scan. Please try again."));
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // Handle preview
//   const handlePreviewClick = (scan) => {
//     setCurrentPreview(scan);
//     setPreviewDialogOpen(true);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Only render this component for admins
//   if (!isAdmin) {
//     return null;
//   }

//   return (
//     <Card
//       sx={{
//         borderRadius: "24px",
//         background: "rgba(15, 23, 42, 0.6)",
//         backdropFilter: "blur(20px)",
//         boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
//         overflow: "hidden",
//         position: "relative",
//         border: "1px solid rgba(236, 72, 153, 0.2)",
//         mb: 4,
//         opacity: 1,
//         transform: "translateY(0)",
//         transition: "opacity 0.5s ease, transform 0.5s ease",
//         "&::before": {
//           content: '""',
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           height: "4px",
//           background: "linear-gradient(to right, #ec4899, #8b5cf6)",
//         },
//       }}
//     >
//       <CardContent sx={{ p: 4 }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//           <Avatar
//             sx={{
//               bgcolor: "rgba(236, 72, 153, 0.1)",
//               color: "#ec4899",
//               mr: 2,
//               width: 48,
//               height: 48,
//             }}
//           >
//             <StarIcon />
//           </Avatar>
//           <Box>
//             <Typography variant="h5" fontWeight="bold" color="white">
//               {t("Manage Scans")}
//             </Typography>
//             <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
//               {t("View and manage all patient scans")}
//             </Typography>
//           </Box>
//         </Box>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//             <CircularProgress color="secondary" />
//           </Box>
//         ) : error ? (
//           <Box
//             sx={{
//               p: 3,
//               borderRadius: "12px",
//               backgroundColor: "rgba(239, 68, 68, 0.1)",
//               border: "1px solid rgba(239, 68, 68, 0.2)",
//               mb: 3,
//             }}
//           >
//             <Typography color="#ef4444">{error}</Typography>
//           </Box>
//         ) : scans.length === 0 ? (
//           <Box
//             sx={{
//               p: 4,
//               textAlign: "center",
//               borderRadius: "12px",
//               backgroundColor: "rgba(139, 92, 246, 0.05)",
//               border: "1px dashed rgba(139, 92, 246, 0.3)",
//             }}
//           >
//             <Typography color="rgba(255, 255, 255, 0.7)">
//               {t("No scans found")}
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer
//             component={Paper}
//             sx={{
//               backgroundColor: "rgba(15, 23, 42, 0.3)",
//               backdropFilter: "blur(10px)",
//               border: "1px solid rgba(139, 92, 246, 0.2)",
//               borderRadius: "12px",
//               overflow: "hidden",
//             }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}>
//                   <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                     {t("Patient")}
//                   </TableCell>
//                   <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                     {t("Type")}
//                   </TableCell>
//                   <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                     {t("Uploaded")}
//                   </TableCell>
//                   <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                     {t("Status")}
//                   </TableCell>
//                   <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                     {t("Actions")}
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {scans.map((scan) => (
//                   <TableRow
//                     key={scan._id}
//                     sx={{
//                       "&:hover": {
//                         backgroundColor: "rgba(139, 92, 246, 0.05)",
//                       },
//                       borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
//                     }}
//                   >
//                     <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
//                       <div className="flex items-center">
//                         <img
//                           className="w-10 h-10 rounded-full mr-2"
//                           alt={scan?.patientID?.name}
//                           src={`${BASE_URL}${scan?.patientID?.avatar}`}
//                         />
//                         <p> {scan.patientID?.name || t("Unknown")}</p>
//                       </div>
//                     </TableCell>
//                     <TableCell sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
//                       <Chip
//                         icon={
//                           scan.fileType === "application/pdf" ? (
//                             <PictureAsPdfIcon />
//                           ) : (
//                             <ImageIcon />
//                           )
//                         }
//                         label={
//                           scan.fileType === "application/pdf" ? "PDF" : "Image"
//                         }
//                         size="small"
//                         sx={{
//                           backgroundColor:
//                             scan.fileType === "application/pdf"
//                               ? "rgba(239, 68, 68, 0.1)"
//                               : "rgba(16, 185, 129, 0.1)",
//                           color:
//                             scan.fileType === "application/pdf"
//                               ? "#ef4444"
//                               : "#10b981",
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
//                       {formatDate(scan.createdAt)}
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={t(scan.status || "Pending")}
//                         size="small"
//                         sx={{
//                           backgroundColor:
//                             scan.status === "processed"
//                               ? "rgba(16, 185, 129, 0.1)"
//                               : "rgba(245, 158, 11, 0.1)",
//                           color:
//                             scan.status === "processed" ? "#10b981" : "#f59e0b",
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: "flex", gap: 1 }}>
//                         <Tooltip title={t("Preview")}>
//                           <IconButton
//                             onClick={() => handlePreviewClick(scan)}
//                             sx={{
//                               color: "#8b5cf6",
//                               "&:hover": {
//                                 backgroundColor: "rgba(139, 92, 246, 0.1)",
//                               },
//                             }}
//                           >
//                             <VisibilityIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title={t("Delete")}>
//                           <IconButton
//                             onClick={() => handleDeleteClick(scan)}
//                             sx={{
//                               color: "#ef4444",
//                               "&:hover": {
//                                 backgroundColor: "rgba(239, 68, 68, 0.1)",
//                               },
//                             }}
//                           >
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </CardContent>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => !deleting && setDeleteDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           style: {
//             borderRadius: 16,
//             backgroundColor: "rgba(15, 23, 42, 0.95)",
//             backdropFilter: "blur(20px)",
//             border: "1px solid rgba(239, 68, 68, 0.2)",
//             overflow: "hidden",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             background: "rgba(239, 68, 68, 0.1)",
//             color: "white",
//             fontWeight: "bold",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
//           }}
//         >
//           {t("Confirm Deletion")}
//           {!deleting && (
//             <IconButton
//               onClick={() => setDeleteDialogOpen(false)}
//               size="small"
//               sx={{ color: "rgba(255, 255, 255, 0.7)" }}
//             >
//               <CloseIcon />
//             </IconButton>
//           )}
//         </DialogTitle>
//         <DialogContent sx={{ py: 3 }}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               textAlign: "center",
//               py: 2,
//             }}
//           >
//             <WarningIcon
//               sx={{
//                 fontSize: 60,
//                 color: "#ef4444",
//                 mb: 2,
//               }}
//             />
//             <Typography variant="h6" color="white" gutterBottom>
//               {t("Are you sure you want to delete this scan?")}
//             </Typography>
//             <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
//               {t(
//                 "This action cannot be undone. The scan will be permanently removed."
//               )}
//             </Typography>
//           </Box>
//         </DialogContent>
//         <DialogActions
//           sx={{
//             borderTop: "1px solid rgba(239, 68, 68, 0.2)",
//             p: 2,
//             justifyContent: "space-between",
//           }}
//         >
//           <Button
//             onClick={() => setDeleteDialogOpen(false)}
//             disabled={deleting}
//             sx={{
//               color: "rgba(255, 255, 255, 0.7)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 0.05)",
//               },
//             }}
//           >
//             {t("Cancel")}
//           </Button>
//           <Button
//             onClick={handleConfirmDelete}
//             disabled={deleting}
//             variant="contained"
//             startIcon={<DeleteIcon />}
//             sx={{
//               background: "linear-gradient(45deg, #ef4444, #dc2626)",
//               color: "white",
//               fontWeight: 600,
//               borderRadius: "8px",
//               "&:hover": {
//                 background: "linear-gradient(45deg, #dc2626, #b91c1c)",
//               },
//               "&.Mui-disabled": {
//                 background: "rgba(255, 255, 255, 0.1)",
//                 color: "rgba(255, 255, 255, 0.3)",
//               },
//             }}
//           >
//             {deleting ? (
//               <>
//                 <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
//                 {t("Deleting...")}
//               </>
//             ) : (
//               t("Delete Permanently")
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Preview Dialog */}
//       <Dialog
//         open={previewDialogOpen}
//         onClose={() => setPreviewDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           style: {
//             borderRadius: 16,
//             backgroundColor: "rgba(15, 23, 42, 0.95)",
//             backdropFilter: "blur(20px)",
//             border: "1px solid rgba(139, 92, 246, 0.2)",
//             overflow: "hidden",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             background:
//               "linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))",
//             color: "white",
//             fontWeight: "bold",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
//           }}
//         >
//           {t("Scan Preview")}
//           <IconButton
//             onClick={() => setPreviewDialogOpen(false)}
//             size="small"
//             sx={{ color: "rgba(255, 255, 255, 0.7)" }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ py: 3 }}>
//           {currentPreview && (
//             <Box sx={{ textAlign: "center" }}>
//               <Typography variant="h6" color="white" gutterBottom>
//                 {currentPreview.originalName}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 color="rgba(255, 255, 255, 0.7)"
//                 gutterBottom
//               >
//                 {t("Uploaded by")}:{" "}
//                 {currentPreview.patientID?.name || t("Unknown")} •{" "}
//                 {formatDate(currentPreview.createdAt)}
//               </Typography>

//               <Box
//                 sx={{
//                   mt: 3,
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                   maxHeight: "70vh",
//                   display: "flex",
//                   justifyContent: "center",
//                   backgroundColor: "rgba(0, 0, 0, 0.3)",
//                   border: "1px solid rgba(139, 92, 246, 0.2)",
//                 }}
//               >
//                 {currentPreview.fileType === "application/pdf" ? (
//                   <Box
//                     sx={{
//                       p: 3,
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                     }}
//                   >
//                     <PictureAsPdfIcon
//                       sx={{
//                         fontSize: 80,
//                         color: "#ef4444",
//                         mb: 2,
//                       }}
//                     />
//                     <Typography color="rgba(255, 255, 255, 0.7)">
//                       {t("PDF preview not available. Download to view.")}
//                     </Typography>
//                     <Button
//                       variant="outlined"
//                       color="secondary"
//                       sx={{ mt: 2 }}
//                       href={currentPreview.fileUrl}
//                       target="_blank"
//                       download
//                     >
//                       {t("Download PDF")}
//                     </Button>
//                   </Box>
//                 ) : (
//                   <img
//                     src={BASE_URL + currentPreview.imageURL}
//                     alt="Scan preview"
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: "70vh",
//                       objectFit: "contain",
//                     }}
//                   />
//                 )}
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions
//           sx={{
//             borderTop: "1px solid rgba(139, 92, 246, 0.2)",
//             p: 2,
//           }}
//         >
//           <Button
//             onClick={() => setPreviewDialogOpen(false)}
//             sx={{
//               color: "rgba(255, 255, 255, 0.7)",
//               "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 0.05)",
//               },
//             }}
//           >
//             {t("Close")}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Card>
//   );
// }

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Tooltip,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import axios from "../../helpers/axios";
import { BASE_URL } from "../../configs";

export default function AdminScans() {
  const { t } = useTranslation();
  const { role } = useSelector((state) => state.login);
  const isAdmin = role === "Admin";

  const [currentPage, setCurrentPage] = useState(1);
  const [nbOfPages, setNbOfPages] = useState(1);
  const [limit, setLimit] = useState(10);

  // State for scans data
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scanToDelete, setScanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // State for preview dialog
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);

  // Fetch all scans
  useEffect(() => {
    if (!isAdmin) return;

    const fetchScans = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/admin/scans", {
          params: {
            page: currentPage,
            limit,
          },
        });
        setScans(data?.scans || []);
        setNbOfPages(data?.NbOfPages || 1);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch scans:", err);
        setError(t("Failed to load scans. Please try again."));
        setScans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [isAdmin, t, currentPage, limit]);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Handle delete confirmation
  const handleDeleteClick = (scan) => {
    setScanToDelete(scan);
    setDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    if (!scanToDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`/admin/scans/${scanToDelete._id}`);
      setScans(scans.filter((scan) => scan._id !== scanToDelete._id));

      // If we deleted the last item on the page, go to previous page
      if (scans.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      setDeleteDialogOpen(false);
      setScanToDelete(null);
    } catch (err) {
      console.error("Failed to delete scan:", err);
      setError(t("Failed to delete scan. Please try again."));
    } finally {
      setDeleting(false);
    }
  };

  // Handle preview
  const handlePreviewClick = (scan) => {
    setCurrentPreview(scan);
    setPreviewDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Only render this component for admins
  if (!isAdmin) {
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
              {t("Manage Scans")}
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              {t("View and manage all patient scans")}
            </Typography>
          </Box>
        </Box>

        {/* Pagination Controls */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="rows-per-page-label"
                sx={{ color: "rgba(83, 58, 152, 1.0)" }}
              >
                {t("Rows per page")}
              </InputLabel>
              <Select
                className="w-20"
                labelId="rows-per-page-label"
                value={limit}
                label={t("Rows per page")}
                onChange={handleLimitChange}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(83, 58, 152, 1.0)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(83, 58, 152, 1.0)",
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : error ? (
          <Box
            sx={{
              p: 3,
              borderRadius: "12px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              mb: 3,
            }}
          >
            <Typography color="#ef4444">{error}</Typography>
          </Box>
        ) : scans.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "rgba(139, 92, 246, 0.05)",
              border: "1px dashed rgba(139, 92, 246, 0.3)",
            }}
          >
            <Typography color="rgba(255, 255, 255, 0.7)">
              {t("No scans found")}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "rgba(15, 23, 42, 0.3)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: "12px",
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      {t("Patient")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        paddingLeft: "20px",
                      }}
                    >
                      {t("Email")}
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      {t("Type")}
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      {t("Uploaded")}
                    </TableCell>

                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      {t("Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scans.map((scan) => (
                    <TableRow
                      key={scan._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(139, 92, 246, 0.05)",
                        },
                        borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                      }}
                    >
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        <div className="flex items-center">
                          <img
                            className="w-10 h-10 rounded-full mr-2"
                            alt={scan?.patientID?.name}
                            src={`${BASE_URL}${scan?.patientID?.avatar}`}
                          />
                          <p> {scan.patientID?.name || t("Unknown")}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={scan?.patientID?.email}
                          size="small"
                          sx={{
                            fontSize: "1rem",
                            color: "white",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        <Chip
                          icon={
                            scan.fileType === "application/pdf" ? (
                              <PictureAsPdfIcon />
                            ) : (
                              <ImageIcon />
                            )
                          }
                          label={
                            scan.fileType === "application/pdf"
                              ? "PDF"
                              : "Image"
                          }
                          size="small"
                          sx={{
                            backgroundColor:
                              scan.fileType === "application/pdf"
                                ? "rgba(239, 68, 68, 0.1)"
                                : "rgba(16, 185, 129, 0.1)",
                            color:
                              scan.fileType === "application/pdf"
                                ? "#ef4444"
                                : "#10b981",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        {formatDate(scan.createdAt)}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title={t("Preview")}>
                            <IconButton
                              onClick={() => handlePreviewClick(scan)}
                              sx={{
                                color: "#8b5cf6",
                                "&:hover": {
                                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t("Delete")}>
                            <IconButton
                              onClick={() => handleDeleteClick(scan)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Bottom Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={nbOfPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "rgba(139, 92, 246, 0.5)",
                    color: "white",
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "rgba(139, 92, 246, 0.2)",
                  },
                }}
              />
            </Box>
          </>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 16,
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          {t("Confirm Deletion")}
          {!deleting && (
            <IconButton
              onClick={() => setDeleteDialogOpen(false)}
              size="small"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              py: 2,
            }}
          >
            <WarningIcon
              sx={{
                fontSize: 60,
                color: "#ef4444",
                mb: 2,
              }}
            />
            <Typography variant="h6" color="white" gutterBottom>
              {t("Are you sure you want to delete this scan?")}
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              {t(
                "This action cannot be undone. The scan will be permanently removed."
              )}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid rgba(239, 68, 68, 0.2)",
            p: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
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
            onClick={handleConfirmDelete}
            disabled={deleting}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              background: "linear-gradient(45deg, #ef4444, #dc2626)",
              color: "white",
              fontWeight: 600,
              borderRadius: "8px",
              "&:hover": {
                background: "linear-gradient(45deg, #dc2626, #b91c1c)",
              },
              "&.Mui-disabled": {
                background: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            {deleting ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                {t("Deleting...")}
              </>
            ) : (
              t("Delete Permanently")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
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
          {t("Scan Preview")}
          <IconButton
            onClick={() => setPreviewDialogOpen(false)}
            size="small"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {currentPreview && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="white" gutterBottom>
                {currentPreview.originalName}
              </Typography>
              <Typography
                variant="body2"
                color="rgba(255, 255, 255, 0.7)"
                gutterBottom
              >
                {t("Uploaded by")}:{" "}
                {currentPreview.patientID?.name || t("Unknown")} •{" "}
                {formatDate(currentPreview.createdAt)}
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  borderRadius: "8px",
                  overflow: "hidden",
                  maxHeight: "70vh",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                }}
              >
                {currentPreview.fileType === "application/pdf" ? (
                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <PictureAsPdfIcon
                      sx={{
                        fontSize: 80,
                        color: "#ef4444",
                        mb: 2,
                      }}
                    />
                    <Typography color="rgba(255, 255, 255, 0.7)">
                      {t("PDF preview not available. Download to view.")}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ mt: 2 }}
                      href={currentPreview.fileUrl}
                      target="_blank"
                      download
                    >
                      {t("Download PDF")}
                    </Button>
                  </Box>
                ) : (
                  <img
                    src={BASE_URL + currentPreview.imageURL}
                    alt="Scan preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid rgba(139, 92, 246, 0.2)",
            p: 2,
          }}
        >
          <Button
            onClick={() => setPreviewDialogOpen(false)}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            {t("Close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
