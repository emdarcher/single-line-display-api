#!/usr/bin/env node

var restify = require('restify');


var server = restify.createServer({
    name: 'display-api',
    version: '1.0.0'
});

//setup parsers
server.use(restify.bodyParser());
server.use(restify.acceptParser(server.acceptable));

//special handling for request from curl client
server.pre(restify.pre.userAgentConnection());

//use PORT variable passed from the shell or 7575
var port = process.env.PORT || 7575;

//get base path from shell or /display-api
var base_path = process.env.DISPLAY_API_PATH || '/display-api';

//display serial port
var display_serial_port = process.env.DISPLAY_SERIAL || '/dev/ttyUSB0';
//display baud rate
var display_serial_baud = process.env.DISPLAY_BAUD || 9600;

var display_options = {
    port: display_serial_port,
    baud: display_serial_baud 
};

var display = require('./routes/display');

//welcome/test route
server.get(base_path + '/', function(req,res,next){
    res.json({ message: "welcome to the Display API!" });
    return next();
});

server.get(base_path + '/display', display.getDisplay );
server.put(base_path + '/display', display.putDisplay );

//setup server
server.listen(port, function(){
    console.log('listening on port ' + port);
    //init the display
    display.initDisplay(display_options, function(err){
        if(err) throw err;
        console.log('done initializing');
    });
});

