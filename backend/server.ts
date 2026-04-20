require('dotenv').config();
import express from "express";
import cors from "cors";
import animeRoutes from "./Routes/Anime";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/mikesenpai', animeRoutes);

const PORT = process.env.HOST || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT} ` )
})
