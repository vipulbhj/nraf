const NRAF = require('./nraf/nraf');
const app = NRAF();

const PORT = 5000;

app.get('/', (req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/html'
    });
    res.write("Home");
    res.end();
});

app.listen(PORT, () => {
    console.log('PORT:',PORT);
});