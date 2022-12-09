const ErrorHandler = require("../Utils/errorHandler.js");
const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../Models/userModel");
const sendToken = require("../Utils/jwtToken");
const sendEmail = require("../Utils/sendEmail.js");
const crypto = require("crypto");
const formidable = require("formidable");
const cloudinary = require("cloudinary");
const { isAuthenticatedUser } = require("../Middleware/auth.js");
// Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const defaultIMG =
    "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg?w=740&t=st=1665479565~exp=1665480165~hmac=a506127a19be062f341ab4d2e9767e3a1593d6e20efd3762ebfcb19cc39e49d1  ";
 
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
    defaultIMG,
    {
      folder: `Myntra/${email}`,
      fetch_format: "webp",
      quality: "50",
    }
  );
    const user = new User({
        name,   
        email,
        password,
        avatar: {
            public_id: public_id,
            url: secure_url,
        },
        
    }) 
    await user.save();
    sendToken(user, 201, res);


})
exports.isLoggedIn = catchAsyncError(async (req, res, next) => {

    if(isAuthenticatedUser){
        res.status(200).json({
            success: true,
            user: req.user
        })
    }else{
        res.status(401).json({
            success: false,
            message: "Please login to access this resource"
    })
}
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // Check if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
    }
    // Finding user in database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    // Check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    sendToken(user, 200, res);
})

exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out",
    });
})

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Eccomerce Password Recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500)); 
    }

})

exports.resetPassword = catchAsyncError(async (req, res, next) => {


    //   Hash and set to resetPasswordToken field
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }
    // Setup new password

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);


})

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user,
        
    });
})

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    try {
        const form = formidable();
    
        form.parse(req, async (err, fields, files) => {
          if (err) throw err;
          console.log(fields, files);
          if (!fields) {
            return next(new ErrorHandler("Please Enter Name & Email", 400));
          }
          var updateUser = {
            ...fields,
          };
    
          if (files.avatar.size > 0 && files.avatar.mimetype.includes("image")) {
            var user = await User.findById(req.user._id).exec();
            var imageId = user.avatar.public_id;
            try {
              await cloudinary.v2.uploader.destroy(imageId);
              var { public_id, secure_url } = await cloudinary.v2.uploader.upload(
                files.avatar.filepath,
                {
                  folder: `myntra/${user.email}`,
                  fetch_format: "webp",
                  quality: "50",
                }
              );
            } catch (error) {
              console.log(error);
            }
    
            updateUser.avatar = {
              public_id: public_id,
              url: secure_url,
            };
          } else {
            console.log("no image");
            // res.error(new ErrorHandler("Please Enter a Valid Image File", 400));
          }
    
          await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateUser },
            { new: true }
          );
          res.status(200).json({success: true});
        });
      } catch (err) {
        console.log(err);
        res.error(new ErrorHandler("Error Uploading Data", 500));
      }
    })
        
        exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    if(!users) {
        return next(new ErrorHandler("No user found", 404));
    }
    res.status(200).json({
        success: true,
        users,
    });

})

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const users = await User.findById(req.params.id);
    if(!users) {
        return next(new ErrorHandler("No user found", 404));
    }
    res.status(200).json({
        success: true,
        users,
        message: "User found successfully",
    });
})

exports.changeRole = catchAsyncError(async (req, res, next) => {
    const  {email,name,role} = req.body;
    const newUserData = {
        name,
        email,
        role,
    }
    // Update avatar: TODO
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        user,
        message: "Role updated successfully"
    });
})
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    // Update avatar: TODO
    if(!user) {
        return next(new ErrorHandler("No user found", 404));
    }
    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
})
