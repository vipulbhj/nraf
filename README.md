![nraf logo](https://user-images.githubusercontent.com/63957920/149619576-3df47314-2d3e-4d50-8e12-da5bb4ab9b77.png)

NRAF is an abbreviation, for "Not Really A Framework". I don't remember why I named it that in 2018, it's been a while, but I kinda like the sound of it, so the name stayed.

I worked on it for a while and then sort of drifted away from it, but now I am picking it up again and will try to work on it more.

## What is NRAF ?

NRAF is a lightweight library(/framework), which allows you to build web applications.

NRAF is written from scratch, which means it uses **_ZERO_** `npm` dependencies. Why do I even mention that ? because this is one of the key reason, why I actually started working on it.

The NodeJS ecosystem has a problem of developers relying on external dependencies, a little too much. This has a lot of issues, including serious security issues(which we have already seen a few times in past).

And thus NRAF doesn't using any external dependencies and everything is built from scratch.

## Documentaion

You can start by going through the [Quick Start Guide](<(./docs/quick-start.md)>), which will get you up and running quickly and also teach you most of the basics about `NRAF`.

All the links are mentioned below.

- [Quick Start Guide](./docs/quick-start.md)
- [Core API Docs](./docs/core-api.md)
- [NTE Docs](./docs/template-engine.md)

## Inspired by ExpressJS

When I initially started working on NRAF, I frequenly looked at the ExpressJS source code for inspiration of possible ways of implementing a feature.

Also, before that I had also consumed ExpressJS in a few projects, I built and I really like the `API` it exposed.

Courtesy of all those factors, NRAF now looks a lot like Express, let look at an example.

Here are a few endpoints I built

```javascript
const PORT = 3000;
const USERS = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Foo Bar",
  },
];

app.get("/users", (req, res) => {
  res.json(USERS);
  res.end();
});

app.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const user = USERS.find((user) => {
    return user.id === userId;
  });

  if (user) {
    res.json(user);
  } else {
    res.setStatus(401);
    res.json({
      message: "Error, no user found",
    });
  }
  res.end();
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
```

If you show this code to anyone who has worked with `express`, for even a amount of time, they would instantly recognied what's happening and tell you this is valid `express` code.

While that is true in part, this code is missing two key lines.

```javascript
const express = require("express");
const app = express();
```

what this piece of code does is, it imports the `express` package and initializes it for you to use.

But, what's interesting here is, the above code is also valid `NRAF` code, all you need to do is, change the imports.

```javascript
const NRAF = require("nraf");
const app = NRAF();
```

and this works, right out of the box.

This means that, some amount of `express` code can directly be ported to `NRAF`, just by changing the imports.

You can play with the Todo App example, using `node example/Todo/index.js`.

## Examples

The `examples` folder contains files, which are labelled, so you can quickly look specific application examples which you might be interest in.

![demo](./demo.gif)
