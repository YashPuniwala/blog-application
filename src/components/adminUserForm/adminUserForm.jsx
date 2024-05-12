"use client";

import React, {useState} from "react";
import styles from "./adminUserForm.module.css";
import ImageUpload from "@/lib/imageUpload";
import { addUser } from "@/lib/action";

const AdminUserForm = () => {
  // const [state, formState] = useFormState(addUser, undefined);
  const [imageUrl, setImageUrl] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData(e.currentTarget);
    imageUrl.forEach((img) => {
      formDataToSubmit.append("images", JSON.stringify(img));
    });
    try {
      await addUser(formDataToSubmit);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = (result) => {
    console.log("result: ", result);
    const info = result.info;

    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url;
      const public_id = info.public_id;
      setImageUrl((prevImageUrls) => [
        ...prevImageUrls,
        { imageUrl: url, publicId: public_id },
      ]);
    }
  };

  const handleRemove = (url) => {
    setImageUrl((prevImageUrl) =>
      prevImageUrl.filter((prevImg) => prevImg.imageUrl !== url)
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1>Add New user</h1>
      <input type="text" name="username" placeholder="Username" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
      />
      {/* <input type="text" name="img" placeholder="Image" /> */}
      <ImageUpload
        uploadPreset="xw6acwub"
        // uploadPreset="blogApplication"
        onImageUpload={handleImageUpload}
        imageUrl={imageUrl}
        onRemoveImage={handleRemove}
      />
      <select name="isAdmin">
        <option value="false">Is Admin?</option>
        <option value={false}>No</option>
        <option value={true}>Yes</option>
      </select>
      <button>Add</button>
      {/* {state?.error} */}
    </form>
  );
};

export default AdminUserForm;
