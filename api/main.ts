import fs from "fs";
import express from "express";
import cors from "cors";
import { playByPlay } from "./play-by-play";
import compression from "compression";

const res = fs.readFileSync("./NAVIvsVitaGF-Nuke.txt");

const match = res.toString();

const app = express();

app.use(cors());
app.use(compression());

app.get("/play-by-play", (req, res) => {
  res.json(playByPlay(match));
});

app.listen(3333, () => {
  console.log("Server listening on localhost:3333");
});
