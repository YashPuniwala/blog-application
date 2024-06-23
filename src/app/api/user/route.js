import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";
import crypto from "crypto"

export const GET = async () => {
  try {
    connectToDb();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch users!");
  }
};

export const POST = async (request) => {
  try {
    const { token } = await request.json();

    await connectToDb();
    const hashedPassword = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetToken: hashedPassword,
      resetTokenExpiry: { $gt: Date.now() },
    });
    console.log("found user: ", user)
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Invalid token or has expired" }), { status: 400 });
    }

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return new NextResponse("Failed to reset password!", { status: 500 });
  }
};