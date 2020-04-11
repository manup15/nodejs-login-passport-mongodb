const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//2. save the saved user in a session
passport.serializeUser((user, done) => {
    done(null, user.id)
})

//3. find the user on new pages
passport.deserializeUser(async (id, done) => {
      const user = await User.findById(id)
      done(null, user)
})

//1. create new user
const User = require('../models/user')

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await User.findOne({ email: email })

    if ( user ) {
        console.log('encuentra usuario'.blue)
        
        return done(null, false, req.flash('signupMessage','Email alredy exist'))
    } else {
        const newUser = new User
        newUser.email = email
        newUser.password = newUser.encryptPassword(password)
        await newUser.save()
        done(null, newUser)
    }

}))

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},async (req, email, password, done) => {

    const user = await User.findOne({ email: email })

    if( !user ) {
        return done (null, false, req.flash('signinMessage', 'Not found user'))
    }

    if (!user.comparePassword(password)) {
        return done (null, false, req.flash('signinMessage', 'Incorrect password'))
    }
    
    return done(null, user)
}))
