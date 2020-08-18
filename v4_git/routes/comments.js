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

//NEW
router.get('/blogs/:id/comments/new', isLoggedIn, (req, res)=>{
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {blog: foundBlog});		
		}
	});
});

//CREATE
router.post('/blogs/:id/comments', isLoggedIn, (req, res)=>{
	req.body.comment_text = req.sanitize(req.body.comment_text);
	const comment = {
		text: req.body.comment_text,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	};
	Blog.findById(req.params.id, (err, foundBlog)=>{
		if(err){
			console.log(err);
		} else{
			Comment.create(comment, (err, newComment)=>{
			if(err){
				console.log(err); 
			} else{
				//console.log(newComment);
				foundBlog.comments.push(newComment._id);
				foundBlog.save();
				res.redirect('/blogs/'+req.params.id);	
			}
		});
		}
	});
	
});

//EDIT
router.get('/blogs/:id/comments/:comment_id/edit', isLoggedIn, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			console.log(err);
		} else{
			res.render('comments/edit', {blog_id: req.params.id, comment: foundComment});		
		}
	});
});

//UPDATE
router.put('/blogs/:id/comments/:comment_id', isLoggedIn, (req, res)=>{
	req.body.comment.text = req.sanitize(req.body.comment.text);
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
		if(err){
			console.log(err);
		} else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE
router.delete('/blogs/:id/comments/:comment_id', isLoggedIn, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
		} else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

module.exports = router;