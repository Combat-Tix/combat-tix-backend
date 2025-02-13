const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({});

module.exports = mongoose.model("Ticket", TicketSchema);
