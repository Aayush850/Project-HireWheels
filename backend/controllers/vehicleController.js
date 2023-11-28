const asyncHandler = require("express-async-handler");
const Vehicle = require("../models/vehicleModel");

const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({});
  res.json(vehicles);
});

const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (vehicle) {
    res.json(vehicle);
  } else {
    res.status(404).json({ message: "Vehicle Not Found" });
  }
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (vehicle) {
    await vehicle.deleteOne();
    res.json({ message: "Vehicle Removed!" });
  } else {
    res.status(404).json({ message: "Vehicle Not Found" });
  }
});

const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = new Vehicle({
    name: "Sample name",
    price: 0,
    image: "/images/sample.jpg",
    brand: "sample brand",
    category: "sample category",
    type: "Petrol",
    numReviews: 0,
    rating: 0,
    driven: 0,
    passenger: 0,
    description: "Sample Description",
  });

  const createdVehicle = await vehicle.save();
  res.status(201).json(createdVehicle);
});

const updateVehicle = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    type,
    driven,
    passenger,
  } = req.body;

  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    vehicle.name = name;
    vehicle.price = price;
    vehicle.description = description;
    vehicle.image = image;
    vehicle.brand = brand;
    vehicle.category = category;
    vehicle.type = type;
    vehicle.driven = driven;
    vehicle.passenger = passenger;

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } else {
    res.status(404);
    throw new Error("Vehicle Not Found");
  }
});

const createVehicleReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    const alreadyReviewed = vehicle.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Vehicle already reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    vehicle.reviews.push(review);
    vehicle.numReviews = vehicle.reviews.length;
    vehicle.rating =
      vehicle.reviews.reduce((acc, item) => item.rating + acc, 0) /
      vehicle.reviews.length;
    await vehicle.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Vehicle Not Found");
  }
});

const deleteVehicleReview = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    const reviewId = req.params.reviewId;
    console.log(reviewId);

    console.log("All Reviews:", vehicle.reviews);

    const reviewIndex = vehicle.reviews.findIndex(
      (r) => r._id.toString() === reviewId.toString()
    );
    console.log(reviewIndex);

    if (reviewIndex !== -1) {
      vehicle.reviews.splice(reviewIndex, 1);

      vehicle.numReviews = vehicle.reviews.length;

      if (vehicle.numReviews === 0) {
        vehicle.rating = 0;
      } else {
        const totalRating = vehicle.reviews.reduce(
          (acc, item) => item.rating + acc,
          0
        );
        vehicle.rating = totalRating / vehicle.reviews.length;
      }

      await vehicle.save();
      res.json({ message: "Review removed" });
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } else {
    res.status(404);
    throw new Error("Vehicle Not Found");
  }
});

module.exports = {
  getVehicle,
  getVehicles,
  deleteVehicle,
  createVehicle,
  updateVehicle,
  createVehicleReview,
  deleteVehicleReview,
};
