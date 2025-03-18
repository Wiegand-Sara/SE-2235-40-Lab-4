import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/employees", employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
