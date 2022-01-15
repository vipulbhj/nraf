# template engine

A ***template engine*** enables you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This approach makes it easier to design an HTML page.

This is  `@nraf/nte` template language specification:

# NRAF Template Language Specification:

## Variable:

A variable looks up a value from the template context. If you wanted to simply display a variable, you would do:

```html
{{ variable_name }}
```

## for:

`for` iterates over arrays. Here, `items` is a JavaScript array:

```html
<ul>
{% for item in items %}
	<li>{{ item }}</li>
{% endfor %}
</ul>
```

The above example lists all the items in the `items` array.

You can also get the array `index` of an item:

```html
<ul>
{% for index item in items %}
	<li>{{ index }}: {{ item }}</li>
{% endfor %}
</ul>
```

## if:

`if` tests a condition and lets you selectively display content. It behaves exactly as JavaScript’s `if` behaves.

```html
{% if variable %}
  It is true
{% endif %}
```

If variable is defined and evaluates to true, "It is true" will be displayed. Otherwise, nothing will be.

You can specify alternate conditions with `elif` and `else`:

```html
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

## Comments:

You can write comments using `{#` and `#}`. Comments are completely stripped out when rendering.

```html
{# Loop through all the users #}
{% for user in users %}...{% endfor %}
```