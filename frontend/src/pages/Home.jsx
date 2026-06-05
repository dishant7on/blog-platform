import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://blog-platform-backend-yxtn.onrender.com/api";
function Home() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const res = await axios.get(`${API_URL}/posts`);
    setPosts(res.data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="container">
      <h1>All Blog Posts</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div className="card" key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content.slice(0, 120)}...</p>
            <p className="small">By: {post.author?.name || "Unknown"}</p>
            <Link to={`/post/${post._id}`}>Read More</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;