import { Router } from "express";
import {
  createSubscription,
  cancelSubscription,
  getSubscription,
} from "../controllers/PaymentController.js";

const paymentRoutes = Router();

paymentRoutes.post("/create", createSubscription);
paymentRoutes.post("/cancel", cancelSubscription);
paymentRoutes.get("/:subscriptionId", getSubscription);

export default paymentRoutes;

