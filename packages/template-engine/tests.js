const Template = require('./index');

const sampleInput = `
<p>Welcome, {{user_name}}!</p>
<p>Products:</p>
<ul>
{% for product in product_list %}
  <li>{{ product.name }}: {{ product.price }}</li>
{% endfor %}
</ul>
`;


const t = new Template(sampleInput);
t.compile();
const html = t.render({
  name: 'Vipul Bhardwaj',
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

console.log(html);
