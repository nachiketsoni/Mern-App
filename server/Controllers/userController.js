const ErrorHandler = require("../Utils/errorHandler.js");
const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../Models/userModel");
const sendToken = require("../Utils/jwtToken");
const sendEmail = require("../Utils/sendEmail.js");
const crypto = require("crypto");
const { isAuthenticatedUser } = require("../Middleware/auth.js");
// Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = new User({
        name,   
        email,
        password,
        avatar: {
            public_id: "avatars/1",
            url: "https://res.cloudinary.com/dxqjyqz8p/image/upload/v1620000000/avatars/1.png",
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
    const { name, email } = req.body;
    const newUserData = {
        name,
        email
    }
    // Update avatar: TODO
    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
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
