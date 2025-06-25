import express, { urlencoded } from "express";
import userRoutes from "./routes/userRoutes.js"; 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
