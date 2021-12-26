const qs = require("querystring");

function typeBasedParser(type, data) {
  if (type === "application/x-www-form-urlencoded") return qs.parse(data);
  else if (type === "application/json;charset=utf-8") return JSON.parse(data);
  else return null;
}

module.exports = {
  typeBasedParser,
};
