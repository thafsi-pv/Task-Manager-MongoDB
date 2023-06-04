const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();
const todoRoute = require("./routes/todo");

const app = express();
app.use(cors());
app.use(express.json());
connectDb();

app.use("/api/todos", todoRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server started at " + PORT));

