var express = require('express');
var request = require('request');

/*
 * GET home page.
 */

var app = express();

exports.dashboard = function(req, res){
    res.render('dashboard', { title: 'Woben - Dashboard' });
}

exports.test = function(req, res){
    res.render('index', { title: 'Woben' });
}

exports.index = function(req, res){

    // Check if the request comes from a bot
    if ("_escaped_fragment_" in req.query) {

        // Check if the requiered environment variables are defined
        if (process.env.CrawlerServiceApiId &&
            process.env.CrawlerServiceEndPoint &&
            process.env.CrawlerServiceApplication) {

            var default_headers = {
                'content-type' : 'application/json'
            };

            var date = new Date();
            var numberOfDaysToAdd = 3;
            date.setDate(date.getDate() + numberOfDaysToAdd);
            var dd = date.getDate();
            var mm = date.getMonth() + 1;
            var y = date.getFullYear();

            var crawlerObject = {
                ApiId : process.env.CrawlerServiceApiId,
                Application : process.env.CrawlerServiceApplication,
                Url : req.protocol + "://" + req.get('host') + req.url.replace("?_escaped_fragment_=",""),
                Store : true,
                UserAgent : req.headers['user-agent'],
                ExpirationDate : date.toISOString()
            };

            console.log(crawlerObject);

            // Send request to Crawler
            request({
                url: process.env.CrawlerServiceEndPoint,
                headers: default_headers,
                method: 'POST',
                body: JSON.stringify(crawlerObject)
            }, function (err, response, body) {
                // If no error write snapshot
                // If error render normal view
                if (!err && response.statusCode == 200) {
                    console.log(err);
                    console.log(response.statusCode);

                    if (body.indexOf("Page not found") != -1) {
                        res.status(404).send('404.Not found');
                    }

                    res.set('Content-Type', 'text/html');
                    res.send(new Buffer(body));
                } else {
                    res.render('index', { title: 'Woben' });
                }
            });
        } else {
            res.render('index', { title: 'Woben' });
        }
    } else {
        res.render('index', { title: 'Woben' });
    }
};