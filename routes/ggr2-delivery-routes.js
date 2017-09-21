'use strict';

module.exports = function(app) {
    var controller = require('../controllers/ggr2-delivery-controller');

    app.route('/')
        .get(controller.hello);

    app.route('/json/get')
        .get(controller.get);
};