import { User, Address } from "../../../DB/models/index.js";
import { ErrorClass } from "../../utils/index.js";
import { sendEmailService } from "../../Services/send-email.service.js";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response {message,userInstance }
 * @description sign up
 */
export const signUp = async (req, res, next) => {
  const {
    userName,
    email,
    password,
    userType,
    gender,
    phone,
    age,
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
  } = req.body;
  const isEmailExist = await User.findOne({ email, phone });
  if (isEmailExist) {
    return next(
      new ErrorClass("Email already exists", 400, "Email already exists")
    );
  }
  //generate otp code
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const userInstance = new User({
    userName,
    email,
    userType,
    gender,
    phone,
    age,
    password,
    otp,
  });
  //generate token instead of sending _id
  const confirmationToken = jwt.sign(
    { user: userInstance },
    process.env.CONFIRM_TOKEN,
    { expiresIn: "1d" }
  );
  // generate email confirmation link
  const confirmationLink = `${req.protocol}://${req.headers.host}/users/confirmation/${confirmationToken}`;
  //sending email
  const isEmailSent = await sendEmailService({
    to: email,
    subject: "welcome",
    htmlMessage: `<a href=${confirmationLink}>please verify your account</a>`,
  });
  if (isEmailSent.rejected.length) {
    return res
      .status(500)
      .json({ msg: "verification email sending is failed " });
  }
  // address
  const addressInstance = new Address({
    userId: userInstance._id,
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
    isDefault: true,
  });

  await userInstance.save();
  addressInstance.save();
  res.status(201).json({ msg: "user created ", userInstance, addressInstance });
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response {message, confirmed user}
 * @description verify email
 */
export const verifyEmail = async (req, res, next) => {
  const { confirmationToken } = req.params;
  const data = jwt.verify(confirmationToken, process.env.CONFIRM_TOKEN);
  // updating isConfirmed to true
  const confirmedAuthor = await User.findOneAndUpdate(
    { _id: data?.user._id, isEmailVerified: false },
    { isEmailVerified: true },
    { new: true }
  );
  if (!confirmedAuthor) {
    return res.status(404).json({ msg: "not confirmed" });
  }
  res
    .status(200)
    .json({ msg: "User email successfully confirmed ", confirmedAuthor });
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response {message, token}
 * @description login user
 */

export const login = async (req, res, next) => {
  // destruct email and password from req.body
  const { email, password } = req.body;
  // find user
  const user = await User.findOne({
    $and: [{ email }, { isEmailVerified: true }, { isMarkedAsDeleted: false }],
  });
  if (!user) {
    return next(
      new ErrorClass("Invalid credentials", 400, "Invalid credentials")
    );
  }

  // compare password
  const isMatch = compareSync(password, user.password);
  if (!isMatch) {
    return next(
      new ErrorClass("Invalid credentials", 400, "Invalid credentials")
    );
  }

  // generate the access token
  const token = jwt.sign({ userId: user._id }, process.env.LOGIN_SECRET, {
    expiresIn: "1d",
  });

  // response
  res.status(200).json({ message: "Login success", token });
};

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response {message, user}
 * @description update user
 */
export const updateUser = async (req, res, next) => {
  const { authUser } = req;
  const { email, userName, userType, gender, phone, age } = req.body;

  if (email) {
    const isEmailAndPhoneExist = await User.findOne({ email });
    if (isEmailAndPhoneExist) {
      return next(
        new ErrorClass("Email already exists", 400, "Email already exists")
      );
    }
    const userByEmail = await User.findByIdAndUpdate(
      authUser._id,
      {
        isEmailVerified: false,
      },
      { new: true }
    );
    //generate token instead of sending _id
    const confirmationToken = jwt.sign(
      { user: userByEmail },
      process.env.CONFIRM_TOKEN,
      { expiresIn: "1h" }
    );
    // generate email confirmation link
    const confirmationLink = `${req.protocol}://${req.headers.host}/users/confirmation/${confirmationToken}`;
    //sending email
    const isEmailSent = await sendEmailService({
      to: email,
      subject: "welcome",
      htmlMessage: `<a href=${confirmationLink}>please verify your account</a>`,
    });
    if (isEmailSent.rejected.length) {
      return res
        .status(500)
        .json({ msg: "verification email sending is failed " });
    }
  }
  //find user and update
  const user = await User.findByIdAndUpdate(
    authUser._id,
    {
      email,
      userName,
      userType,
      gender,
      phone,
      age,
    },
    { new: true }
  );
  // update username field
  //   await user.save();
  res.status(200).json({ msg: "user updated ", user });
};

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response { user}
 * @description get user information
 */
export const getInfo = async (req, res, next) => {
  const { authUser } = req;
  // return user information except password and _id
  const user = await User.findById(authUser._id).select("-password -_id");
  res.status(200).json({ user });
};

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response { user}
 * @description get user information by id
 */
export const getById = async (req, res, next) => {
  const { _id } = req.params;
  //get user by id
  const user = await User.findById(_id).select("-password -_id");
  // user not found
  if (!user) {
    return next(
      new ErrorClass(
        "there is no matched users",
        400,
        "there is no matched users"
      )
    );
  }

  res.status(200).json({ user });
};

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response {message}
 * @description forget password
 */
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const isUserExists = await User.findOne({
    $and: [{ email }, { isEmailVerified: true }, { isMarkedAsDeleted: false }],
  });
  if (!isUserExists) {
    return next(
      new ErrorClass("email doesn't exist", 400, "email doesn't exist")
    );
  }
  //sending email
  const isEmailSent = await sendEmailService({
    to: email,
    subject: "welcome",
    htmlMessage: `<h1>your otp numbers for reseting the password are : ${isUserExists.otp}</h1>`,
  });
  if (isEmailSent.rejected.length) {
    return res
      .status(500)
      .json({ msg: "verification email sending is failed " });
  }
  res.json({ msg: "check your email" });
};

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response {message , savedUser}
 * @description change password
 */
export const changePassword = async (req, res, next) => {
  const { email, password, otp } = req.body;
  const user = await User.findOne({
    $and: [{ email }, { isEmailVerified: true }, { isMarkedAsDeleted: false }],
  });
  if (!user) {
    return next(
      new ErrorClass("email doesn't exist", 400, "email doesn't exist")
    );
  }

  if (user?.otp != otp) {
    return next(new ErrorClass("otp is wrong", 400, "otp is wrong"));
  }
  // generating new otp and store the new one in the DB
  const newOTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  user.password = password;
  user.otp = newOTP;
  const savedUser = await user.save();
  res.json({ msg: "password changed", savedUser });
};

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns return response {message, user}
 * @description update user
 */
export const deleteUser = async (req, res, next) => {
  const { authUser } = req;
  const user = await User.findByIdAndUpdate(
    authUser._id,
    { isMarkedAsDeleted: true },
    { new: true }
  );
  res.status(200).json({ msg: "user deleted", user });
};
