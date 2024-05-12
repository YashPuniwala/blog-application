import { Post, User } from "./models";
import { connectToDb } from "./utils";

export const getUserPosts = async (userId) => {
  try {
    await connectToDb();
    const posts = await Post.find({ userId });
    return posts;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch User's Posts!");
  }
};

export const getPosts = async() => {
  try {
    await connectToDb()
    const posts = await Post.find()
    return posts;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch Posts!");
  }
};

export const getPost = async (slug) => {
  try {
    const post = await Post.findOne({ slug });
    return post;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch Posts!");
  }
};

export const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch Users!");
  }
};
export const getUser = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch User!");
  }
};