'use strict';

var express = require('express'),
pg = require('pg'),
db_url = process.env.DATABASE_URL || 'postgres://localhost:5432/animals';
var router = express.Router();

router.get('/', function(req, res){
  pg.connect(db_url, function(err, client, done){
    done();
    if (err){
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM kittens', function(err, data){
      if (err){
        return (console.error('error retrieving from database', err));
      }
      console.log(data);
      res.render('kittens/index', {kittens: data.rows});
    });
  });
});

router.get('/new', function(req, res){
  res.render('kittens/new');
});


module.exports = router;
