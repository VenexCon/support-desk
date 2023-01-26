//imports
const express = require("express"); //commonjs module JS syntax
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const colors = require("colors");

//connect to database
connectDB();

const app = express();

//allows receipt of data and handling of URLencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the support desk API" });
});

//Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Port ${port}`);
});
