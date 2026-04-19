require('dotenv').config();
import express from "express";
import cors from "cors";


const app = express();
app.use(cors());

const PORT = process.env.HOST || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT} ` )
})
