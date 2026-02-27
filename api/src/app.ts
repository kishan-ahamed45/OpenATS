import express,{type Express} from "express";
import userRoutes from "./routes/user.routes";

const app: Express = express();
app.use(express.json());
app.use("/api", userRoutes);

export default app;

