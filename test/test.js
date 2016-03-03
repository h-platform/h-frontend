var seneca = require('seneca')();
var client = seneca.client();

// client.act({ role:'database', model: 'post', cmd:'getRecord', view: 'complete', id:2 }, function (err, results) {
//     console.log(results);
// });

// client.act({ role:'database', model: 'post', cmd:'getAll'}, function (err, results) {
//     console.log(results);
// });

// client.act({ role:'database', model: 'post', cmd:'getRecord', id:2 }, function (err, results) {
//     console.log(results);
// });

client.act({role:'database', model: 'region', cmd:'query', view: 'locality', locality_path:'1.1'}, function (err, results) {
    console.log(results);
});