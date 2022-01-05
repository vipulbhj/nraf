const path = require("path");
const NRAF = require("@nraf/core");
const app = NRAF();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));

const TODOS = [];

app.get("/", (req, res) => {
  res.render("home", {
    todos: TODOS,
    isTodoEmpty: TODOS.length === 0,
  });
});

app.post("/add-todo", (req, res) => {
  TODOS.push(req.body.todoContent);

  res.redirect("/");
});

app.post("/edit-todo", (req, res) => {
  const idx = req.body.idx;
  const content = req.body.content;

  TODOS[idx] = content;

  res.json({
    idx,
    content,
  });
  res.end();
});

app.post("/delete-todo", (req, res) => {
  TODOS.splice(req.body.todoId, 1);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
