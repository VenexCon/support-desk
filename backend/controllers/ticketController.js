const asyncHandler = require("express-async-handler");
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");

//@desc   Get User tickets
//@route  GET /api/tickets
//@access Private
const getTickets = asyncHandler(async (req, res) => {
  // Get user using id in JWT
  /*  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  } */

  const tickets = await Ticket.find({ user: req.user.id });
  res.status(200).json(tickets);
});

//@desc   Get User ticket
//@route  GET /api/tickets/:id
//@access Private
const getTicket = asyncHandler(async (req, res) => {
  // Get user using id in JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  //obtain ticket by params
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  //verify that the user is the creator of the ticket
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized.");
  }

  res.status(200).json(ticket);
});

//@desc   Create a new Ticket
//@route  POST /api/tickets
//@access Private
const createTicket = asyncHandler(async (req, res) => {
  //What will be set by the user, and what will the BE set.
  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    throw new Error("Please add a product and a description");
  }

  // Get user using id in JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id, //obtained from the authMiddleware func
    status: "new",
  });

  res.status(201).json(ticket);
});

//@desc   delete ticket
//@route  DELETE /api/tickets/:id
//@access Private
const deleteTicket = asyncHandler(async (req, res) => {
  // Get user using id in JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  //obtain ticket by params
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  //verify that the user is the creator of the ticket
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized.");
  }

  await ticket.remove();

  res.status(200).json({ success: true });
});

//@desc   Update User ticket
//@route  PUT /api/tickets/:id
//@access Private
const updateTicket = asyncHandler(async (req, res) => {
  // Get user using id in JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  //obtain ticket by params
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  //verify that the user is the creator of the ticket
  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized.");
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTicket);
});

module.exports = {
  getTicket,
  getTickets,
  createTicket,
  deleteTicket,
  updateTicket,
};
