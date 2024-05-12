import React from "react";
import { addPost, deletePost } from "@/lib/action";

const ServerActionTestPage = () => {
  return (
    <div>
      <form action={addPost}>
        <input type="text" placeholder="Title" name="title" />
        <input type="text" placeholder="Description" name="description" />
        <input type="text" placeholder="Slug" name="slug" />
        <input type="text" placeholder="UserId" name="userId" />
        <button>Create</button>
      </form>

      <div>
        <form action={deletePost}>
          <input type="text" placeholder="PostId" name="id"/>
          <button>Delete</button>
        </form>
      </div>
    </div>
  );
};

export default ServerActionTestPage;
