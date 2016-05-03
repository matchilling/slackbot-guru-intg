const pg       = require("pg");
const scrapeIt = require("scrape-it");

var args       = process.argv.slice(2);
var popularity = 0;

scrapeIt(args[0], [
  {
    listItem : ".media_list li",
    name     : "apps",
    data     : {
      "categories"         : {
        how: function() {
          return [ { "slug" : args[1] } ]
        }
      },
      "sourceRef"        : { attr: "data-app-id" },
      "descriptionShort" : {
        selector : ".media_list_text > .overflow_ellipsis"
      },
      "imageUrl"    : {
        selector : ".media_list_media",
        attr     : "src"
      },
      "name"             : { attr: "data-app-name" },
      "rankings"         : {
        how: function() {
          return [ {
              "category"   : {
                "slug" : args[1]
              },
              "createdAt"  : Math.floor((new Date()).getTime() / 1000),
              "popularity" : ++popularity
    	  } ];
        }
      }
    }
  }
], function (error, data) {
  if (error) {
    throw new Error(error);
  }

  pg.connect('postgres://slack-client:12345@127.0.0.1:5433/slack_rank', function(error, client, done) {
      if(error) {
        throw new Error(error);
      }
      client.query('SELECT bulk_insert_apps($1) AS count;', [ JSON.stringify(data.apps) ], function(err, result) {
        console.info('%s objects from category "%s" have been processed.', result.rows[0].count, args[1]);
        client.end();
      });
  });
});
