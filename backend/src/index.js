import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import postRoutes from "./routes/post.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ FIXED: CORS (Vercel + Localhost allowed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://social-media-orpin-five.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ FIXED: cookie parser (auth cookies ke liye)
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);

// ❌ REMOVE: Render backend ke liye frontend static serve mat karo
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.join(__dirname, "../frontend", "dist", "index.html")
//     );
//   });
// }

// Start server AFTER DB connection
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (error) {
    console.error("Server start failed ❌", error.message);
  }
};

startServer();
