const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, searchText = "" } = req.query;

    const skip = (page - 1) * pageSize;

    const searchQuery = {
      is_admin: false,
      isDeleted: 0,
      status: 1,
      ...(searchText && {
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          { email: { $regex: searchText, $options: "i" } },
          { mobile: { $regex: searchText, $options: "i" } },
        ],
      }),
    };

    const users = await userModel
      .find(searchQuery, "name mobile email _id isDeleted")
      .skip(skip)
      .limit(Number(pageSize));

    const totalUsers = await userModel.countDocuments(searchQuery);

    res.status(200).json({
      message: "List of all the users",
      users: users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / pageSize),
      totalUsers: totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "No user found" });

    if (user.isDeleted === 1) {
      return res
        .status(404)
        .json({ message: "No active user found under this ID" });
    }

    if (user.is_admin) {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }

    const result = await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          isDeleted: 1,
          status: 0,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res
        .status(500)
        .json({ message: "Unexpected error during soft delete" });
    }

    res.status(200).json({ message: "User soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findOne({
      _id: userId,
      isDeleted: 0,
      status: 1,
    });
    if (!user)
      return res
        .status(404)
        .json({ message: "No active user found to update" });

    if (user.is_admin)
      return res.status(403).json({ message: "Cannot update admin user" });

    const result = await userModel.updateOne(
      { _id: userId },
      { $set: req.body }
    );

    if (result.matchedCount === 0)
      return res
        .status(404)
        .json({ message: "No active user found to update" });
    if (result.modifiedCount === 0)
      return res.status(400).json({ message: "No changes were made" });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const updateProductVisibility = async (req, res) => {
  try {
    const { productId } = req.params;
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({ message: "Invalid visibility status" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: { isVisible } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product visibility updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating product visibility:", error);
    res
      .status(500)
      .json({
        message: "Error updating product visibility",
        error: error.message,
      });
  }
};

const softDeleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await productModel.updateOne(
      { _id: productId, isDeleted: 0 },
      { $set: { isDeleted: 1, status: 0 } }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "No active product found to soft delete" });
    }
    if (result.modifiedCount === 0) {
      return res
        .status(400)
        .json({ message: "Product is already soft deleted" });
    }

    res.status(200).json({ message: "Product soft deleted successfully" });
  } catch (error) {
    console.error("Error soft deleting product:", error);
    res
      .status(500)
      .json({ message: "Error soft deleting product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await productModel.findOne({
      _id: productId,
      isDeleted: 0,
      status: 1,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "No active product found to update" });
    }

    const result = await productModel.updateOne(
      { _id: productId },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "No active product found to update" });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes were made" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Update product error:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUser,
  updateProductVisibility,
  softDeleteProduct,
  updateProduct,
};
