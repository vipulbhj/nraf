const path = require("path");
const NRAF = require("@nraf/core");

const app = NRAF();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
