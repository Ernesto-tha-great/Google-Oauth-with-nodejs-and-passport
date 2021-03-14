const express = require('express');
const app = express();
const sessions = require('express-session')

//setting templating engine
app.set('view engine', 'ejs')

//express sessions
app.use(sessions({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}))

app.get('/', (req, res) => {
    res.render('pages/auth')
});

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`server is currently running ${port}`))

//passport setup
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("Sorry.There was an error signing you in"))

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
})


// google auth
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = 'your-google-client-id'
const GOOGLE_CLIENT_SECRET = 'your-google-client-secret';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},

function (accessToken, refreshToken, profile,done) {
    userProfile = profile;
    return done(null,userProfile);
}

));

app.get('/auth/google', 
    passport.authenticate('google', {scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/error'}),
    (req, res) => {
        //successful authhentication,redirect success.

        res.redirect('/success')
    });