// pRoy24 TokenPlex
//import {} from '../';
var Storage = require('../../constants/Storage');
var redis = require("redis"),
  client = redis.createClient({host: Storage.REDIS_API_SERVER});
bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var ObjectUtils = require('../../utils/ObjectUtils');

module.exports = {
  getCoinList: function(range) {
    return client.hgetallAsync("coins").then(function(response){
      let coinListArray = [];
        Object.keys(response).forEach(function(coinKey){
          if (response[coinKey]) {
            try {
              coinListArray.push(JSON.parse(response[coinKey]));
            } catch (e){
              // Log Error response
            }
          }
        });
        return {data: coinListArray};

    });
  },

  findCoinList: function() {
    client.hgetall("coins", function(err, res){
      if (err) {
        console.log(err);
      }
      res.send({"success": true});
    })
  },

  saveCoinList: function(coinList) {


     coinList.forEach(function(coinItem){
       if (ObjectUtils.isNonEmptyObject(coinItem)) {
         client.hset("coins", coinItem.symbol, JSON.stringify(coinItem), function (err, response) {
           if (err) {
             console.log(err);
           } else {
             console.log(response);
           }
         });
       }
     });
  },

  saveCoinSeachList: function(coinList) {
    let coinSearchStrings = [];
    coinSearchStrings.push("searchStrings");
    coinList.forEach(function(coinItem){
      coinSearchStrings.push(coinItem.symbol);
      coinSearchStrings.push(coinItem.name+":"+coinItem.rank+":"+coinItem.symbol);
    });

    client.hmsetAsync(coinSearchStrings).then(function(coinSearchStringResponse){
      return {data: "success"};
    })

  },

  searchCoin: function(coinSearchString) {
    return client.hgetallAsync("coins").then(function(response){
      let coinListArray = [];
      Object.keys(response).forEach(function(coinKey){
        let coinResponse  = JSON.parse(response[coinKey]);
        let coinFullName = coinResponse.fullname;

        if (new RegExp(coinSearchString.toLowerCase()).test(coinFullName.toLowerCase())) {
          coinListArray.push(coinResponse);
        }
      });

      return {data: coinListArray};

    });
  },


  deleteCoinList: function(token) {
    if (token === "proy24") {
      return client.hgetallAsync("coins").then(function(response) {
        if (ObjectUtils.isNonEmptyObject(response)) {
          Object.keys(response).forEach(function (coinKey) {
            client.hdel("coins", coinKey);
          });
        }
      });
    }
  }


}