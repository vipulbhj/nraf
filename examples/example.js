/**
 * import nraf into your application.
 * If using in an npm project, you will download the latest version by doing 
 *  - npm install nraf --save
 * and then replace the "../" with "nraf"
 */
const nraf = require('../');
/**
 * staticFilePath is exactly what it sounds like, it the absolute path to the directory where your static
 * resources are placed.
 */
const staticFilePath = __dirname + '/public';
/**
 * app - It is the actual app object that we will interact with for our application.
 * It has one parameter which is optional. 
 * The parameter is the absolute path of static resources.
 * It has basically two modes:-
 *  - If paramter is passed, for an undefined route(one which we haven't defined on this app object)
 *      it will check your public directory and server the file if found or will give 
 *      "no such file found" message.
 *  - If no parameter, it simply logs back the url in json format as a response.
 */
const app = nraf(staticFilePath);

// PORT on which the server will run.
const PORT = 5000;

app.use(function(req, res, next) {
  console.log('Hello I am a middleware');
  console.log(req.headers);
  next();  
});

// Trying html static files
app.get('/home', (req, res) => {
   res.sendFile(staticFilePath, 'index.html');
});

// Trying render static files
app.get('/homerender', (req, res) => {
   res.render(staticFilePath, 'index', {title: 'I love u'});
});

// Trying pdf static files
app.get('/pdf', (req, res) => {
   res.sendFile(staticFilePath, 'trial.pdf');
});

// This route demonstrates construction of "GET" endpoint.
app.get('/docs', (req, res) => {
    // send method is used to send text/html data. 
    res.send(`<h3>Docs Page</h3>`);
    // end method ends the responses and sends it out to the client.
    res.end();
});

app.get('/json-example', (req, res) => {
    // json method is used to send json/application data back to client. 
    // Ideal usecase on REST API design.
    const obj = {
        name: "Not Really Framework",
        author: "Vipul Bhardwaj",
        github: "https://github.com/vipulbhj"
    };
    res.json(obj);
    res.end();
});

// Parameters passed in GET requests are available in the query object on the req object.
app.get('/yourname', (req, res) => {
    res.setStatus(200);
    // req.query.name is accessing the name parameter passed by user.
    const htmlResponse = `
        <h3>Your name is ${req.query.name || 'Unknown. Please try playing first'} </h3>
        <form action='/yourname'>
            <input name="name" placeholder="Enter your name here" />
            <input type="submit" value="GO !"/>
        </form>
    `;
    res.send(htmlResponse);
    res.end();
});

app.get('/login', (req, res) => {
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
    res.send(htmlResponse);
    res.end();
});

// Demonstartes POST route.
app.post('/login', (req, res) => {
    // req.body object holds all the parameters passed in with "POST" request
    const username = req.body.username;
    console.log(typeof username);
    const password = req.body.password;
    if(username === 'abc' && password === '123') {
        // non-json type data could also be directly passed to the end method.
        res.end("Nailed it, You are a <strong>pro SIR</strong>!!!!!!");
    } else {
        // redirect takes one parameter which is the location where redirection takes place.
        res.redirect('/login?loginError=true');
        res.end();
    }
});


// Starts the server on PORT(specified above) and callback function which is called when the server has stared.
app.listen(PORT, () => {
    console.log('PORT:',PORT);
});
