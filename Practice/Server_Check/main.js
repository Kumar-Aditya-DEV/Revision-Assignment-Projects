const express = require("express");
const app = express();
app.use(express.json());

const users = [
  { id: 1, name: "Arjun", role: "student" },
  { id: 2, name: "Priyesha", role: "mentor" },
  { id: 3, name: "wow", role: "teacher" },
  { id: 4, name: "Pri", role: "staff" }
];


app.get("/", (req, res) => {
  res.send("Express server is running");
});

app.get("/users", (req, res) => {
    res.status(200).json(users);
});

app.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});


app.post("/users", (req, res) => {
  const newUser = {
    id: req.body.id,
    name: req.body.name,
    role: req.body.role
  };

  users.push(newUser);

  res.status(201).send("added user");
});


app.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = {
    id: userId,
    name: req.body.name,
    role: req.body.role
  };

  res.status(200).json({
    message: "User replaced",
    user: users[index]
  });
});


app.listen(4000, () => {
  console.log("Server started on port 4000");
});