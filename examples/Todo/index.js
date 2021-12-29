const path = require("path");
const NRAF = require("@nraf/core");
const app = NRAF();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));

app.get("/greet/:user_name", (req, res) => {
  const message = req.query.message;
  const user_name = req.params.user_name;
  res.render("greet", { user_name, message });
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
