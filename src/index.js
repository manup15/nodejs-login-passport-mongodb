const express = require('express')
const colors = require('colors')
const engine = require('ejs-mate')
const path = require('path')
const routes = require('./routes/index')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')

//Initializations
const app = express()
require('./database')
require('./passport/local-auth')

//settings
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000)

//middlewares
app.use(morgan('dev'))
//use express.urlencoded to indicagte to exprees that we will recibe data from client side
//use extended: false to say that we will not recibe images or files
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage')
    app.locals.signinMessage = req.flash('signinMessage')
    app.locals.user = req.user
    console.log(app.locals);
    
    next()
})

//Routes
app.use('/', routes)

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server running on port: ', app.get('port') );    
})




