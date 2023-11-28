const Order = require("../models/orderModel");
const Vehicle = require("../models/vehicleModel");

// Create order
const createOrder = async (req, res) => {
  const {
    vehicle,
    user,
    pickupLocation,
    pickupDate,
    dropoffDate,
    creditCardNumber,
    nameOnCard,
    cvv,
    price,
  } = req.body;

  try {
    const vehicleExists = await Vehicle.findById(vehicle);

    if (!vehicleExists) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    const order = await Order.create({
      vehicle,
      user,
      pickupLocation,
      pickupDate,
      dropoffDate,
      creditCardNumber,
      nameOnCard,
      cvv,
      price,
    });

    await Vehicle.findByIdAndUpdate(vehicle, { isAvailable: true });

    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get orders for a user
const getOrder = async (req, res) => {
  try {
    const userId = req.headers.userid; // Assuming you pass the userId in the request headers

    const orders = await Order.find({ user: userId }).populate("vehicle");

    if (orders.length > 0) {
      const orderList = [];

      for (let order of orders) {
        const vehicleInfo = await Vehicle.findById(order.vehicle._id);

        if (vehicleInfo) {
          const orderWithVehicleInfo = {
            ...order._doc,
            vehicle: vehicleInfo,
          };

          orderList.push(orderWithVehicleInfo);
        }
      }

      res.json(orderList);
    } else {
      res.status(404).json({ error: "You do not have any bookings" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "user",
        select: "id name", // Specify the fields to include from the user document
      })
      .populate("vehicle");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.bookingStatus = true;
      const updatedOrder = await order.save();

      // Get the vehicle associated with the order
      const vehicle = await Vehicle.findById(order.vehicle);

      if (vehicle) {
        const { pickupDate, dropoffDate } = order;

        // Store the range of pickup dates and drop-off dates in the bookedDates array
        vehicle.bookedDates.push({
          startDate: pickupDate,
          endDate: dropoffDate,
        });
        await vehicle.save();
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const removeOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (order) {
      // Get the vehicle associated with the order
      const vehicle = await Vehicle.findById(order.vehicle);

      if (vehicle) {
        const { pickupDate, dropoffDate } = order;

        // Remove the range of pickup dates and drop-off dates from the bookedDates array
        vehicle.bookedDates = vehicle.bookedDates.filter((bookedDate) => {
          const { startDate, endDate } = bookedDate;

          return !(
            startDate.getTime() === pickupDate.getTime() &&
            endDate.getTime() === dropoffDate.getTime()
          );
        });

        await vehicle.save();
      }

      res.json({ message: "Order removed successfully" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getOrder, getOrders, updateOrder, removeOrder };
