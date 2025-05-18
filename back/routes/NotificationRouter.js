import {Router} from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/NotificationController.js";

const router = Router();

router.get("/", authenticateToken, getNotifications);
router.put("/read/:notificationId",authenticateToken, markAsRead);
router.put("/read-all", authenticateToken, markAllAsRead);

export default router;
