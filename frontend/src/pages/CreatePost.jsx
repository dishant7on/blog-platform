import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://blog-platform-backend-yxtn.onrender.com/api";
function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const submitPost = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return alert("Please login first");
    }

    try {
      await axios.post(
        `${API_URL}/posts`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="container form-box">
      <h1>Create Blog Post</h1>

      <form onSubmit={submitPost}>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="8"
          placeholder="Write your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">Publish Post</button>
      </form>
    </div>
  );
}

export default CreatePost;