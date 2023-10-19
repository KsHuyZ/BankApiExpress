const express = require("express");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const app = express();

const usersRouter = require("./src/routes/users.routes");
const { connectDB } = require("./src/utils/index");

app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", usersRouter);
app.get("/", (req, res) => res.status(200).send("Hahhahahah"));
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

const URI = "mongodb+srv://kshuyz0055:kshuyz0055@cluster0.vnwhw.mongodb.net/bank";
// const URI = "mongodb://localhost:27017/bank";
connectDB(URI);
