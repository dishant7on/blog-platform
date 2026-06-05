import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://blog-platform-backend-yxtn.onrender.com/api";
function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const getPost = async () => {
    const res = await axios.get(`${API_URL}/posts/${id}`);
    setPost(res.data);
  };

  const getComments = async () => {
    const res = await axios.get(`${API_URL}/comments/${id}`);
    setComments(res.data);
  };

  const addComment = async () => {
    if (!user) {
      return alert("Please login first");
    }

    if (!text.trim()) {
      return alert("Comment cannot be empty");
    }

    try {
      await axios.post(
        `${API_URL}/comments/${id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setText("");
      getComments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add comment");
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      getComments();
    } catch (error) {
      alert(error.response?.data?.message || "Delete comment failed");
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Post deleted");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, []);

  if (!post) return <h2>Loading...</h2>;

  const isOwner =
    user &&
    post.author &&
    (user._id === post.author._id || user._id === post.author);

  return (
    <div className="container">
      <div className="card">
        <h1>{post.title}</h1>

        <p>{post.content}</p>

        <p>
          <strong>Author:</strong> {post.author?.name}
        </p>

        {isOwner && (
          <>
            <Link to={`/edit/${post._id}`}>
              <button>Edit Post</button>
            </Link>

            <button onClick={deletePost}>Delete Post</button>
          </>
        )}
      </div>

      <div className="card">
        <h2>Comments</h2>

        <textarea
          rows="3"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={addComment}>Add Comment</button>

        {comments.map((comment) => {
          const isCommentOwner =
            user &&
            comment.user &&
            (user._id === comment.user._id || user._id === comment.user);

          return (
            <div key={comment._id}>
              <hr />
              <p>{comment.text}</p>
              <small>{comment.user?.name}</small>

              {isCommentOwner && (
                <div>
                  <button onClick={() => deleteComment(comment._id)}>
                    Delete Comment
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PostDetails;

