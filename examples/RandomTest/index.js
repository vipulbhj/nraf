const NRAF = require("@nraf/core");

const app = NRAF();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
  res.end();
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
