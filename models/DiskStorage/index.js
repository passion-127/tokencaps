const CoinList = require('./Coin/CoinList');
const CoinUpdate = require('./Coin/CoinUpdate');
const ExchangeSave = require('./Exchange/ExchangeSave');
const ExchangeList = require('./Exchange/ExchangeList');

module.exports = {
  findCoinRow: function(coinSymbol) {
    return CoinList.getCoinItem(coinSymbol);
  },

  findCoinSnapshot: function(coinSymbol) {
    return CoinList.getCoinSnapShot(coinSymbol);
  },
  findCoinSocialData: function (coinID) {
    return CoinList.getCoinSocialData(coinID);
  },

  findCoinList: function(rangeRequest) {
    return CoinList.getCoinDataArray(rangeRequest)
  },

  findCoinDayHistoryData: function(coinSymbol) {
    return CoinList.getCoinDayHistoryData(coinSymbol);
  },

  findExchangeList: function() {
    return ExchangeList.getExchangeList();
  },

  saveCoinSnapshot: function (coinDetailData) {
    return CoinUpdate.saveCoinSnapshot(coinDetailData);
  },
  // Extra details about coin with longer TTL
  saveCoinExtraDetails: function(coinDetailData) {
    return CoinUpdate.saveCoinExtraDetails(coinDetailData);
  },
  saveCoinSocialData: function(coinID, coinSocialData) {
    return CoinUpdate.saveCoinSocialData(coinID, coinSocialData);
  },

  saveCoinListData: function(coinListData) {
    return CoinUpdate.saveCoinListData(coinListData);
  },

  saveCoinDayHistoryData: function(coinDayHistoryData) {
    return CoinUpdate.saveCoinDayHistoryData(coinDayHistoryData);
  },

  saveExchangeList: function(exchangeListData) {
    return ExchangeSave.saveExchangeList(exchangeListData);
  },


  // Search Utils
  searchCoin: function(coinString) {
    return CoinList.searchCoinByQuery(coinString);
  },


  deleteCoinDayHistoryData(coinSymbol) {
    return CoinUpdate.deleteCoinDayHistoryData(coinSymbol)
  }
}