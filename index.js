const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());

require("./config/db");

app.use(express.json());

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute");

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/product", productRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
