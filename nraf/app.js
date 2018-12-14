"use strict"

const http = require('http');   
const url = require('url');
const path = require('path');
const typeBasedParser = require('./helper');
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
            const URL = url.parse(req.url, true);
            console.log(`Endpoint -> ${URL.pathname} called`);

            // |----> For user to get parsed url in handler
            req.url = URL.pathname;
	    	req.query = URL.query;
            
            // Header for fun
            res.setHeader('Client', 'Not-Really-A-Framework');
            res.setHeader('content-type', 'application/json; charset=utf-8')
           
			// Collect data from POST stream and assign it in body of request Object.
			let dataFromReq = null;
			req.on('data', (chunk) => {
			// Condition to check if data is being recieved or not.
				if(!dataFromReq) {
					dataFromReq = chunk.toString();
					return;
				}
				dataFromReq += chunk.toString();
			});

			req.on('end',() => {
				req.body = typeBasedParser(req.headers['content-type'],dataFromReq);
				// Matching and Routing
            	let m = this.match(this.router, URL.pathname, req.method);
            	m(req, res);
			});
        });
    }

    match(router, url, method) {
        for(let obj of router) {
            if(obj['url'] === url && obj['method'] === method.toUpperCase()) {
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
            },
			"method": "GET"
        }
        this.router.push(routeObj);
    }

	post(endpoint, fxn) {
		const routeObj = {
			'url': endpoint,
			'fn': (req, res) => {
					fxn(req, res);
				},
			'method': "POST"
		}
		this.router.push(routeObj);
	}
}

module.exports = App;
