# Quick Start Guide

Start by create a new directly somwhere on your machine. For the sake of this tutorial, I am gonna call it `nraf-quick-start`, if you wanna do the same, you can use the command.

```bash
mkdir nraf-quick-start
```

## Installation

We will move into the directory we just created, you can using

```bash
cd nraf-quick-start
```

Once, we are at the exact location, first step is to initalize a new `npm` project. To do that, type

```bash
npm init -y
```

This will create a `package.json` file inside your directory, after which, we can install the `NRAF` package. To do that, type

```bash
npm install @nraf/core
```

And that's it, we have downloaded all the necessary things, we need for your to follow along with this guide.

## Project Setup

Start by creating a `index.js` file in the root of your project, that's sufficient for creating REST APIs, but if you are making a website which also serves some static assets and/or web pages, you need to create two more directories / folders. You can call them whatever, but a good standard is to use the names `views` and `public`.

So, we are going to use those, and we can easily create all those things using, the one liner below.

```bash
mkdir views && mkdir public && touch index.js
```

We will be keeping all our statis assets in the `public` directory, so things like `css`, `javascipt`, `images`, etc go in there.

We will use the `views` directory to write out templates, NRAF out of the box ships with it's own templating engine, which you can read more about [here](./template-engine.md).

And that's all you will need in terms of project structure.

**NOTE**

> NRAF isn't strict about any directory names or places where you need to place things, etc. All things are configurable and you can choose from the simplest to the most complex project structures, whatever suits your needs better 🚀🚀🚀.

## Application Entrypoint

We will use the `index.js` file as our application entrypoint. Start by pasting the code below in the `index.js` file we just created.

```js
const NRAF = require("@nraf/core");

const app = NRAF();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
  res.end();
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
```

We start by importing `NRAF` from the `@nraf/core` package, which we installed at the beinging of this guide.

`NRAF` is an app constructor, which we call and create an object of, which we store in a variable called `app`. You can call this anything, we call it `app`, as it's sortof a standard.

We create a variable called `PORT`, which will be used to hold the port value, our application will run on.

When the use out first method from `NRAF`, called `get`.
You can read more about the `get` method [here](./core-api.md).

We will create a `GET` endpoint, using the `app.get` method, which take the a [RESOURCE URL](https://restfulapi.net/resource-naming/) as the first argument, and a callback function as the second argument.

The callback is passed two objects, `req` and `res`, which allow us to read data which the user send along with the request and send them some data as a response.

You can read more about all the available methods, etc in the core documentation.

For our first endpoint, we get a request and send back the user / client, a string `"Hello World"`, using the `res.send` method.

The default `CONTENT-TYPE` header for `NRAF` responses is `text/html`, with a status code of `200`. But, you can override both of those things using methods like `res.setStatus` and `res.setHeader`.

And when you want to send `JSON` data to the user, you can directly use `res.json` method and pass it a `Javascript` object. It takes care of serialization and setting up the all the appropriate headers internally.

We call `res.end`, when we are done sending all the data to the users. This is an important method, and if not called, will cause the client application to keep waiting for more data, and the request won't finish.

After that, we use the `app.listen` method, pass it the PORT. This method is responsible for actually creating a `http` server.

And that's all the code we need.

## Running your app

Running our app now is trivial, we just need to execute the `index.js` file, with node.

```bash
node index.js
```

You must see the following output in the terminal:

![Terminal Output](https://user-images.githubusercontent.com/63957920/149618238-a2244e9c-d750-47e1-aa86-0f1415768643.png)

View the website at: [http://localhost:3000](http://localhost:3000/)

You will see the Hello World text on the page:

![Webpage Output](https://user-images.githubusercontent.com/63957920/149618243-4b795edf-71a7-42da-9520-d20bf5e8001a.png)

## More coming soon
