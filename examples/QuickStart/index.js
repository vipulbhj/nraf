const { join } = require("path");
const NRAF = require("@nraf/core");
const GreetController = require("./Controller/GreetController");

const app = NRAF();
const PORT = process.env.PORT || 3000;

app.set("views", join(__dirname, "views"));
app.set("public", join(__dirname, "public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", GreetController);

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
