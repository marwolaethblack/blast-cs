import fs from "fs";
import express from "express";
import cors from "cors";
import { playByPlay } from "./play-by-play";
import compression from "compression";

const port = process.env.PORT || 10000;

const res = fs.readFileSync("./NAVIvsVitaGF-Nuke.txt");

const match = res.toString();

const app = express();

app.use(cors());
app.use(compression());
app.use(express.static("public"));

app.get("/play-by-play", (req, res) => {
  res.json(playByPlay(match));
});

app.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
