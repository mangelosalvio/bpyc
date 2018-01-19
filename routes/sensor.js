var express = require('express')
var router = express.Router()
const Log = require('../models/Log')
var moment = require('moment')

router.post('/', (req, res, next) => {

	const log = new Log({
		'level' : req.body.lvl
	}).save()
	.then( (data) => {
		console.log(data)

		var l = "<li class='list-group-item'>" +  moment(data.current_time).format("LLL") + "<br><b> Level " + data.level + "</b></li>";
		req.io.sockets.emit('data',l);

		/*const logs = Log.find({}).sort({ current_time : 'desc' }).exec().then((logs) => {
			req.io.sockets.emit('data',{ 'lvl' : req.body.lvl })
		}, (err) => {
			throw err
		})*/

	} , (err) => {

	} )


	req.io.sockets.emit('lvl',{ 'lvl' : req.body.lvl })
	res.send({ 'status' : 'success' , 'data' : 'ok' })
})

module.exports = router