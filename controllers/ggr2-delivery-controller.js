'use strict';

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var _ = require('lodash');

exports.hello = function(req, res) {
    var data = { message: 'hello world' }
    res.json(data);
};

exports.get = function(req, res) {
    var doc = new GoogleSpreadsheet('1Xy3xvZkNc9OJkPx1R2cWKjAX8gQn0aHgDqvDdhN2enk');
    var sheet;
    
    var generateModel = function(name, color, date) {
        return {
            name: name,
            color: color,
            date: date
        };
    };
    
    async.waterfall([
        function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
                console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                sheet = info.worksheets[0];
                console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
                step();
            });
        },
        function workingWithRows(step) {
            // google provides some query options
            sheet.getRows({
                offset: 1,
                limit: 50
            }, function( err, rows ) {
                console.log('Read ' + rows.length + ' rows');

                step(null, rows.length);
            });
        },
        function workingWithCells(row_length, step) {
            sheet.getCells({
                'min-row': 1,
                'max-row': row_length + 1,
                'return-empty': true
            }, function(err, cells) {
                var models = [];
                var model = generateModel('', '', '');
                var lastRowIndex = 1;

                _.forEach(cells, function(cell) {
                    console.log('Cell R' + cell.row + 'C' + cell.col + ' = ' + cell.value);
                    if (cell.row > lastRowIndex && cell.row > 2) {
                        models.push(model);
                        lastRowIndex = cell.row;

                        model = generateModel('', '', '');
                    }

                    if (cell.col == 1) {
                        model.name = cell.value;
                    } else if (cell.col == 2) {
                        model.color = cell.value;
                    } else if (cell.col == 3) {
                        model.date = cell.value;
                    }
                });

                models.push(model);

                step(null, models);
            });
        }, function output(models, step) {
            console.log('output...');
            
            res.header('Content-Type', 'application/json');

            res.json(models);
        }
    ],
    function(err) {
        if (err) {
            console.log('Error: ' + err);
        }
    });
};