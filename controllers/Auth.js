const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

//signUp router handler

exports.signup = async (req, res) => {
  try {
    //get data
    const { name, email, password, role } = req.body;
    //check user already exist

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User alreadt Exist",
      });
    }
    //secure password
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        succes: false,
        message: "Error hasing Passwoprd",
      });
    }

    //create entery for user

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User Create Succcessfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "User cannot be register ",
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    //data fetch

    const { email, password } = req.body;

    //validation  on email and password

    if (!email || !password) {
      return res.send(400).json({
        success: false,
        message: "please fill all the details carefully",
      });
    }
    //che4c user register user

    const user = await User.findOne({ email });
    // if not a register user

    if (!user) {
      return (
        res.send(401),
        json({
          succes: false,
          message: "User is not register",
        })
      );
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    //verify password & generate a JWT token
    if (await bcrypt.compare(password, user.password)) {
      //pasword match

      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expireIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const options = {
        expireIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, option).status(200).json({
        succes: true,
        token,
        user,
        message: "USer Logged in sucessfully",
      });
    } else {
      return res.send(403).json({
        succes: false,
        message: "Password Incoorect ",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(500).json({
      succes: false,
      message: "login Failure",
    });
  }
};
