const markup = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello, JSWorldConf!</title>
  </head>
  <body>
    {% if isAdmin %}
      <p>You are Admin</p>
    {% elif isModerator %}
      <p>You are Moderator</p>
    {% else %}
      <p>You are viewer</p>
    {% endif %} 
  </body>
</html>
`;
