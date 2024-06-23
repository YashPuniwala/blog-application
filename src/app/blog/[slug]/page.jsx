import Image from "next/image";
import React from "react";
import styles from "./singlePost.module.css";
import { Suspense } from "react";
import { getPost } from "@/lib/data";
import PostUser from "@/components/postUser/postUser";

// With API
const getData = async (slug) => {
  const res = await fetch(`http://localhost:3000/api/blog/${slug}`);

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
};

const SinglePostPage = async ({ params }) => {
  const { slug } = params;

  // Without API  
  // const post = await getPost(slug);

  const post = await getData(slug);
  const mainImage = post.images && post.images.length > 0 ? post.images[0].imageUrl : null;
  return (
    
    <div className={styles.container}>
      <div className={styles.imgContainer}>
      {mainImage && (
          <Image src={mainImage} alt="Post Image" layout="fill" className={styles.img} />
        )}
      </div>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.detail}>
          <Suspense fallback={<div>Loading.....</div>}>
            <PostUser userId={post.userId} />
          </Suspense>

          <div className={styles.detailText}>
            <span className={styles.detailTitle}>Published</span>
            <span className={styles.detailValue}>
              {post.createdAt.toString().slice(4, 16)}
            </span>
          </div>
        </div>
        <div className={styles.content}>{post.desc}</div>
      </div>
    </div>
  );
};

export default SinglePostPage;
