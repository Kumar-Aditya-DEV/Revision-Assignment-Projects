import React, { useEffect, useState } from "react";

function User() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetch("https://jsonplaceholder.typicode.com/users");
      const resData = await data.json();
      setUsers(resData);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User Page</h1>
 
      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>City: {user.address.city}</p>
        </div>
      ))}
    </div>
  );
}

export default User;
