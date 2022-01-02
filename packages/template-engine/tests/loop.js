const markup = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello, JSWorldConf!</title>
  </head>
  <body>
    <ul>
      {% for product in product %}
        <li>{{product.name}}: {{ product.price }}</li>
      {% endfor %}
    </ul>
  </body>
</html>
`;
