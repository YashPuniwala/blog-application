import { Post } from "@/lib/models"
import { connectToDb } from "@/lib/utils"
import { NextResponse } from "next/server"

export const GET = async (request) => {
  try {
    // Mark the route as dynamic to avoid static rendering issues
    request.dynamic = 'force-dynamic';

    // Parse the userId query parameter directly from the request object
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await connectToDb();

    let posts;
    if (userId) {
      posts = await Post.find({ userId });
    } else {
      posts = await Post.find();
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return NextResponse.error(new Error("Failed to fetch Posts!"));
  }
};