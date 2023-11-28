const express = require("express");
const {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  removeOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrder);
router.get("/admin", protect, admin, getOrders);
router.patch("/:id/confirm", updateOrder);
router.patch("/:id/availability", updateOrder);
router.delete("/:id", removeOrder);

module.exports = router;
