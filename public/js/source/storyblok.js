storyblok.init();

storyblok.on('change', function() {
    window.location.reload(true);
});

storyblok.on('published', function() {
    $.ajax({
    url: '/clear_cache'
    })
    .done(function() {
    console.log('cache cleared!');
    })
    .fail(function() {
    console.log('error clearing cache');
    });
});