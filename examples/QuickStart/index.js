const { join } = require("path");
const NRAF = require("@nraf/core");
const GreetController = require("./Controller/GreetController");

const app = NRAF();
const PORT = process.env.PORT || 3000;

app.set("views", join(__dirname, "views"));
app.set("public", join(__dirname, "public"));

const isAuthenticated = (req, res, next) => {
  if (req?.query?.loggedIn === "yes") {
    next();
  } else {
    res.redirect("/");
  }
};

const logger = (req, res, next) => {
  console.log("Request url", req.url);
  next();
};

app.scope("authenticated", [isAuthenticated], (scope) => {
  scope.get("/profile", (req, res) => {
    res.send("This is your profile");
  });

  scope.use("/user", GreetController);
});

app.scope("api", [logger], (scope) => {
  scope.get("/api/hello", (req, res) => {
    res.json({
      status: "ok",
      message: "Hello World",
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
