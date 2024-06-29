import { Post } from "@/lib/models"
import { connectToDb } from "@/lib/utils"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

export const GET = async (request) => {
  try {
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
    console.error(error);
    return NextResponse.error(new Error("Failed to fetch Posts!"));
  }
};