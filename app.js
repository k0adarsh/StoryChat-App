const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const exphbs = require('express-handlebars')
const passport = require('passport')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const connectDB = require('./config/db')

//Environment Config
dotenv.config({ path: './config/config.env' })

//Passport Config
require('./config/passport')(passport)

connectDB()        // Function run to connect to database from db.js in config

const app = express();


//Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Method OverRide

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))



//Logging 
if (process.exit.NODE_ENV === `development`) {
    app.use(morgan('dev'));
}

//Helper Functions
const { formatDate, stripTags, truncate, editIcon, select } = require('./helper')

//Express HandleBars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    }, defaultLayout: 'main', extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))



//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Setting Global Var for Logged in User
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})
//Static
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT
app.listen(PORT, console.log(`Process running in ${process.env.NODE_ENV} mode on ${PORT} `));