/*jslint node: true */
'use strict';

var fs = require('fs');

exports.awesomeThings = function(req, res) {
    res.json([
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ]);
};

// Router function that gets exported to the main(app.js) loop.
exports.apiRouter = function(req, res, next){
  // Strip leading slashes, .stuff's and lower casing the string.
  var cleanReq = req.url.replace(/^\/|\.html|\.jade|apiviews\/|\.php/gi, '').toLowerCase();
  
  // If the remaining request is empty, assume index.
  if (cleanReq === '') {cleanReq = 'index';}

  // Check if we have a jade file by the name of the request url.
  fs.exists(__dirname + '/../apiViews/' + cleanReq + '.jade', function(e) {
    // If jade file exist render it with proper data.
    if (e) {
      // Collect all data related to the request; handled by the dataRouter.
      var reqData = dataRouter(cleanReq);

      // Render the requested page with proper data.
      res.render(cleanReq, reqData);
    }
    // Else pass the request.
    else {
      next();
    }
  });
};

// Data routing function.
var dataRouter = function dataRouter(page) {
  // Fetch most recent siteData
  //var siteData = fetchJSON(__dirname + '/../data/siteData.json');
  // Merge the global and page data together, then return it.
  //return merge(siteData.globalData, siteData.pageData[page]);
  return {};
};

// Fetch JSON data function
var fetchJSON = function fetchJSON(file) {
  var raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
};