import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const getPost = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (error) {
      alert("Failed to load post");
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();

    if (!user) {
      return alert("Please login first");
    }

    try {
      await axios.put(
        `${API_URL}/posts/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Post updated");
      navigate(`/post/${id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="container form-box">
      <h1>Edit Blog Post</h1>

      <form onSubmit={updatePost}>
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

        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;