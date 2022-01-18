const NRAF = require("@nraf/core");
const router = NRAF.Router();

router.get("/greet", (req, res) => {
  const greet = req.query.message || "NRAF";
  res.render("home", { greet });
});

module.exports = router;
