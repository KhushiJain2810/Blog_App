const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
	title: String,
	image: String,
	body: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User_google"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model('Blog', blogSchema);