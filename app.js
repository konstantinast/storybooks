const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Load models
require('./models/User');
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Load Keys
const keys = require('./config/keys');

// Mongoose Connect
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: require('./helpers/hbs'),
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    
    // For template
    const date = new Date();
    res.locals.date = {
        year: date.getUTCFullYear()
    };
    
    next();
});

// Routes must be defined after session or you will get
//  "Unhandled promise rejection (rejection id: 1): Error: passport.initialize() middleware not in use"
// based on this https://stackoverflow.com/a/16781554/1597960

// Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server starte on port ${port}`);
});