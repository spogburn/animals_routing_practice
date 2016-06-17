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
        return console.error('error retrieving from database', err);
      }
      console.log(data);
      res.render('kittens/index', {kittens: data.rows});
    });
  });
});

router.get('/new', function(req, res){
  res.render('kittens/new');
});

router.get('/:id', function(req, res){
  pg.connect(db_url, function(err, client, done){
    done();
    if (err){
      return console.error('error fetching', err);
    }
    client.query('SELECT * FROM kittens WHERE id = $1', [req.params.id], function(err, data){
      if(err){
        return console.error('error retrieving from database', err);
      }
      var kitten = data.rows[0];// selects the data you got which is the first item in the rows array
      if (!kitten){
        res.redirect('/kittens');
      }
      res.render('kittens/show', {kitten: kitten}) // go to the kittens show page and the data it has access to is kitten
    })
  })
})

router.get('/:id/edit', function(req, res){
  // connects to pg database with the specified url
  pg.connect(db_url, function (err, client, done){
    done();
    if (err){
      return console.error('error fetching', err);
    }
    client.query('SELECT * FROM kittens WHERE id = $1', [req.params.id], function(err, data){
      if (err){
        console.error('error retrieving from database', err);
      }
      var kitten = data.rows[0];
      if (!kitten){
        res.redirect('/puppies');
      }
      res.render('kittens/edit', {kitten: kitten})
    })
  })
})

module.exports = router;
