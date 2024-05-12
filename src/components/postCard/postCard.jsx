import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./postCard.module.css";

const PostCard = ({ post }) => {
  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return `${description.slice(0, maxLength)}...`;
    }
    return description;
  };

  const maxLength = 50;

  return (
    <div className={styles.postCardContainer}>
      {post.images && post.images.length > 0 && (
        <div className={styles.imgContainer}>
          {post.images.map((image, index) => (
            <div key={image._id} className={styles.imgWrapper}>
              <Image
                src={image.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
                className={styles.img}
              />
            </div>
          ))}
        </div>
      )}
      <div className={styles.postCardBottom}>
        <h1 className={styles.postCardTitle}>{post.title}</h1>
        <p className={styles.postCardDescription}>
          {truncateDescription(post.desc, maxLength)}
        </p>
        <p className={styles.postCardDate}>01.01.2024</p>
        <Link className={styles.postCardLink} href={`/blog/${post.slug}`}>
          READ MORE
        </Link>
      </div>
    </div>
  );
};

export default PostCard;