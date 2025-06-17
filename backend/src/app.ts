
import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/pageRoutes";
import dbConnect from "./config/config";
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
dotenv.config();
console.log(process.env.SECRET_KEY);
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true 
}));
app.use(cookieParser());
dbConnect();

app.use("/api/v1",router);

app.listen(5000,()=>{
  console.log("Server is runing")
})