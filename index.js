const NRAF = require('./nraf/nraf');
const app = NRAF();

const PORT = 5000;

app.get('/api', (req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html'
    });
    res.write("Home");
    res.end();
});

app.get('/api/test1', (req, res) => {
    // Request Object exposes URL parameters in the Query Object.
    if(req.query.name) {
    	res.writeHead(200, {
	    'Content-Type': 'application/json'
	});
	let jsonStr = JSON.stringify({
		name: req.query.name,
		error: false
	});
	res.write(jsonStr);
	res.end();
    } else {
    	res.writeHead(200, {
	    'Content-Type': 'text/html'
	});
	res.end("Name paramater is required");
    }
});

app.listen(PORT, () => {
    console.log('PORT:',PORT);
});
