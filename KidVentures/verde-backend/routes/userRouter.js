// Import the express module
const express = require("express");

// Import user controller functions
const {
  createUser, // Function to create a new user
  getUsers, // Function to get all users
  deleteUser, // Function to delete a specific user
  deleteUsers, // Function to delete all users
  getUser, // Function to get a specific user
  updateUser, // Function to update a specific user
  removeInterest, // Function to remove an interest from a user
  removeFollowing, // Function to remove a following from a user
  removeFollower, // Function to remove a follower from a user
  addFollower, // Function to add a follower to a user
} = require("../controller/userController");

// Create a new router object
const router = express.Router();

// User routes
router.post("/", createUser); // Route to create a new user
router.delete("/", deleteUsers); // Route to delete all users
router.put("/rmInterest/:id", removeInterest); // Route to remove an interest from a user by ID
router.put("/removeFollowing/:userId", removeFollowing); // Route to remove a following from a user by user ID
router.put("/removeFollower/:userId", removeFollower); // Route to remove a follower from a user by user ID
router.put("/addFollower/:userId", addFollower); // Route to add a follower to a user by user ID
router.put("/user/:id", updateUser); // Route to update a specific user by ID
router.delete("/:id", deleteUser); // Route to delete a specific user by ID
router.get("/", getUsers); // Route to get all users
router.get("/:id", getUser); // Route to get a specific user by ID


// Export the router object
module.exports = router;
