const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');

function isLoggedIn(req, res, next){
	if(!req.user){
		res.redirect("/login");
	} else{
		next();
	}
}

//INDEX
router.get('/blogs', isLoggedIn, (req, res)=>{
	Blog.find({}, (err, allBlogs)=>{
		if(err){
			console.log(err);
		} else{
			res.render('blogs/blogs', {blogs: allBlogs});	
		}
	});
});

//NEW
router.get('/blogs/new', isLoggedIn, (req, res)=>{
	res.render('blogs/new');
});

//CREATE
router.post('/blogs', isLoggedIn, (req, res)=>{
	req.body.blog_body = req.sanitize(req.body.blog_body);
	req.body.blog_image = req.sanitize(req.body.blog_image);
	req.body.blog_title = req.sanitize(req.body.blog_title);
	const blog = {
		title: req.body.blog_title,
		image: req.body.blog_image,
		body: req.body.blog_body,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	};
	
	Blog.create(blog, (err, newBlog)=>{
		if(err){
			console.log(err); 
		} else{
			res.redirect('/blogs');	
		}
	})
});

//SHOW
router.get('/blogs/:id', isLoggedIn, (req, res)=>{
	Blog.findById(req.params.id).populate("comments").exec((err, foundBlog)=>{
		if(err){
		console.log(err);
		} else{
			res.render('blogs/show', {blog: foundBlog});
		}
	});
});

//EDIT
router.get('/blogs/:id/edit', isLoggedIn, (req, res)=>{
	Blog.findById(req.params.id, (err, foundBlog)=>{
		if(err){
			console.log(err);
		} else{
			res.render('blogs/edit', {blog: foundBlog});		
		}
	});
});

//UPDATE
router.put('/blogs/:id', isLoggedIn, (req, res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	req.body.blog.image = req.sanitize(req.body.blog.image);
	req.body.blog.title = req.sanitize(req.body.blog.title);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
		if(err){
			console.log(err);
		} else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE
router.delete('/blogs/:id', (req, res)=>{
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		} else{
			res.redirect("/blogs");
		}
	});
});

module.exports = router;