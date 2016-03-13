var controller = require('./controller');

exports.register = function(server, options, next){
    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                auth: { mode: 'try' },
                handler: controller.getIndex
            }
        }, {
            method: 'GET',
            path: '/posts/{id}',
            config: {
                auth: 'session',
                handler: controller.getPost
            }
        }, {
            method: 'GET',
            path: '/posts/{id}/edit',
            config: {
                auth: 'session',
                handler: controller.postEdit
            }
        }, {
            method: 'POST',
            path: '/post/{id}/edit',
            config: {
                auth: 'session',
                handler: controller.processPostEdit
            }
        }, {
            method: 'GET',
            path: '/{path*}',
            config: {
                handler: function(request, reply){
                    reply.view('404', {
                        title: 'Total Bummer 404 Page'
                    }).code(404);
                },
                id: '404'
            }
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'base'
};