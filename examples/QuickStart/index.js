const { join } = require("path");
const NRAF = require("@nraf/core");

const app = NRAF();
const PORT = process.env.PORT || 3000;

app.set("views", join(__dirname, "views"));
app.set("public", join(__dirname, "public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/home", (req, res) => {
  const greet = req.query.greet || "NRAF";
  res.render("home", { greet });
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
