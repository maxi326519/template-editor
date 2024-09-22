import { Request, Response } from "express";
import convertHtmlToWord from "./service/Word/createDoc";
import express from "express";
import morgan from "morgan";
import cors from "cors";

// Init express
const app = express();

// Server config
app.use(cors({ origin: true }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.post("/", async (req: Request, res: Response) => {
  try {
    const { doc } = req.body;

    convertHtmlToWord(doc);

    res.status(200).json({ message: "Doc creado" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Server start
app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
