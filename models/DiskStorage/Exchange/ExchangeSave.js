/**
 Copyright Tokenplex
 */
const cassandra = require('cassandra-driver');
var Storage = require('../../../constants/Storage');
const cassandraClient = new cassandra.Client({contactPoints: [Storage.CQL_API_SERVER]});

module.exports ={
  saveExchangeList: function(exchangeList) {
    exchangeList.forEach(function(exchangeItem){
      const placeHolders = "?,?,?,?,?,?,?";
      let values = [];
      let keys = "";
      Object.keys(exchangeItem).forEach(function(exchangeItemKey, exchangeIdx, arr){
        values.push(exchangeItem[exchangeItemKey]);
        keys += exchangeItemKey;
        if (exchangeIdx < arr.length - 1) {
          keys += ",";
        }
      });
      let ttl = 6000;
      const query = 'INSERT INTO tokenplex.exchanges (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' +ttl;
      const params = values;
      cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
        if (err) {
          console.log(err);
        }
      });

    })
  },

  saveCoinDayHistoryData: function (coinHistoryData, coinSymbol) {
    coinHistoryData.forEach(function(dataResponseItem){
      const placeHolders = "?, ?, ?, ?, ?, ?, ?, ?";
      let values = [coinSymbol];
      let keyItems = "symbol,";
      Object.keys(dataResponseItem).forEach(function(key, idx, arr){
        if (key !== "symbol") {
          keyItems += key;
          if (idx < arr.length - 1) {
            keyItems += ",";
          }
          values.push(dataResponseItem[key]);
        }
      });

      let ttl = 6000;
      const query = 'INSERT INTO tokenplex.daily_history_data (' + keyItems + ') VALUES (' + placeHolders + ') USING TTL ' +ttl;
      const params = values;

      cassandraClient.execute(query, params, {prepare: true}, function (err, response) {
        if (err) {
          console.log(err);
        }
      });
    });
  }

}