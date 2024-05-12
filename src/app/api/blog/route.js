import { Post } from "@/lib/models"
import { connectToDb } from "@/lib/utils"
import { NextResponse } from "next/server"

export const GET = async (request) => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
  
      await connectToDb();
  
      if (userId) {
        const posts = await Post.find({ userId });
        return NextResponse.json(posts);
      } else {
        const posts = await Post.find();
        return NextResponse.json(posts);
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch Posts!");
    }
  };