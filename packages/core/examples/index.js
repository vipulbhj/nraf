const NRAF = require("../index");

const app = NRAF();

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT);
