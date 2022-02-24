//var models = require('../models');
var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var easysoap = require('easysoap');
var env = process.env.NODE_ENV || 'development';

var paramsSoapAuhen = {
    host   :  'http://dev-ldapservicews.ais.co.th',
    path   : '/Authenticate/authenticateservice.asmx',
    wsdl   : '/Authenticate/authenticateservice.asmx?wsdl'
};

// var name = 'username';
// var pw = 'password';
passport.use(new LocalStrategy({
        // usernameField: name,
        // passwordField: pw
    },
    function(username, password, done) {
        console.log("authen is start.");
        var user = { id : 'guest' , firstName : 'ccsm' , lastname: 'demo' };
        return done(null, user);
    }
));