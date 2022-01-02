const Template = require("./index");

const sampleInput = `
<p>Welcome, {{user_name}}!</p>
{% if isAdmin %}
  <p>You are Admin.</p>
{% elif isModerator %}
  <p> You are Moderator</p>
{% else %}
  <p>You are not Admin.</p>
{% endif %}

<p>Products:</p>
<ul>
{% for product in product_list %}
  <li>{{ product.name }}: {{ product.price }}</li>
{% endfor %}
</ul>
`;

const testOne = `<body><h1> Hello {{ user_name }}!!</h1></body>`;

const t = new Template(sampleInput);
t.compile();
const html = t.render({
  user_name: "Vipul Bhardwaj",
  isAdmin: false,
  isModerator: true,
  product_list: [
    {
      name: "Apple",
      price: "$12",
    },
    {
      name: "Orange",
      price: "$7",
    },
  ],
});

console.log(html);
