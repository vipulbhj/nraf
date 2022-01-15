# quick start

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

If this is a brand new project, make sure to create a `package.json` first with the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
npm install @nraf/core
```

The above command installs the `@nraf/core` and the `@nraf/nte` templating engine packages.

## Directory Setup

Create 2 directories `views` and `public` and an `index.js` file in the root of the project. Or use the following command:

```bash
mkdir views
mkdir public
touch index.js
```

`views` directory would contain the `.nraf` template files.

`public` directory would contain static files such as CSS, favicon, etc.

## Running the project

Paste the following code in the `index.js` file at the root of your project.

```javascript
const path = require("path");
const NRAF = require("@nraf/core");

const app = NRAF();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
```

In the above code, we:

- Import the necessary packages.
- Set the directory paths for the `views` and `public` directories.
- Create a route which responds with `Hello World`.

NOTE: You must set the “views” & “public” directory path explicitly in your app. For more details, [read this](https://github.com/vipulbhj/vipulbhj/blob/main/blogs/LearningsWhileBuildingNRAF/TheCuriousCaseOfResDotRender/README.md).

Run the following command in the terminal:

```bash
node index.js
```

You must see the following output in the terminal:

![Terminal Output](https://user-images.githubusercontent.com/63957920/149618238-a2244e9c-d750-47e1-aa86-0f1415768643.png)

View the website at: [http://localhost:3000](http://localhost:3000/)

You will see the Hello World text on the page:

![Webpage Output](https://user-images.githubusercontent.com/63957920/149618243-4b795edf-71a7-42da-9520-d20bf5e8001a.png)

## Examples

To view the examples, clone the nraf repo and install the dependencies:

```bash
git clone git@github.com:vipulbhj/nraf.git
cd nraf
npm install
```

Then run whichever example you want:

```bash
node examples/Todo/index.js
```
