/*
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const submissionRoutes = require("./routes/submissionRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB:", err);
});

app.use("/submissions", submissionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

require ("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
//const bodyParser = require("body-parser");
//const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require('./utils/db');
const submissionRoutes = require("./routes/submissionRoutes");
app.use(express.json());
app.use(cors());
app.use("/submissions", submissionRoutes);
const PORT = 5000;
connectDB().then(()=>{
  app.listen(PORT,()=>{
    console.log(`port running at ${PORT}`);
  })
})
  