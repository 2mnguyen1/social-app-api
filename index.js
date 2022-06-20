const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const multer = require("multer");
const path = require("path");


dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
  console.log("Conntected to MongoDB");
});


app.use('/images', express.static(path.join(__dirname, "public/images")))

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("file upload successfully");
  } catch (e) {
    console.log(e);
  }
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8800, () => {
  console.log("8800 PORT");
});
