import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import authRoutes from "./routes/auth.js";

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/tradersedge";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });

export default app;
