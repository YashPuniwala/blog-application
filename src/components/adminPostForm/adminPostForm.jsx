"use client";

import React, {useState} from "react";
import { addPost } from "@/lib/action";
import { useFormState } from "react-dom";
import styles from "./adminPostForm.module.css";
import ImageUpload from "@/lib/imageUpload";

const AdminPostForm = ({ userId }) => {
  // const [state, formState] = useFormState(addPost, undefined);
  const [imageUrl, setImageUrl] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData(e.currentTarget);
    imageUrl.forEach((img) => {
      formDataToSubmit.append("images", JSON.stringify(img));
    });
    try {
      await addPost(formDataToSubmit);
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
    <div>
      <form onSubmit={handleSubmit} className={styles.container}>
        <h1>Add New Post</h1>
        <input type="hidden" name="userId" value={userId} />
        <input type="text" name="title" placeholder="Title" />
        <input type="text" name="slug" placeholder="Slug" />
        <ImageUpload
          uploadPreset="xw6acwub"
          // uploadPreset="blogApplication"
          onImageUpload={handleImageUpload}
          imageUrl={imageUrl}
          onRemoveImage={handleRemove}
        />
        <textarea
          type="text"
          name="desc"
          placeholder="Description"
          rows={10}
        ></textarea>
        <button>Add</button>
        {/* {state?.error} */}
      </form>
    </div>
  );
};

export default AdminPostForm;
