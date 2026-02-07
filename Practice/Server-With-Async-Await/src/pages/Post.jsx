import React, { useEffect, useState } from "react";

function Post() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetch("https://jsonplaceholder.typicode.com/posts");
      const resData = await data.json();
      setPosts(resData);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Post Page</h1>

      {posts.slice(0, 5).map((post) => (
        <div key={post.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default Post;
