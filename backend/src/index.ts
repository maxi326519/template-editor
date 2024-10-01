import { Request, Response } from "express";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import creatPDF from "./service/Word/createPDF";

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

    // const buffer = await convertHtmlToWord(doc);
    await creatPDF(doc, res);

    // res.status(200).send(buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Server start
app.listen(3002, () => {
  console.log("Server listening on port 3002");
});
