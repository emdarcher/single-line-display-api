//display routes

var SerialPort = require("serialport").SerialPort;
var serialPort;

var display_data = {
    displayString: " ",
    textColor: 'orange',
    textFont: 'default'   
};

var fonts = {
    'default':      "\s",
    '7by6':         "\s",
    'short':        "\q",
    'shortAndWide': "\\r",
    'wide':         "\\t",
    '7by9':         "\u",
    'extraWide':    "\v",
    'small':        "\w"
};


var effects = {
    'immediate':"\rB\c"
};

var colors = {
    'red':          "\a",
    'brightRed':    "\b",
    'orange':       "\c",
    'brightOrange': "\d",
    'yellow':       "\e",
    'brightYellow': "\f",
    'green':        "\g",
    'brightGreen':  "\h",
    'layerMix':     "\i",
    'brightLayerMix':"\j",
    'verticalMix':  "\k",
    'sawtoothMix':  "\l",
    'greenOnRed':   "\m",
    'redOnGreen':   "\\n",
    'orangeOnRed':  "\o",
    'yellowOnGreen':"\p"
};

function writeDisplay(data, cb) {
    var outStr = "";
    outStr += "~128"; //code number 128
    outStr += "~f01"; //file 01
    outStr += effects['immediate']; //immediate effect
    outStr += fonts[data.textFont]; //font
    outStr += colors[data.textColor]; //color
    outStr += data.displayString; //the string to display
    outStr += '\r\r\r'; //ending
    serialPort.write(outStr, function(err){
        return cb(err); 
    });
}

exports.initDisplay = function(options, cb){
    var error = false;
    serialPort = new SerialPort(options.port, {
        baudrate: options.baud
    }, function(err){
        if(err) error = err;
        return cb(error); 
    });
    //cb(error);
};

exports.getDisplay = function(req, res, next){
    res.json(display_data);
    return next();
};

exports.putDisplay = function(req, res, next){
    if(req.params.displayString !== undefined){
        display_data.displayString = req.params.displayString;
    }
    if(req.params.textColor !== undefined){
        display_data.textColor = req.params.textColor;
    }
    if(req.params.textFont !== undefined){
        display_data.textFont = req.params.textFont;
    }
    writeDisplay(display_data, function(err){
        next.ifError(err);
        res.json(200);
        return next();
    });
    
};

