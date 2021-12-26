const NRAF = require("@nraf/core");

const app = NRAF();

const PORT = 3000;

const USERS = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Foo Bar",
  },
];

app.get("/users", (req, res) => {
  res.json(USERS);
  res.end();
});

app.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const user = USERS.find((user) => {
    return user.id === userId;
  });

  if (user) {
    res.json(user);
  } else {
    res.setStatus(401);
    res.json({
      message: "Error, no user found",
    });
  }
  res.end();
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
