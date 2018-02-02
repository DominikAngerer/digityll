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

// added "cdn/" infront off the API paths
Storyblok.get(`cdn/links`).then((response) => {
  global.storylinks = response.data.links
}).catch((error) => {  // <-- mnissing catch 
  // res.send(error);
  console.log( error.stack );
});;


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
    .get(`cdn/stories/global`, {
      version: req.query._storyblok ? 'draft': 'published'
    })
    .then((globalResponse) => {
      let globalData = globalResponse.data.story.content;

      Storyblok
        .get(`cdn/stories/${path}`, {
          version: req.query._storyblok ? 'draft': 'published'
        })

        .then((response) => {
          res.render(response.data.story.content.component, {
            story: response.data.story,
            global: globalData
          });
        })

        .catch((error) => {
          // res.send(error);
          console.log( error.stack );
        });

      })
  
    .catch((error) => {
      // res.send(error);
      console.log( error.stack );
    });
});


app.listen(4300, function() {
  console.log('Running on port 4300!');
});
