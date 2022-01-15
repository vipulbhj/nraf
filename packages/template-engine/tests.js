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

const exmapleIncludes = new Template(homePage);
exmapleIncludes.compile();
const exmapleIncludesHtml = exmapleIncludes.render({
  include: (path) => {
    // This function needs to give me a template
    const t = new Template(footerPartial);
    t.compile();
    return t.render({
      loggedIn: true,
    });
  },
});

console.log(exmapleIncludesHtml);
