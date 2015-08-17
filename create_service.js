#!/usr/bin/env node

//creates a linux service for sl-display-server

var Service = require('node-linux').Service;


//use PORT variable passed from the shell or 7575
var port = process.env.PORT || 7575;

//get base path from shell or /display-api
var base_path = process.env.DISPLAY_API_PATH || '/display-api';

//display serial port
var display_serial_port = process.env.DISPLAY_SERIAL || '/dev/ttyUSB0';
//display baud rate
var display_serial_baud = process.env.DISPLAY_BAUD || 9600;


var svc = new Service({
    name:'sldisplay',
    description: 'The single line display api server',
    script:'/usr/local/bin/sl-display-server',
    env: [{
        name: "PORT",
        value: port
    },
    {
        name: "DISPLAY_API_PATH",
        value: base_path
    },
    {
        name: "DISPLAY_SERIAL",
        value: display_serial_port
    },
    {
        name: "DISPLAY_BAUD",
        value: display_serial_baud
    }]
});

svc.on('install', function(){
    svc.start();
    console.log('installed and started service');
    console.log('The service exists: ', svc.exists);
});

svc.on('uninstall', function(){
    console.log('uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.on('start', function(){
    console.log(svc.name + ' started!');
});

svc.on('error', function(err){
    console.log('ERROR: ', err);
});

var options_str = 'options:\t--help\n\t--install\n\t--uninstall';

if(process.argv[2] !== undefined){
    if(process.argv[2] == '--install'){
        svc.install();
    } else if(process.argv[2] == '--uninstall'){
        svc.uninstall();
    } else if(process.argv[2] == '--help'){
        console.log(options_str);
    }
} else {
    console.log(options_str);
}

