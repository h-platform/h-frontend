// Base routes for default index/root path, about page, 404 error pages, and others..
var config = require('config');
var controller = require('./controller');
var l = require('../../logger');

exports.register = function(server, options, next){
    server.route([
        {  
            method: 'GET',
            path: '/user/login',
            config: {
                auth: {  mode: 'try'  },
                handler: controller.loginScreen
            }
        }, {
            method: 'POST',
            path: '/user/manual',
            config: {
                auth: { mode: 'try' },
                handler: controller.loginManual
            }
        },{  
            method: 'GET',
            path: '/user/profile',
            config: {
                auth: 'session',
                handler: controller.profile
            }
        }, {
            method: ['GET', 'POST'],
            path: '/user/facebook',
            config: {
                // Use the 'facebook' auth strategy to allow bell to handle the oauth flow.
                auth: {
                    strategy: 'facebook',
                    mode: 'required'
                },
                handler: controller.loginFacebook
            }
        }, {  
            method: 'GET',
            path: '/user/logout',
            config: {
                auth: false,
                handler: controller.logout
            }
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'login'
};