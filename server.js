var connect = require('connect');

connect.createServer(
	connect.static("../OperationNightlife")
).listen(5000);
console.log("Connected on port 5000.");
