const Template = require("./index");

const footerPartial = `
  <ul>
    <li>
    {% if loggedIn %}
      <a>Logout</a>
    {% else %}
      <a>Log in</a>
    {% endif %}
    </li>
  </ul>
`;

const homePage = `
  <main>
    Hello, {{ name }}
  </main>

  {{ include("layout/footer.nraf") }}
`;

const markup = `
<!DOCTYPE html>
<html>
  <head>
    <title>JSWorldConf!</title>
  </head>
  <body>
    <h1>Hello, {{ user_name }}!!</h1>
    <h1>
      Hola, {{ 
        user_name 
      }}!!
    </h1>
  </body>
</html>
`;

const exmapleIncludes = new Template(markup);
exmapleIncludes.compile();
const exmapleIncludesHtml = exmapleIncludes.render({
  user_name: "Foo",
});

console.log(exmapleIncludesHtml);
