const productModel = require("../models/productModel");

const getVisibleProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, searchText = "" } = req.query;
    const skip = (page - 1) * pageSize;
    const limit = parseInt(pageSize);
    let products;
    let searchQuery = {
      isVisible: true,
      isDeleted: 0,
      status: 1,
      ...(searchText && {
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          { category: { $regex: searchText, $options: "i" } },
        ],
      }),
    };

    if (!req.user.is_admin) {
      searchQuery.createdBy = req.user.id;
    }

    products = await productModel
      .find(searchQuery, "name description price quantity category createdBy")
      .skip(skip)
      .limit(limit);

    const totalProducts = await productModel.countDocuments(searchQuery);

    res.status(200).json({
      message: "All Products Listed successfully",
      currentPage: page,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

module.exports = { getVisibleProducts };
