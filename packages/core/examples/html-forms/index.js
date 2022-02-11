const { join } = require("node:path");
const NRAF = require("../../index");
const app = NRAF();

const PORT = process.env.PORT || 3000;

app.set("views", join(__dirname, "views"));
app.set("public", join(__dirname, "public"));

app.get("/", (req, res) => {
  res.render("forms");
});

app.get("/simple-get", (req, res) => {
  console.log("----- DATA VALUES START ----");
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  console.log("----- DATA VALUES END ----");
  res.redirect("/");
});

app.post("/simple-post", (req, res) => {
  console.log("----- DATA VALUES START ----");
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  console.log("----- DATA VALUES END ----");
  res.redirect("/");
});

app.post("/multipart-post", (req, res) => {
  // console.log("----- DATA VALUES START ----");
  // console.log(req.body);
  // console.log(req.params);
  // console.log(req.query);
  // console.log("----- DATA VALUES END ----");
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server Starter");
});
