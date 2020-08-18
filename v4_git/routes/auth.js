const express = require('express');
const router = express.Router();
const passport = require('passport');


//LOCAL-SIGNUP ROUTE
router.get('/register', (req, res)=>{
	res.render("register");
});

router.post('/register', (req, res)=>{
	
});

//LOCAL-LOGIN ROUTE
router.get('/login', (req, res)=>{
	res.render("login");
});

router.post('/login', (req, res)=>{
	
});

//GOOGLE LOGIN ROUTE
router.get("/auth/google", passport.authenticate('google', {
	scope: ['profile']
}));
		   
router.get("/auth/google/redirect", passport.authenticate('google'), (req, res)=>{
	res.redirect('/blogs');
});

//LOGOUT
router.get("/logout", (req, res)=>{
	req.logout();
	res.redirect("/");
});


module.exports = router;