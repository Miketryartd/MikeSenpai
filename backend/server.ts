import dotenv from "dotenv";
dotenv.config({path: "./Config/.env"});
import express from "express";
import cors from "cors";
import userRoutes from "./Routes/UserRoute.js";
import animeRoutes from "./Routes/Anime.js";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/mikesenpai', animeRoutes);
app.use('/mikenichan', userRoutes);

const PORT = process.env.HOST || 3000;


mongoose.connect(process.env.MONGOOSE_SECRET_PRIV_KEY as string)
  .then(() => console.log('Connected!'));

app.listen(PORT, () => {
    console.log(`Server running on ${PORT} ` )
})
