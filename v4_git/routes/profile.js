const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

function isLoggedIn(req, res, next){
	if(!req.user){
		res.redirect("/login");
	} else{
		next();
	}
}

router.get('/profile', isLoggedIn, (req, res)=>{
	Blog.find({'author.id': req.user._id}, (err, foundBlogs)=>{
		res.render('profile', {blogs: foundBlogs});
	});
});

module.exports = router;