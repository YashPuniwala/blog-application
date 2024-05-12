import React from "react";
import Image from "next/image";
import { deletePost } from "@/lib/action";
import styles from "./adminPosts.module.css";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/blog", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error("Something went wrong");
  }
  return res.json();
};

const AdminPosts = async () => {
  const posts = await getData();
  return (
    <div className={styles.container}>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div className={styles.post} key={post.id}>
          <div className={styles.detail}>
            {post.images && post.images.length > 0 && (
              <div className={styles.imgContainer}>
                {post.images.map((image, index) => (
                  <div key={image._id} className={styles.imgWrapper}>
                    <Image
                      src={image.imageUrl}
                      alt={post.title}
                      className={styles.img}
                      width={60}
                      height={60}
                    />
                  </div>
                ))}
              </div>
            )}
            <span className={styles.postTitle}>{post.title}</span>
          </div>
          <form action={deletePost}>
            <input type="hidden" name="id" value={post._id} />
            <button className={styles.postButton}>Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default AdminPosts;