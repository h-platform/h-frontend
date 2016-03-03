// Base routes for default index/root path, about page, 404 error pages, and others..
var seneca = require('seneca')();
var client = seneca.client();

exports.register = function(server, options, next){


    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                handler: function(request, reply){
                    // Set Default Queue
                    if(!request.query.queue_id) {
                        request.query.queue_id = 1;
                    }

                    client.act({ role:'database', model: 'queue', cmd:'queryRecords', view: 'with_post_counts' }, function (err, result) {
                        client.act({ role:'database', model: 'post', cmd:'queryRecords', where: [{col:'queue_id' , op: '=', val: request.query.queue_id}] }, function (err, result2) {
                            console.log(result2.records);
                            reply.view('index', {
                                active_queue: request.query.queue_id,
                                queue_list: result.records,
                                post_list: result2.records
                            });
                        });
                    });
                },
                id: 'index'
            }
        }, {
            method: 'GET',
            path: '/posts/{id}',
            config: {
                handler: function(request, reply){
                    console.log(request.params);
                    client.act({ role:'database', model: 'queue', cmd:'queryRecords', view: 'with_post_counts' }, function (err, result) {
                        var tray = {
                            queue_list: result.records,
                            post_id: request.params.id
                        };
                        client.act({ role:'database', model: 'post', cmd:'getRecord', id: tray.post_id}, function (err, result2) {
                            var tray2 = tray;
                            tray2.post = result2.record;
                            tray2.active_queue = result2.record.queue_id;

                            client.act({ role:'database', model: 'comment', cmd:'queryRecords', where: [{col: 'post_id', op: '=', val:request.params.id}] }, function (err, result3) {
                                tray2.comment_list = result3.records;
                                reply.view('post', tray2);
                            });
                        });
                    });
                },
                id: 'post'
            }
        }, {
            method: 'GET',
            path: '/post_edit',
            config: {
                handler: function(request, reply){
                    //Call Microservice
                    client.act({ role:'database', model: 'region', cmd:'queryRecords', view: 'quarter', locality_path: request.params.locality_path }, function (err, result) {
                        reply.view('post_new', {
                            queue: {},
                            status: result.records
                        });
                    });
                },
                id: 'post_edit'
            }
        }, {
            method: 'POST',
            path: '/post_edit',
            config: {
                handler: function(request, reply){
                    request.payload.entity_type_id = 1; //post type
                    request.payload.category_id = 1; //land category
                    request.payload.area_unit = "م.م."; //area unit
                    // console.log(request.payload);
                    client.act({ role:'database', model: 'post', cmd:'saveRecord', record: request.payload}, function (err, results) {
                        if(err) {
                            console.log('**************');
                            console.log(err.details.orig$);
                            console.log('**************');
                            reply.view('500',{msg: ''});
                        } else {
                            // console.log(results);
                            reply.redirect('/posts/' + results.record.id);
                        }
                    });
                },
                id: 'post_edit_submit'
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