const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel");

const sinupUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existingActiveUser = await userModel.findOne({ email, isDeleted: 0 });

    if (existingActiveUser) {
      return res.status(409).json({
        message: "User already exists in the database, you can login",
        success: false,
      });
    }
    const existingInactiveUser = await userModel.findOne({ email, isDeleted: 1 });
    
    if (existingInactiveUser) {
      if (existingInactiveUser.is_admin) {
        return res.status(403).json({
          message: "This user is an inactive admin and cannot be reactivated.",
          success: false,
        });
      }

      return res.status(403).json({
        message: "This user is currently inactive. Contact admin to reactivate the account.",
        success: false,
      });
    }
    const adminExists = await userModel.findOne({ is_admin: true });

    const newUser = new userModel({
      name,
      email,
      password,
      mobile,
      is_admin: adminExists ? false : true,
      isDeleted: 0,
      status: 1,
    });
    newUser.password = await bcrypt.hash(password, 10);
    const userData = await newUser.save();

    if (userData) {
      res.status(201).json({
        message: `Signup successful! ${
          adminExists ? "User" : "Admin"
        } account created.`,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "Error occurred while signing up. Please try again.",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error,
      success: false,
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const errMsg = "Authentocation failed,Email or password is incorrect";
    if (!user) {
      return res.status(403).json({
        message: errMsg,
        success: false,
      });
    }
    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      return res.status(403).json({
        message: errMsg,
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, id: user._id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      err,
      success: false,
    });
  }
};

const insertProducts = async (req, res) => {
  try {
    console.log("---", req.user.id);
    const { name, description, price, quantity, category } = req.body;

    const existingProduct = await productModel.findOne({
      name,
      description,
      price,
      category,
      isDeleted: 0,
      status: 1,
      createdBy: req.user.id
    });
    
    if (
      existingProduct &&
      existingProduct?.createdBy?.toString() === req.user.id
    ) {
      console.log("Existing Product Found:", existingProduct);

      existingProduct.quantity += quantity;
      await existingProduct.save();

      return res.status(200).json({
        message: "Product quantity updated successfully",
        product: existingProduct,
      });
    } else {
      const product = new productModel({
        name,
        description,
        price,
        quantity,
        category,
        isVisible: true,
        isDeleted: 0,
        status: 1,
        createdBy: req.user.id,
      });

      await product.save();

      res.status(201).json({
        message: "Product added successfully",
        product,
      });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};

module.exports = {
  sinupUser,
  signIn,
  insertProducts,
};
