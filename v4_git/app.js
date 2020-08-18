const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

const Blog = require("./models/blog");
const Comment = require("./models/comment");

const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const blogRoutes = require('./routes/blogs');
const profileRoutes = require('./routes/profile');

const User_local = require('./models/user-local');
const User_google = require('./models/user-google');

//CONNECT MONGOOSE
mongoose.connect(keys.mongodb.dbURI, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false,useCreateIndex: true }).then(()=>{
	console.log("Connected to DB!");
}).catch(err=>{
	console.log("ERROR:", err.message);    
});

//SET VIEW ENGINE
app.set("view engine", "ejs");

//USE PUBLIC DIRECTORY
app.use(express.static("public"));

//BODY PARSER
app.use(bodyParser.urlencoded({extended: true})); 

//METHOD OVERRIDE
app.use(methodOverride("_method"));

//SANITIZER
app.use(expressSanitizer()); 

//SESSION
app.use(require("express-session")({
	secret: "Rusty is the best and cutest dog in the world",
	resave: false,
	saveUninitialized: false
}));

passport.serializeUser((user, done)=>{
	done(null, user.id); //now go to deserializeUser
})

passport.deserializeUser((id, done)=>{
	User_google.findById(id).then((user)=>{
		done(null, user);  
	})
})

app.use(passport.initialize());
app.use(passport.session());


//LOCAL STRATEGY
// passport.use(new LocalStrategy((username, password, done)=>{
// 	User_local.findOne({username: username}, (err, user)=>{
// 		if(err){
// 			return done(err);
// 		}
// 		if(!user){
// 			return done(null, false, {message: 'Incorect username.'});
// 		}
// 		if(!user.validPassword(password)){
// 			return done(null, false, {message: 'Incorrect password.'});
// 		}
// 		return done(null, user);
// 	})
// }));

//GOOGLE OAUTH20 STRATEGY
passport.use(new GoogleStrategy({
	callbackURL: 'https://jaink2810.run-ap-south1.goorm.io/auth/google/redirect',
	clientID: keys.google.clientID,
	clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done)=>{
	// User_google.findOne({googleId: profile.id})
	User_google.findOne({googleId: profile.id}).then((currentUser)=>{
		if(currentUser){
			done(null, currentUser);
		} else{
			new User_google({
				username: profile.displayName,
				googleId: profile.id
			}).save().then((newUser)=>{
				done(null, newUser);
			})
		}
	})
}						   
));

app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	next();
});


//USE ROUTES
app.use("/", authRoutes);
app.use("/", commentRoutes);
app.use("/", blogRoutes);
app.use("/", profileRoutes);

//HOME ROUTE
app.get("/", (req, res)=>{
	res.render("home");
});

//SERVER STARTED
app.listen(3000, ()=>{
	console.log("Server is listening");
})