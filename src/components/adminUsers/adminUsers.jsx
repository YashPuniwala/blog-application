import React from "react";
import Image from "next/image";
import styles from "./adminUsers.module.css";
import { deleteUser } from "@/lib/action";
import { auth } from "@/lib/auth";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/user", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
};

const AdminUsers = async () => {
  const session = await auth();
  const users = await getData();
  return (
    <div className={styles.container}>
      <h1>Users</h1>
      {users.map((user) => (
        <div className={styles.user} key={user.id}>
          <div className={styles.detail}>
          {user.images && user.images.length > 0 && (
              <div className={styles.imgContainer}>
                {user.images.map((image, index) => (
                  <div key={image._id} className={styles.imgWrapper}>
                    <Image
                      src={image.imageUrl}
                      alt={user.title}
                      className={styles.img}
                      width={60}
                      height={60}
                    />
                  </div>
                ))}
              </div>
            )}
            <span>{user.username}</span>
          </div>
          {session?.user?.id !== user._id && (
            <form action={deleteUser}>
              <input type="hidden" name="id" value={user._id} />
              <button className={styles.userButton}>Delete</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
