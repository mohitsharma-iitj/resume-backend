const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const resultRoutes = require("./routes/resultRoutes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", resultRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
