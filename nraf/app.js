const http = require('http');   
const url = require('url');
const path = require('path');
const ecstatic = require('ecstatic')({
	root: path.join(__dirname,'../public'),
	showDir: false,
	autoIndex: true,
});

class App {
    constructor() {
        this.router = [];
        this.app = http.createServer((req, res) => {
            
            // Parsing and Logging endpoint on console.
            const URL = url.parse(req.url, true).pathname;
            console.log(`Endpoint -> ${URL} called`);

            // Adding Headers and modifying req and response object
            // |----> For user to get parsed url in handler
            req.url = URL;
            
            // Header for fun
            res.setHeader('Client', 'Not-Really-A-Framework');
            res.setHeader('charset', 'utf-8');
            
            // Matching and Routing
            let m = this.match(this.router, URL);
            m(req, res);
        });
    }

    match(router, url) {
        for(let obj of router) {
            if(obj['url'] === url) {
                return obj['fn'];
            }
        }
        return (req, res) => {
            ecstatic(req, res);
        }
    } 

    listen(PORT, callback) {
        this.app.listen(PORT, () => {
            console.log(`\t#########################\n`);
            console.log('\tThanks for using Not-Really-A-Framework\n');
            console.log('\t#########################\n');
            callback();
        });
    }

    get(endpoint, fnx) {
        const routeObj = {	
            'url': endpoint,
            'fn': (req, res) => {
                fnx(req, res);
            }
        }
        this.router.push(routeObj);
    }
}

module.exports = App;