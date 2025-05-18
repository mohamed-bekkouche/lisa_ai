import { 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  Box, 
  Paper, 
  Button, 
  Select, 
  MenuItem, 
  InputAdornment,
  alpha,
  styled,
  useTheme,
  Card,
  CardContent,
  Divider,
  IconButton
} from "@mui/material";
import * as Yup from 'yup';
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { editPersonalData } from "../Login/LoginSlice";
import { useTranslation } from "react-i18next";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LockIcon from '@mui/icons-material/Lock';
import LanguageIcon from '@mui/icons-material/Language';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  padding: theme.spacing(3),
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  color: "#ffffff",
  fontWeight: 700,
  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
  background: "linear-gradient(to right, #ffffff, #ec4899)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: theme.spacing(1),
}));

const StyledCard = styled(Card)(({ theme, gradient }) => ({
  borderRadius: "24px",
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
  position: "relative",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  marginBottom: theme.spacing(4),
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
    background: gradient || "linear-gradient(to right, #8b5cf6, #ec4899)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    color: "#ffffff",
    backgroundColor: alpha("#1e1b4b", 0.3),
    borderRadius: "12px",
    "& fieldset": {
      borderColor: alpha("#8b5cf6", 0.3),
    },
    "&:hover fieldset": {
      borderColor: alpha("#8b5cf6", 0.5),
    },
    "&.Mui-focused fieldset": {
      borderColor: "#8b5cf6",
    },
    "&.Mui-disabled": {
      backgroundColor: alpha("#1e1b4b", 0.2),
      "& fieldset": {
        borderColor: alpha("#8b5cf6", 0.1),
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: alpha("#ffffff", 0.7),
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#8b5cf6",
  },
  "& .MuiFormHelperText-root": {
    color: "#f43f5e",
    marginLeft: 0,
    marginTop: 4,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: alpha("#1e1b4b", 0.3),
  borderRadius: "12px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha("#8b5cf6", 0.3),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha("#8b5cf6", 0.5),
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#8b5cf6",
  },
  "& .MuiSvgIcon-root": {
    color: alpha("#ffffff", 0.7),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  color: "#ffffff",
  fontWeight: "bold",
  borderRadius: "12px",
  padding: "10px 24px",
  boxShadow: "0 4px 20px rgba(236, 72, 153, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 25px rgba(236, 72, 153, 0.4)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&.Mui-disabled": {
    background: alpha("#8b5cf6", 0.3),
    color: alpha("#ffffff", 0.5),
  },
}));

const SectionIcon = styled(Box)(({ theme, color }) => ({
  width: 50,
  height: 50,
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: alpha(color || "#8b5cf6", 0.1),
  marginRight: theme.spacing(2),
}));

function handleError(schema, name) {
  if (schema.touched[name] && schema.errors[name]) {
    return schema.errors[name];
  }
  return null;
}

export default function Settings() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { name } = useSelector((state) => state.login);
  const [changePasswordMessage, setChangePasswordMessage] = useState({});
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef(null);
  
  const { t, i18n } = useTranslation();
  
  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Beautiful background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Create particles for the neural network
    const particles = [];
    const connections = [];
    const numParticles = 120;
    const connectionDistance = 150;
    const particleColors = ["#4c1d95", "#5b21b6", "#7e22ce", "#8b5cf6", "#6d28d9", "#4338ca", "#ec4899", "#be185d"];

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseSize: 0,
        pulseDirection: 1,
      });
    }

    // Animation function
    function animate() {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.5, "#1e1b4b");
      gradient.addColorStop(1, "#4a1d96");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        // Pulse effect
        particle.pulseSize += particle.pulseSpeed * particle.pulseDirection;
        if (particle.pulseSize > 1 || particle.pulseSize < 0) {
          particle.pulseDirection *= -1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius + particle.pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Find and draw connections
      connections.length = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            connections.push({
              p1: particles[i],
              p2: particles[j],
              opacity: 1 - distance / connectionDistance,
            });
          }
        }
      }

      // Draw connections
      connections.forEach((connection) => {
        ctx.beginPath();
        ctx.moveTo(connection.p1.x, connection.p1.y);
        ctx.lineTo(connection.p2.x, connection.p2.y);

        // Create gradient for connection
        const gradient = ctx.createLinearGradient(connection.p1.x, connection.p1.y, connection.p2.x, connection.p2.y);
        gradient.addColorStop(0, connection.p1.color.replace(")", `, ${connection.opacity})`).replace("rgb", "rgba"));
        gradient.addColorStop(1, connection.p2.color.replace(")", `, ${connection.opacity})`).replace("rgb", "rgba"));

        ctx.strokeStyle = gradient;
        ctx.lineWidth = connection.opacity * 1.5;
        ctx.stroke();
      });

      // Add subtle glow effect
      const radialGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
      radialGradient.addColorStop(0, "rgba(139, 92, 246, 0.05)");
      radialGradient.addColorStop(0.5, "rgba(124, 58, 237, 0.03)");
      radialGradient.addColorStop(1, "rgba(109, 40, 217, 0)");
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const changePasswordSchema = useFormik({
    initialValues: { password: '', new_password: '', confirm_new_password: '' },
    validationSchema: Yup.object({
      password: Yup.string().required(t("Required.")),
      new_password: Yup.string().required(t("Required.")),
      confirm_new_password: Yup.string()
        .required(t("Required."))
        .oneOf([Yup.ref('new_password')], t("Passwords must match"))
    }),
    onSubmit: (values) => {
      dispatch(editPersonalData(values.password, values.new_password, () => {
        // success
        setChangePasswordMessage({
          message: t("The password changed with success"),
          type: "success"
        });

        changePasswordSchema.resetForm();
        changePasswordSchema.setSubmitting(false);
      }, (error) => {
        // error
        setChangePasswordMessage({
          message: error,
          type: "error"
        });

        changePasswordSchema.setSubmitting(false);
      }));
    }
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        pb: 6,
      }}
    >
      {/* Beautiful Neural Network Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Background Overlay with more purple tint */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at center, rgba(91, 33, 182, 0.2) 0%, rgba(49, 10, 101, 0.6) 100%)",
          zIndex: 1,
        }}
      />

      <StyledContainer maxWidth="md">
        {/* Page Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            mt: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <PageTitle variant="h3" component="h1">
            {t("Settings")}
          </PageTitle>
        </Box>

        {/* Change Password Section */}
        <StyledCard
          sx={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.1s",
          }}
          gradient="linear-gradient(to right, #8b5cf6, #ec4899)"
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <SectionIcon color="#ec4899">
                <LockIcon sx={{ color: "#ec4899" }} />
              </SectionIcon>
              <PageTitle variant="h5" component="h2">
                {t("Change password")}
              </PageTitle>
            </Box>

            <Divider sx={{ mb: 3, borderColor: alpha("#8b5cf6", 0.1) }} />

            <form onSubmit={changePasswordSchema.handleSubmit}>
              <Grid container spacing={3}>
                <Grid container item xs={12} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography color="rgba(255, 255, 255, 0.7)" variant="subtitle1" gutterBottom>
                      {t("Name")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <StyledTextField
                      name="name"
                      value={name}
                      disabled
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: alpha("#ec4899", 0.7) }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container item xs={12} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography color="rgba(255, 255, 255, 0.7)" variant="subtitle1" gutterBottom>
                      {t("Password")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <StyledTextField
                      name="password"
                      value={changePasswordSchema.values.password}
                      onChange={changePasswordSchema.handleChange}
                      onBlur={changePasswordSchema.handleBlur}
                      size="small"
                      type="password"
                      error={Boolean(handleError(changePasswordSchema, "password"))}
                      helperText={handleError(changePasswordSchema, "password")}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: alpha("#ec4899", 0.7) }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container item xs={12} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography color="rgba(255, 255, 255, 0.7)" variant="subtitle1" gutterBottom>
                      {t("New Password")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <StyledTextField
                      name="new_password"
                      value={changePasswordSchema.values.new_password}
                      onChange={changePasswordSchema.handleChange}
                      onBlur={changePasswordSchema.handleBlur}
                      size="small"
                      type="password"
                      error={Boolean(handleError(changePasswordSchema, "new_password"))}
                      helperText={handleError(changePasswordSchema, "new_password")}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: alpha("#ec4899", 0.7) }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container item xs={12} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography color="rgba(255, 255, 255, 0.7)" variant="subtitle1" gutterBottom>
                      {t("Confirm New Password")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <StyledTextField
                      name="confirm_new_password"
                      value={changePasswordSchema.values.confirm_new_password}
                      onChange={changePasswordSchema.handleChange}
                      onBlur={changePasswordSchema.handleBlur}
                      size="small"
                      type="password"
                      error={Boolean(handleError(changePasswordSchema, "confirm_new_password"))}
                      helperText={handleError(changePasswordSchema, "confirm_new_password")}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: alpha("#ec4899", 0.7) }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {changePasswordMessage.message && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor: 
                          changePasswordMessage.type === "success" 
                            ? alpha("#10b981", 0.1) 
                            : alpha("#ef4444", 0.1),
                        border: `1px solid ${
                          changePasswordMessage.type === "success" 
                            ? alpha("#10b981", 0.3) 
                            : alpha("#ef4444", 0.3)
                        }`,
                      }}
                    >
                      <Typography
                        color={changePasswordMessage.type === "success" ? "#10b981" : "#ef4444"}
                      >
                        {changePasswordMessage.message}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid container item xs={12} alignItems="center" justifyContent="flex-end">
                  <StyledButton
                    variant="contained"
                    disableElevation
                    type="submit"
                    disabled={changePasswordSchema.isSubmitting || !changePasswordSchema.isValid}
                    startIcon={<SaveIcon />}
                  >
                    {t("Submit")}
                  </StyledButton>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </StyledCard>

        {/* Change Language Section */}
        <StyledCard
          sx={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.2s",
          }}
          gradient="linear-gradient(to right, #ec4899, #8b5cf6)"
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <SectionIcon color="#8b5cf6">
                <LanguageIcon sx={{ color: "#8b5cf6" }} />
              </SectionIcon>
              <PageTitle variant="h5" component="h2">
                {t("Change language")}
              </PageTitle>
            </Box>

            <Divider sx={{ mb: 3, borderColor: alpha("#8b5cf6", 0.1) }} />

            <Grid container spacing={3}>
              <Grid container item xs={12} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography color="rgba(255, 255, 255, 0.7)" variant="subtitle1" gutterBottom>
                    {t("Language")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <StyledSelect
                    onChange={(e) => handleChangeLanguage(e.target.value)}
                    fullWidth
                    value={i18n.language}
                    startAdornment={
                      <InputAdornment position="start">
                        <LanguageIcon sx={{ color: alpha("#8b5cf6", 0.7) }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="en">{t("English")}</MenuItem>
                    <MenuItem value="fr">{t("French")}</MenuItem>
                  </StyledSelect>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </StyledContainer>
    </Box>
  );
}