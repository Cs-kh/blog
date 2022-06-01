const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const AuthRouter = require("./routes/AuthRouter");
const PostRouter = require("./routes/PostRouter");
var multer = require("multer");
const path = require("path");

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.json({ error: err });
    }

    res.json({ file: req.file });
  });
});
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/", AuthRouter);
app.use("/posts", PostRouter);
app.listen(5000, () => console.log("Server started on port 5000"));

mongoose
  .connect(
    "mongodb+srv://admin:admin12345@cluster0.cywff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
