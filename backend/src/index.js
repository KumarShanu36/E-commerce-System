import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import userRoutes from "./routes/user.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/settings", settingsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
