const express = require("express");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const usersRouter = require("./src/routes/users.routes");
const authRouter = require("./src/routes/auth.routes");
const historyRouter = require("./src/routes/history.routes");
const notifiRouter = require("./src/routes/notifi.routes");
const { transfer } = require("./src/controllers/transaction.controller");
const authMiddleware = require("./src/middleware/auth.middleware");
const { connectDB } = require("./src/utils/index");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

app.use(cors());
app.options("*", cors());
app.use(morgan("tiny"));
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", authMiddleware, usersRouter);
app.use("/history", authMiddleware, historyRouter);
app.use("/notifi", notifiRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => res.status(200).send("Hahhahahah"));
io.on("connection", (socket) => {
  socket.on("create-user", (data) => {
    socket._id = data._id;
  });
  socket.on("transaction", (data) => {
    const { cardNumber, amount, message, fromUserId } = data;
    transfer(cardNumber, amount, message, fromUserId, socket, io);
  });
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

const URI =
  "mongodb+srv://kshuyz0055:kshuyz0055@cluster0.vnwhw.mongodb.net/bank";
// const URI = "mongodb://localhost:27017/bank";
connectDB(URI);
