const express = require("express");
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  deleteVehicle,
  createVehicle,
  updateVehicle,
  createVehicleReview,
  deleteVehicleReview,
} = require("../controllers/vehicleController");
const { protect, admin } = require("../middleware/authMiddleware.js");

router.get("/", getVehicles);
router.post("/", protect, admin, createVehicle);
router.post("/:id/reviews", protect, createVehicleReview);
router.delete("/:id/reviews/:reviewId", protect, deleteVehicleReview);

router.get("/:id", getVehicle);
router.delete("/:id", protect, admin, deleteVehicle);
router.put("/:id", protect, admin, updateVehicle);

module.exports = router;
