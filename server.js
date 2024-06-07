var express = require('express');
var app = express();
// încărcăm dependențele
const session = require('express-session');
const formidable = require('formidable');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (like your HTML form)

// setăm engine-ul ejs
app.set('view engine', 'ejs');
app.use('/src', express.static('src'));

// creăm o sesiune
app.use(session({
   secret: 'abcdefg',
   resave: true,
   saveUninitialized: false,
}));

app.post('/submit', (req, res) => {
    const data = req.body;

    // Read existing data from answers.json, if the file exists
    fs.readFile('answers.json', 'utf8', (err, fileData) => {
        let json = [];

        if (!err) {
            json = JSON.parse(fileData);
        }

        json.push(data);

        fs.writeFile('answers.json', JSON.stringify(json, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).send('Data received and saved');
            }
        });
    });
});



// funcție care caută username-ul și parola
// în fișierul users.json
function verifica (username, pass) {
    if (fs.existsSync("users.json")){
      var date = fs.readFileSync("users.json");
      ob = JSON.parse(date);
      console.log(username);
      console.log(pass);

      for (i in ob) {
      console.log(ob[i]);
      if (ob[i].username == username)
         if (ob[i].parola == pass) 
         return username;
      }
    }
return false;
}

// la completarea formularului de login
// verificăm datele introduse de utilizator
// setăm câmpul de sesiune username 
// și facem redirecturi corespunzătoare
app.post('/login', function(req, res) {
   var form = new formidable.IncomingForm();
   form.parse(req, function(err, fields, files) {
      console.log("Username:", fields.username); // tot debugging
      console.log("Password:", fields.password);
       let user = verifica(fields.username, fields.password);
       // verificarea datelor de login
      if(user){
         console.log("REUSIT"); // pt debug
        req.session.username = user; 
        // setez userul ca proprietate a sesiunii
        res.redirect('/logat'); 
     }
   else {
      console.log("EROARE"); // pt debug
      req.session.username = false;  
   }
   });
});

// dacă utilizatorul s-a logat, încărcăm pagina
// și afișăm un buton pentru logout
app.get('/logat', function(req, res) {
   res.render('pagini/index.ejs', {'nume':req.session.username});
});

app.get('/index', function(req, res) {
   res.render('pagini/index.ejs');
});

app.get('/contact', function(req, res)  {
   res.render('pagini/contact.ejs');
});

app.get('/ludo', function(req, res)  {
   res.render('pagini/ludo.ejs');
});

app.get('/modes', function(req, res)  {
   res.render('pagini/modes.ejs');
});

app.get('/motivation', function(req, res)  {
   res.render('pagini/motivation.ejs');
});

app.get('/rules', function(req, res) {
   res.render('pagini/rules.ejs');
});

// la vizitarea home, încărcăm pagina de login
app.get('/', function(req, res) {
   res.render('pagini/login.ejs');
});

// dacă am dat click pe linkul 'logout',
// scoatem utilizatorul din sesiune și 
// facem redirect către pagina inițială de login
app.get('/logout', function(req, res) {
   req.session.username = false;
   console.log('logged out');
   res.redirect('/');
});

// serverul ascultă pe portul dat, 5000
app.listen(5000); 
