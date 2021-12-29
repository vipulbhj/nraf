The `index.nraf` files contains the template code which will be used at the base fof generating the final output.

`index.js` files acts as the entry point and imports the Template Engine.

We read the template data as string and pass it to the template engine for compilation. Once the template is compiled, it can be used to render any number of data objects.

we do that by using the `render` method and passing the data object as it's argument.
