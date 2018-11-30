const http = require('http');
const path = require('path');
const url = require('url');
const ecstatic = require('ecstatic')({
	root: path.join(__dirname,'/public'),
	showDir: false,
	autoIndex: true,
});

// All the routes are defined here.
const router = [
	{	
		'url': '/',
		'fn': (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("Home");
            res.end();
        }
    },
    {	
		'url': '/about',
		'fn': (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("About");
            res.end();
        }
    },
    {	
		'url': '/contact',
		'fn': (req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("Contact");
            res.end();
        }
	},
]

// Used to match route and return a function that is match else return default function.
function match(router, url) {
	for(let obj of router) {
		if(obj['url'] === url) {
			return obj['fn'];
		}
	}
	return (req, res) => {
		ecstatic(req, res);
	}
} 


const PORT = process.env.PORT || 5000;

const app = http.createServer((req, res) => {
    // This parses req.url and converts it into standard form.
    console.log(`Url from req.url = ${req.url}`);
    console.log(`Url after parsing = ${url.parse(req.url).toString()}`);
    // Pathname points to the end point which we need to use.
    const URL = url.parse(req.url, true).pathname;
    let m = match(router, URL);
    m(req, res);
});


app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});