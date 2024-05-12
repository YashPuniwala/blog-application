"use server";

import { revalidatePath } from "next/cache";
import { Post, User } from "./models";
import { connectToDb } from "./utils";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "./auth";

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
