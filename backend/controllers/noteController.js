const asyncHandler = require("express-async-handler");
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");
const Note = require("../models/noteModel");

//@desc   Get notes for a ticket
//@route  GET /api/tickets/:ticketId/notes
//@access Private
const getNotes = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId);

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const notes = await Note.find({ ticket: req.params.ticketId });

  res.status(200).json(notes);
});

//@desc   Create notes for a ticket
//@route  POST /api/tickets/:ticketId/notes
//@access Private
const addNote = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId);

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const note = await Note.create({
    text: req.body.text,
    isStaff: false,
    user: req.user.id,
    ticket: req.params.ticketId,
  });

  res.status(200).json(note);
});

module.exports = { getNotes, addNote };
