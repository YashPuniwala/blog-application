import PostCard from "@/components/postCard/postCard";
import React from "react";
import styles from "./blog.module.css";
import { getPosts, getUserPosts } from "@/lib/data";
import { connectToDb } from "@/lib/utils";
import { auth } from "@/lib/auth";
import AdminPostForm from "@/components/adminPostForm/adminPostForm";

// With API
const getData = async (userId) => {
  const res = await fetch(
    `http://localhost:3000/api/blog?${userId ? `userId=${userId}` : ""}`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
};

const BlogPage = async () => {
  const session = await auth();
  console.log(session.user.id, "session.user.id");
  const userId = session.user?.id;
  // Without API
  // const posts = await getPosts()
  const posts = await getData(userId);
  console.log(posts, "posts");
  // const posts = await getUserPosts(userId);

  return (
    <div className={styles.container}>
      <div className={styles.createPostSection}>
        <AdminPostForm userId={userId} />
      </div>
      <div className={styles.postsSection}>
        {posts &&
          posts.map((post) => (
            <div className={styles.post} key={post.id}>
              <PostCard post={post} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BlogPage;
