let express = require('express');
let app = express();
let port = process.env.PORT || 8080;

let cookieParser = require('cookie-parser');
let session = require('express-session');
let morgan = require('morgan');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let passport = require('passport');
let flash = require('connect-flash');
let MongoStore = require('connect-mongo')(session);


mongoose.connect('localhost:27017/oauth');
require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true,
				 store: new MongoStore({ mongooseConnection: mongoose.connection,
				 							ttl: 2 * 24 * 60 * 60 })}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs');

let api = express.Router();
require('./app/routes/api.js')(api, passport);
app.use('/api', api);

let auth = express.Router();
require('./app/routes/auth.js')(auth, passport);
app.use('/auth', auth);

let secure = express.Router();
require('./app/routes/secure.js')(secure, passport);
app.use('/', secure);


app.listen(port);
console.log('Server running on port: ' + port);
