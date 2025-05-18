import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Paper,
} from "@mui/material"
import { CreditCard, AttachMoney } from "@mui/icons-material"


export default function PaymentForm({ onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formComplete, setFormComplete] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onSuccess()
    }, 2000)
  }

  const handleFormChange = (e) => {
    // This is a simplified validation - in a real app you'd want more robust validation
    if (e.target.value.length > 0) {
      setFormComplete(true)
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Upgrade to Premium
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Get unlimited access to all premium features and content with our premium subscription.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "#f9f9f9" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Premium Membership</Typography>
          <Typography variant="h6" color="primary">
            $9.99/month
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          • Unlimited access to all content • Priority customer support • Ad-free experience • Early access to new
          features
        </Typography>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>

      {paymentMethod === "credit-card" && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Card Number"
                fullWidth
                placeholder="1234 5678 9012 3456"
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Expiry Date" fullWidth placeholder="MM/YY" required />
            </Grid>
            <Grid item xs={6}>
              <TextField label="CVC" fullWidth placeholder="123" required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Cardholder Name" fullWidth placeholder="John Doe" required />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Your payment information is secure and encrypted.
              </Alert>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isProcessing || !formComplete}
              >
                {isProcessing ? "Processing..." : "Pay $9.99 and Upgrade"}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  )
}
