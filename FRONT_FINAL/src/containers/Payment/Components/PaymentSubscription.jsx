"use client"

import { Box, Typography, Button, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Chip } from "@mui/material"
import { CheckCircle, AccessTime, CalendarToday } from "@mui/icons-material"

export default function PremiumSubscription() {
  const subscriptionDetails = {
    plan: "Premium",
    status: "Active",
    nextBillingDate: "June 5, 2025",
    amount: "$9.99",
    paymentMethod: "Visa ending in 4242",
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Your Premium Subscription</Typography>
        <Chip label="Active" color="success" icon={<CheckCircle />} sx={{ fontWeight: "bold" }} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} size={6}>
          <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Subscription Details
            </Typography>

            <Grid container spacing={2} sx={{flexDirection:"column",justifyItems:"flex-start", mb: 2 }}>
              <Grid item xs={6}>
                <Typography align="left" variant="body2" color="text.secondary">
                  Plan
                </Typography>
                <Typography align="left"  variant="body1" fontWeight="medium">
                  {subscriptionDetails.plan}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="left" variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography align="left" variant="body1" fontWeight="medium">
                  {subscriptionDetails.status}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="left" variant="body2" color="text.secondary">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                    Next Billing
                  </Box>
                </Typography>
                <Typography align="left" variant="body1" fontWeight="medium">
                  {subscriptionDetails.nextBillingDate}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="left" variant="body2" color="text.secondary">
                  Amount
                </Typography>
                <Typography align="left" variant="body1" fontWeight="medium">
                  {subscriptionDetails.amount}/month
                </Typography>
              </Grid>
            </Grid>

            <Typography align="left" variant="body2" color="text.secondary" gutterBottom>
              Payment Method
            </Typography>
            <Typography align="left" variant="body1">{subscriptionDetails.paymentMethod}</Typography>

            <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
              <Button variant="outlined" size="small">
                Update Payment
              </Button>
              <Button variant="outlined" color="error" size="small">
                Cancel Subscription
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} size={6}>
          <Paper elevation={1} sx={{ p: 3, bgcolor: "#f8f9ff", height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Premium Benefits
            </Typography>

            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Unlimited access to all content" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Priority customer support" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Ad-free experience" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Early access to new features" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AccessTime color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Member since May 5, 2025" secondary="Thank you for your support!" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
