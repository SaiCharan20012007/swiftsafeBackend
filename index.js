const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require("cors");
app.use(cors());

/*=================================
        Database
===================================*/
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://charan:OuhEAmLZF9PHucda@cluster0.yy5kua3.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.set("strictQuery", false);
/************schema*********** */
const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  phoneNumber: String,
  address: String,
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
const UserModel = new mongoose.model("UserModel", userSchema);

/*=================================
        get and post
===================================*/
app.get("/", (req, res) => {
  res.send("App is Runing");
});
app.post("/register", (req, res) => {
  console.log(req.body);
  const { username, email, password, phonenumber, address } = req.body;
  UserModel.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "This email id already Register" });
    } else {
      const user = new UserModel({
        username,
        email,
        password,
        phonenumber,
        address,
      });
      user.save();
      res.send({ message: "Successfully Register" });
    }
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  UserModel.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password == user.password) {
        res.send({ message: "Login SuccessFull", user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "This email id is not register" });
    }
  });
});

/*============================
        listen
=============================*/
app.listen(8000, () => {
  console.log("Server is runing at port 8080");
});

app.post("/add-to-cart", (req, res) => {
  const userId = req.user._id;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  User.updateOne({ _id: userId }, { $push: { cart: { productId, quantity } } })
    .exec()
    .then((result) => {
      res.send({ message: "Product added to cart" });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
});

module.exports = app;
