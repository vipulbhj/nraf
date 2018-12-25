const nraf = require('../');
const staticFilePath = __dirname + '/public';
const app = nraf(staticFilePath);

const PORT = 5000;

// This route demonstrates construction of get endpoint.
app.get('/docs', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`<h3>Docs Page</h3>`);
    res.end();
});

// Parameters passed in GET requests are available in the query object on the req object.
app.get('/yourname', (req, res) => {
     res.writeHead(200, {'Content-Type': 'text/html'});
    // req.query.name is accessing the name parameter passed by user.
    const htmlResponse = `
        <h3>Your name is ${req.query.name || 'Unknown. Please try playing first'} </h3>
        <form action='/yourname'>
            <input name="name" placeholder="Enter your name here" />
            <input type="submit" value="GO !"/>
        </form>
    `;
    res.write(htmlResponse);
    res.end();
});

app.get('/login', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    const htmlResponse = `
        <!-- USERNAME:- abc, password:- 123 --!>
        <h3>Login Form</h3>
        <h5> You will find the password, if you know where to look :) :p </h5>
        <p>${req.query.loginError === 'true' ? 'Error Logging in. Wrong Username or Password': ''}</p> <br />
        <form action='/login' method="POST">
            <input name="username" placeholder="Enter your username here" /> <br />
            <input type="password" name="password" placeholder="Enter your password here" /> <br />
            <input type="submit" value="GO !"/>
        </form>
    `;
    res.write(htmlResponse);
    res.end();
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username === 'abc' && password === '123') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("Nailed it, You are a <strong>pro SIR</strong>!!!!!!");
    } else {
        res.writeHead(302, {'Location': '/login?loginError=true'});
        res.end();
    }
});



app.listen(PORT, () => {
    console.log('PORT:',PORT);
});
