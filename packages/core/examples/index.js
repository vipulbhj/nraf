const NRAF = require("../index");

const app = NRAF();

const PORT = 4000;

app.get("/", (req, res) => {
  res.cookie("g", "h", { httpOnly: true }).send("Hello World");
});

app.get("/home", (req, res) => {
  res.cookie("a", "b").cookie("d", "e", { maxAge: 60 }).send("Home Page");
});

app.listen(PORT);
