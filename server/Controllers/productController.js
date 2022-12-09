const ErrorHandler = require("../Utils/errorHandler.js");
const catchAsyncError = require("../Middleware/catchAsyncError");
const Product = require("../models/productModel");
const ApiFeatures = require("../Utils/apiFeatures");
const cloudinary = require("cloudinary");
const formidable = require("formidable");

// Create Product ---ADMIN
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const form = formidable();
    
  form.parse(req, async (err, fields, files) => {
    
    req.body.user = req.user.id;
    var { public_id, secure_url } = await cloudinary.v2.uploader.upload(
      files.image.filepath,
      {
        folder: `Myntra/${user.email}`,
        fetch_format: "webp",
        quality: "50",
      }
    );
    const product = new Product({...fields, images:{url:secure_url,public_id} });
    await product.save();
    res.status(200).json({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  })
});

// Get All Products
exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 4;
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const product = await apiFeatures.query;

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
    productCount,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Get Update Products ---ADMIN
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",

    product,
  });
});

// Get delete Products ---ADMIN
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Removed Successfully",
    product,
  });
});

// Create new review or Update the Review ---USER
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get Product Review ---USER
exports.getProductReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({ 
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteProductReview    = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product || !req.query.productId || !req.query.id ) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
