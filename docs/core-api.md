# Core API

# NRAF()

Creates a NRAF application. The `NRAF()` function is a top-level core function exported by the `@nraf/core` package.

```javascript
const NRAF = require("@nraf/core");
const app = NRAF();
```

# Application

The `app` object conventionally denotes the Nraf application. Create it by calling the top-level `NRAF()` function exported by the nraf/core module:

```javascript
var NRAF = require("@nraf/core");
var app = NRAF();

app.get("/", function (req, res) {
  res.send("hello world");
});

app.listen(3000);
```

## app.set(name, value)

Assigns setting `name` to `value`.

The following table lists application settings:

| Property | Type   | Description                                                                                               | Default |
| -------- | ------ | --------------------------------------------------------------------------------------------------------- | ------- |
| “views”  | String | Path of the folder containing the views, i.e. the .nraf extension files for the template-engine to parse. | null    |
| “public” | String | Path of the folder containing public assets such as robots.txt, favicon, etc.                             | null    |

NOTE: You must set the “views” & “public” directory path explicitly in your app. For more details, [read this](https://github.com/vipulbhj/vipulbhj/blob/main/blogs/LearningsWhileBuildingNRAF/TheCuriousCaseOfResDotRender/README.md).

### Example:

```javascript
app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));
```

## app.get(path, callback)

Routes HTTP GET requests to the specified path with the specified callback functions.

### Argument specification:

| Argument | Description                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------- |
| path     | A path for which the middleware function is invoked                                            |
| callback | A callback function to be executed which takes the response and request objects as parameters. |

### Example:

```javascript
app.get("/", (req, res) => {
  res.json(todos);
});
```

## app.post(path, callback)

Routes HTTP POST requests to the specified path with the specified callback functions.

### Argument specification:

| Argument | Description                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------- |
| path     | A path for which the middleware function is invoked                                            |
| callback | A callback function to be executed which takes the response and request objects as parameters. |

### Example:

```javascript
app.post("/add-todo", (req, res) => {
  TODOS.push(req.body.todoContent);
  res.redirect("/");
});
```

## app.use(callback)

Mounts the specified middleware function.

### Example:

```javascript
app.use((req, res, next) => {
  console.log("Time: %d", Date.now());
  next();
});
```

## app.listen(PORT, callback)

This method is identical to Node’s [http.Server.listen()](https://nodejs.org/api/http.html#http_server_listen).

### Example:

```javascript
const PORT = process.env.PORT || 3000;

...
...

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
```

# Response

## res.render(view, locals)

Renders a view and sends the compiled HTML string to the client.

The `view` argument is a string that is the file name of the view file to render.

`locals` is an object whose properties define local variables for the view.

NOTE: You should set the “views” directory path explicitly in your app. For more details, [read this](https://github.com/vipulbhj/vipulbhj/blob/main/blogs/LearningsWhileBuildingNRAF/TheCuriousCaseOfResDotRender/README.md).

[Read more about the nraf template engine](./template%20engine.md).

### Example:

```javascript
res.render("home", {
  todos: TODOS,
  isTodoEmpty: TODOS.length === 0,
});
```

In the above example, `home` is the view passed which is same as the name of the file in the views directory.

## res.redirect(path)

Redirects to the URL derived from the specified `path`.

It by default sets the HTTP status code to 302.

### Example:

```javascript
res.redirect("/");
```

## res.json()

Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

### Example:

```javascript
res.json({
  idx,
  content,
});
```

## res.setStatus(statusCode)

Sets the response HTTP status code to `statusCode`. If an unknown status code is specified, the response body will just be the code number.

### Example:

```javascript
res.setStatus(302);
```

## res.send()

This method is identical to Node’s [response.write()](https://nodejs.org/api/http.html#responsewritechunk-encoding-callback).

### Example:

```javascript
res.send("<p>some html</p>");
```

## res.end()

Ends the response process. This method comes from the [response.end() method of http.ServerResponse](https://nodejs.org/api/http.html#http_response_end_data_encoding_callback).

### Example:

```javascript
res.end();
```

# Request

## req.url

The URL path on which a instance was mounted.

### Example:

```javascript
app.get("/", (req, res) => {
  console.log(req.query);
  res.render("home", {
    todos: TODOS,
    isTodoEmpty: TODOS.length === 0,
  });
});

// Console output: "/"
```

## req.body

Contains key-value pairs of data submitted in the request body.

### Example:

```javascript
app.post("/add-todo", (req, res) => {
  TODOS.push(req.body.todoContent);
  res.redirect("/");
});
```

## req.params

This property is a JS object containing properties mapped to the named route “parameters”. For example, if you have the route `/books/:bookId`, then the `bookID` property is available as `req.params.bookID`. This object defaults to `{}`.

### Example:

```javascript
// Route path: /users/:userId/books/:bookId
// Request URL: http://localhost:3000/users/34/books/8989

req.params: { "userId": "34", "bookId": "8989" }
```

## req.query

This property is a JS object after the query string is parsed. This object defaults to `{}`.

### Example:

```javascript
// Route path: */user?name=tom&age=55*

req.query: {name:"tom", age: "55"}
```
