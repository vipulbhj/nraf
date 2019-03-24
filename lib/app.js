"use strict"

const http = require('http');
const url = require('url');
const path = require('path');
const typeBasedParser = require('./helper').typeBasedParser;
const {nrafReadFile, nrafRenderFile, setViewFolder: helpersViewFolder} = require('./helper');

class App {
    constructor(ecstatic) {
        this.ecstatic = ecstatic;
        this.router = [];
        this.middlewares = [];
        this.viewPath = './public';
        this.app = http.createServer((req, res) => {

            // Parsing and Logging endpoint on console.
            const URL = url.parse(req.url, true);
            // console.log(`Endpoint -> ${URL.pathname} called`);  

            // |----> For user to get parsed url in handler
            req.url = URL.pathname;
	    	req.query = URL.query;

            // Header for fun
            res.setHeader('Client', 'Not-Really-A-Framework');
            res.setHeader('Content-Type', 'text/html');
            
            // Providing some wrapper on res object for more intitutive methods.
            res.send = res.write;

            // method to set response statusCode property.
            res.setStatus = (code) => {
                res.statusCode = code;
            } 

            res.json = (obj) => {
                res.setHeader('content-type', 'application/json; charset=utf-8');
                res.write(JSON.stringify(obj));
            }

            res.redirect = (location) => {
                if(!location) {
                    throw new Error('Error: location parameter not supplied');
                }
                res.setStatus(302);
                res.setHeader('Location', location);
            }

            // send file function
            res.sendFile = (dir, file) => {
              if(!dir) dir = ecstatic;
              nrafReadFile(dir, file, (err, str) => {
                if(!err && str) {                   
                  // check if the is an html file
                  if(file.indexOf('.html') > -1 || file.indexOf('.htm') > -1) {
                    res.setHeader('Content-type', 'text/html');
                  } else if(file.indexOf('.pdf') > -1) {
                    res.setHeader('Content-type', 'application/pdf');
                  }

                  res.send(str);
                  res.end();
                } else {
                  // console.log('Error from read file', err);
                  res.send(err.toString());
                  res.end();
                }
              });
                
            }
            
            res.render = (file, data) => {
                if(!data || typeof(data) !== 'object') data = {};
                nrafRenderFile(this.viewPath, file, data, (err, str) => {
                    if(!err && str) {                   

                        res.send(str);
                        res.end();
                    } else {
                    // console.log('Error from read file', err);
                        res.send(err.toString());
                        res.end();
                    }
                });
            }

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
            
            this.middlewares.forEach(callback => {
               callback(req, res, function() {});
            });

			req.on('end',() => {
				req.body = typeBasedParser(req.headers['content-type'], dataFromReq);
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
            this.ecstatic(req, res);
        }
    }

    listen(PORT, callback) {
        this.app.listen(PORT, () => {
            console.log('\x1b[33m%s\x1b[0m',`\t#########################\n`);
            console.log('\x1b[42m%s\x1b[0m', '\tThanks for using Not-Really-A-Framework\n');
            console.log('\x1b[32m%s\x1b[0m', '\t#########################\n');
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
    
    use(callback) {
      this.middlewares.push(callback);
    }

    setView(dir) {
      this.viewPath = dir;
      helpersViewFolder(dir);
    }
}

module.exports = App;
