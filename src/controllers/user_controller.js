import { asyncMethodHandler } from "../utils/asyncMethodHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users_models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Some error occurred while generating access and refresh Tokens!!"
    );
  }
};

const registerUser = asyncMethodHandler(async (req, res) => {
  //1.Get the user details
  //2.Validate the details entered -- not empty etc. etc.
  //3.See if users already exists with that username or email,.. if yes then return error
  //4.Upload profile photo to local and cloudinary
  //5.Once successfully uploaded on cloudinary, then remove from the local server
  //6.Create and Insert the user object in the DB
  //7.verify that users details got stored in the DB
  //8.remove fields like password and refereshToken before sending the userDetails as response to the Client
  //9.Return the response

  const { fullName, userName, email, password, mobileNumber } = req.body;

  if (
    [fullName, userName, email, password, mobileNumber].some((key) => {
      return key?.trim() === "";
    })
  ) {
    throw new ApiError(
      400,
      "All fields are mandatory, you have missed to fill some of the required fields."
    );
  }

  const isUserExists = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (isUserExists) {
    throw new ApiError(
      400,
      "User with the provided email or username already exists"
    );
  }

  const userDetails = await User.create({
    fullName,
    userName,
    email,
    password,
    mobileNumber,
  });

  if (!userDetails) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user!!!"
    );
  }
  const createdUser = await User.findById(userDetails._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully!!!"));
});

const loginUser = asyncMethodHandler(async (req, res) => {
  //1.Extract the login details like userName/email/mobileNumber and password
  //2.Check the email/mobileNumber/userName whether they exists or not,... if not then, return error
  //3.verify the password with the hashed password from the DB
  //4.generate AccessToken and RefreshToken for the user
  //5.set the AccessToken and RefreshToken as the cookies
  //6.return the response

  const { userName, mobileNumber, email, password } = req.body;

  console.log(email);
  if (
    [userName, mobileNumber, email, password].some((key) => {
      return key?.trim() === "";
    })
  ) {
    throw new ApiError(
      400,
      "At least one of the fields are required out of userName, email and mobileNumber!!!"
    );
  }

  const userDetails = await User.findOne({
    $or: [{ userName }, { email }, { mobileNumber }],
  });

  if (!userDetails) {
    throw new ApiError(401, "Invalid user credentials!!!");
  }

  const isPasswordCorrect = await userDetails.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials!!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userDetails._id
  );

  const loggedInUser = await User.findById(userDetails._id).select(
    "-password -refreshToken -accessToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "Logged in successfully!!!"
      )
    );
});

const logoutuser = asyncMethodHandler(async (req, res) => {
  //1.fetching the current LoggedIn User details using the middleware verifyJWT (This middleware uses cookies or Authorization headers to extract the accessToken and then decodes it, and then based on the decoded data, executes a DB query to fetch the logged in Users details, and using this we get the access to logout the user by expiring the accessToken and refreshToken 's )
  //2.This middleware can we used in any other api to check the loggedIn users authoriztion access
  //3.Remove the refreshToken from the DB for the user (or reset it to undefined)
  //4.Remove the cookies from the client's browser
  //5.Return the response

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      refreshToken: undefined,
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!!!"));
});

const testingTokenExpiry = function(req,res){
    return res.status(200).json(new ApiResponse(200,{},"Successfully Tested the token expiry and resource access"));
}
export { registerUser, loginUser, logoutuser,testingTokenExpiry };
