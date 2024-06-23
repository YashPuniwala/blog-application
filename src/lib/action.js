"use server";

import { revalidatePath } from "next/cache";
import { Post, User } from "./models";
import { connectToDb } from "./utils";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "./auth";
import crypto from "crypto";
import { NextResponse } from "next/server";
import sendEmail from "./sendEmail";

export const handleGithubLogin = async () => {
  "use server";
  await signIn("github");
};

export const handleLogout = async () => {
  "use server";
  await signOut();
};

export const addPost = async (formData) => {
  const { title, desc, slug, userId } = Object.fromEntries(formData);
  const images = formData
    .getAll("images")
    .flatMap((entry) => (typeof entry === "string" ? JSON.parse(entry) : []));

  try {
    connectToDb();
    const newPost = new Post({
      title,
      desc,
      slug,
      userId,
      images,
    });
    await newPost.save();
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const addUser = async (formData) => {
  const { username, email, password, confirmPassword, isAdmin } =
    Object.fromEntries(formData);
  const images = formData
    .getAll("images")
    .flatMap((entry) => (typeof entry === "string" ? JSON.parse(entry) : []));

  try {
    connectToDb();

    if (confirmPassword !== password) {
      return { error: "Password do not match!" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      images,
      isAdmin: isAdmin === "true", // Convert the string value to a boolean
    });
    await newUser.save();
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDb();

    await Post.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const deletePost = async (formData) => {
  const { id } = Object.fromEntries(formData);
  console.log(formData);
  try {
    connectToDb();

    await Post.findByIdAndDelete(id);
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const register = async (previousState, formData) => {
  const { username, email, password, confirmPassword, img } =
    Object.fromEntries(formData);

  try {
    connectToDb();

    const user = await User.findOne({ username });

    if (user) {
      return { error: "Username already exists" };
    }

    if (confirmPassword !== password) {
      return { error: "Password do not match" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      confirmPassword,
      img,
    });

    await newUser.save();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create User!" };
  }
};

export const login = async (previousState, formData) => {
  const { username, password } = Object.fromEntries(formData);
  try {
    connectToDb();
    await signIn("credentials", {
      username,
      password,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("CredentialsSignin")) {
      return { error: "Invalid Username or Password" };
    }
    throw error;
  }
};

export const forgotPassword = async (previousState, formData) => {
  const { email } = Object.fromEntries(formData);

  try {
    await connectToDb();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return { error: "Email doesn't exist" };
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordTokenExpires = new Date(Date.now() + 3600000); // Expires in 1 hour

    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordTokenExpires; // Ensure this is a Date object
    await existingUser.save(); // Save the updated user document

    const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;

    console.log(resetUrl, "resetUrl");

    const body = `Your Password reset token is temporary:\n\n${resetUrl}\n\nIf you have not requested this email then please ignore it.`;

    await sendEmail({
      email: email,
      subject: "Authentication Mern Password Recovery",
      body,
    });

    return { message: "Password reset link has been sent to your email." };
  } catch (error) {
    console.log(error);
    if (error.message.includes("CredentialsSignin")) {
      return { error: "Invalid Username or Password" };
    }
    throw error;
  }
};


export const resetPassword = async(previousState, formData) => {
    const {token, password, confirmPassword} = Object.fromEntries(formData)

    if(!password || !confirmPassword) {
      return { error: "Please add Password" };
    }

    if(password !== confirmPassword) {
      return {error: "Password does not match"}
    }

    const resetToken = crypto.createHash("sha256").update(token).digest("hex")

    try {
      await connectToDb()

      const user = await User.findOne({
        resetToken,
        resetTokenExpiry: {$gt: Date.now()}
      })

      if(!user) {
        return {error: "Reset password token is invalid or has expired"}
      }

      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;

      await user.save()

      return { message: "Password reset successfully" };

    } catch (error) {
      console.log(error);
      if (error.message.includes("CredentialsSignin")) {
        return { error: "Invalid Username or Password" };
      }
      throw error;
    }
}