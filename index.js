'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const url = require('url');
const app = express();
const StoryblokClient = require('storyblok-js-client');
const helpers = require('./helpers');

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: 'views/components/',
  helpers: helpers
}));

app.set('view engine', '.hbs');
app.set('views', 'views');

let Storyblok = new StoryblokClient({
  accessToken: 'Ss3c7ksK7xEy9NMHBIF6pAtt'
});

Storyblok.get(`links`).then((response) => {
  global.storylinks = response.body.links
});


app.get('/clear_cache', function(req, res) {
  Storyblok.flushCache();
  res.send('Cache flushed!');
});

app.use('/public', express.static('public'));

//app.get('/*', auth.connect(basic), function(req, res) {
app.get('/*', function(req, res) {
  var path = url.parse(req.url).pathname;
  path = path == '/' ? 'home' : path;

  Storyblok
    .get(`stories/global`, {
      version: req.query._storyblok ? 'draft': 'published'
    })
    .then((globalResponse) => {
      let globalData = globalResponse.body.story.content;

      Storyblok
        .get(`stories/${path}`, {
          version: req.query._storyblok ? 'draft': 'published'
        })

        .then((response) => {
          res.render(response.body.story.content.component, {
            story: response.body.story,
            global: globalData
          });
        })

        .catch((error) => {
          res.send(error);
        });

      })
  
    .catch((error) => {
      res.send(error);
    });
});


app.listen(4300, function() {
  console.log('Running on port 4300!');
});
