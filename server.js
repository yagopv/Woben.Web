//*********************//
// Module dependencies //
//*********************//

var express = require('express')
    , routes = require('./routes/routes')
    , http = require('http')
    , path = require('path');

var app = express();

//*******************************//
// Settings for all environments //
//*******************************//

//Using  HTML templates
app.engine('.html', require('ejs').__express);

// Set port
app.set('port', process.env.PORT || 3000);

// Set views path and engine
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Set favicon
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// Static files configuration (js, css ...)
app.use(express.static(path.join(__dirname, 'public')));

// Router set
app.use(app.router);


//************************************//
//Settings for development environment//
//************************************//

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

if (app.get('env') === 'production') {
    // TODO
}

//*********//
// Routing //
//*********//

if ('development' == app.get('env')) {
    app.get('/dashboard', routes.dashboardTest);
    app.get('/dashboard/*', routes.dashboardTest);
    app.get('*', routes.indexTest);
} else {
    app.get('/dashboard', routes.dashboard);
    app.get('/dashboard/*', routes.dashboard);
    app.get('*', routes.index);
}

//***************//
// Create server //
//***************//

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});