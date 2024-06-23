import mongoose from "mongoose";

// const userRoles = ['user', 'admin'];

const imageSchema = new mongoose.Schema({
  imageUrl: {
      type: String,
  },
  publicId: {
      type: String,
  }
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
    },
    images: [imageSchema],
    // role: {
    //   type: String,
    //   enum: userRoles,
    //   default: 'user', // Default role to "user" if not provided
    // },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpiry: {
      type: Date, // Change to Date type to store expiry time
      required: false,
    }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    images: [imageSchema],
  },
  { timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
export const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);

// export const authConfig = {
//   pages: {
//     signIn: "/login",
//   },
//   providers: [],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.isAdmin = user.isAdmin;
//         token.role = user.role;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       console.log({ sessionToken: token });
//       if (token) {
//         session.user.id = token.id;
//         session.user.isAdmin = token.isAdmin;
//         session.user.role = token.role;
//       }

//       if (session?.user) {
//         session.user.role = token.role;
//       }
//       return session;
//     },
//     authorized({ auth, request }) {
//       console.log(auth, "auth");
//       const user = auth?.user;
//       console.log(user, "user authorized");
//       const isOnAdminPanel = request.nextUrl?.pathname.startsWith("/admin");
//       const isOnBlogPage = request.nextUrl?.pathname.startsWith("/blog");
//       const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");

//       // ONLY ADMIN CAN REACH THE ADMIN DASHBOARD

//       if (isOnAdminPanel && !user?.isAdmin) {
//         return false;
//       }

//       // ONLY AUTHENTICATED USERS CAN REACH THE BLOG PAGE

//       if (isOnBlogPage && !user) {
//         return false;
//       }

//       // ONLY UNAUTHENTICATED USERS CAN REACH THE LOGIN PAGE

//       if (isOnLoginPage && user) {
//         return Response.redirect(new URL("/", request.nextUrl));
//       }

//       return true;
//     },
//   },
// };



// import NextAuth from "next-auth";
// import Github from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectToDb } from "./utils";
// import { User } from "./models";
// import bcrypt from "bcryptjs";
// import { authConfig } from "./authConfig";

// const login = async (credentials) => {
//   try {
//     connectToDb();

//     const user = await User.findOne({ username: credentials.username });

//     if (!user) {
//       throw new Error("Wrong Credentials");
//     }

//     const isPasswordCorrect = await bcrypt.compare(
//       credentials.password,
//       user.password
//     );

//     if (!isPasswordCorrect) {
//       throw new Error("Wrong Credentials");
//     }

//     return {...user, password: null, role: user.role, isAdmin: user.isAdmin};
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to login!");
//   }
// };

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   ...authConfig,
//   providers: [
//     Github({
//       profile(profile) {
//         console.log(profile, "profile");

//         let userRole = "user"; // Set default role to "user"
//         if (profile?.email === "yashpuniwala@gmail.com") {
//           userRole = "admin";
//         }

//         return {
//           ...profile,
//           id: profile.id,
//           role: userRole,
//         };
//       },
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     CredentialsProvider({
//       async authorize(credentials) {
//         try {
//           const user = await login(credentials);
//           return user;
//         } catch (error) {
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       console.log(user, account, profile);
//       if (account.provider === "github") {
//         connectToDb();
//         try {
//           const existingUser = await User.findOne({ email: profile.email });

//           if (!existingUser) {
//             // If user doesn't exist, create a new user with the GitHub profile data
//             const newUser = new User({
//               username: profile.login,
//               email: profile.email,
//               img: profile.avatar_url,
//               role: profile.role || "user", // Default role to "user" if not provided
//               isAdmin: false,
//             });

//             await newUser.save();
//           } else {
//             // Update the user's role if necessary
//             existingUser.role = profile.role || existingUser.role || "user";
//             await existingUser.save();
//           }
//         } catch (error) {
//           console.log(error);
//           return false;
//         }
//       } else if (account.provider === "credentials") {
//         // For credentials provider, ensure that the user object contains the role
//         user.role = user.role || "user"; // Default role to "user" if not provided
//         user.isAdmin = user.isAdmin || false;
//       }
//       return true;
//     },
//     ...authConfig.callbacks,
//   },
// });




// import NextAuth from "next-auth";
// import Github from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectToDb } from "./utils";
// import { User } from "./models";
// import { authConfig } from "./authConfig";
// import bcrypt from "bcryptjs";

// const login = async (credentials) => {
//   try {
//     connectToDb();
//     const user = await User.findOne({ username: credentials.username });

//     if (!user) throw new Error("Wrong credentials!");

//     const isPasswordCorrect = await bcrypt.compare(
//       credentials.password,
//       user.password
//     );

//     if (!isPasswordCorrect) throw new Error("Wrong credentials!");

//     return user;
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to login!");
//   }
// };

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   ...authConfig,
//   providers: [
//     Github({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//       profile(profile) {
//         const adminUsernames = ["YashPuniwala", "your-admin-username-2"]; // Replace with actual admin usernames
//         const adminEmails = ["yashpuniwala@gmail.com", "admin2@example.com"];
//         // This function allows you to modify the profile object received from GitHub
//         return {
//           id: profile.id,
//           name: profile.name,
//           email: profile.email,
//           image: profile.avatar_url,
//           isAdmin: adminUsernames.includes(profile.login) || adminEmails.includes(profile.email), // Set isAdmin based on username or email
//         };
//       },
//     }),
//     CredentialsProvider({
//       async authorize(credentials) {
//         try {
//           const user = await login(credentials);
//           return user;
//         } catch (err) {
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       if (account.provider === "github") {
//         connectToDb();
//         try {
//           const adminUsernames = [
//             "YashPuniwala",
//             "your-admin-username-2",
//           ]; // Replace with actual admin usernames

//           const userInDB = await User.findOne({ email: profile.email });

//           if (!userInDB) {
//             const newUser = new User({
//               username: profile.login,
//               email: profile.email,
//               image: profile.avatar_url,
//               isAdmin: adminUsernames.includes(profile.login), // Check if the user is an admin based on their username
//             });

//             await newUser.save();
//           } else {
//             const isAdmin = adminUsernames.includes(profile.login);
//             if (userInDB.isAdmin !== isAdmin) {
//               userInDB.isAdmin = isAdmin;
//               await userInDB.save();
//             }
//           }
//         } catch (err) {
//           console.log(err);
//           return false;
//         }
//       }
//       return true;
//     },
//     ...authConfig.callbacks,
//   },
// });
