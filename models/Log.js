const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

const logSchema = Schema({
	level : {
		type : Number
	},
	current_time : {
		type : Date,
		default : Date.now
	}
})

module.exports = mongoose.model('Log',logSchema)