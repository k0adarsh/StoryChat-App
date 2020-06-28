const express = require('express')
const passport = require('passport')
const router = express.Router()


//Auth With Google
// GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


//Google Auth Callback
// GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    })

//  Logout 
//  GET     /auth/logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router;

//ReDirect URI
//http://127.0.0.1:3000/auth/google/callback