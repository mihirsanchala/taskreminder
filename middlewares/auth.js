var express = require('express');
var auth = {};

auth.isAuthenticated = function(req, res, next){
    var sessionData = req.session;
    
    if(sessionData.email)
        next();
    else{
        res.redirect('/');
        res.end();
    }
}

module.exports = auth;
