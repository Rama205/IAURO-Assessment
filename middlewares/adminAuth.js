const adminAuth = (req, res, next) => {
  const { is_admin } = req.user;
  if (!is_admin) {
    return res
      .status(403)
      .json({
        message: "Access denied. Admins only have access to this operation.",
      });
  }
  next();
};

const nonAdminAuth = (req, res, next) => {
  const { is_admin } = req.user;

  if (is_admin) {
    return res
      .status(403)
      .json({
        message:
          "Access denied.Admin dont have access to ceate the products, Only non-admin users can insert the products.",
      });
  }
  next();
};

module.exports = { adminAuth, nonAdminAuth };
