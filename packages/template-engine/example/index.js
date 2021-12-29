const fs = require('fs');
const Template = require('../index');

const templateTxt = fs.readFileSync('./index.nraf', {encoding:'utf8', flag:'r'});
const t = new Template(templateTxt);
t.compile();
const html = t.render({
  user_name: 'Vipul Bhardwaj',
  role: "Manager",
  product_list: [
    {
      name: 'Apple',
      price: "$12"
    },
    {
      name: 'Orange',
      price: "$7"
    }
  ]
});

fs.writeFileSync('index.html', html, {encoding: 'utf8'});
