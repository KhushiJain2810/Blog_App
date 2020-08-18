const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	usename: String,
	password: String
});

module.exports = mongoose.model('User_local', userSchema);