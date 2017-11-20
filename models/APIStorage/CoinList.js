/**
 Copyright Church of Crypto, Baron Nashor
 */

var axios = require('axios');

module.exports = {
  getCoinSnapShot: function(coinSymbol, toSymbol) {
    const coinSnapShotEndpoint = "https://www.cryptocompare.com/api/data/coinsnapshot/?fsym="+coinSymbol+"&tsym="+toSymbol;
    return axios.get(coinSnapShotEndpoint);
  },
  getCoinSocialData(coinID) {
    const histogramDataEndpoint = "https://www.cryptocompare.com/api/data/socialstats/?id="+coinID;
    return axios.get(histogramDataEndpoint);
  },

  getCoinMarketCapCoinList: function()
  {
    var getCoinMarketCapListEndpoint = "https://api.coinmarketcap.com/v1/ticker";
    return axios.get(getCoinMarketCapListEndpoint);
  },
  getCryptoCompareCoinList: function () {
    const getCruptoCompreListEndpoint = "https://min-api.cryptocompare.com/data/all/coinlist";
    return axios.get(getCruptoCompreListEndpoint);
  },
  getCoinDayHistogram: function(coinSymbol) {
    const histogramDataEndpoint = "https://min-api.cryptocompare.com/data/histohour?fsym="+coinSymbol+"&tsym=USD&limit=24&aggregate=1";
    return axios.get(histogramDataEndpoint);
  },


  getCoinList: function() {
    return getCoinMarketCapCoinList().then(function (coinMarketApiResponse) {
      coinMarketApiResponse = coinMarketApiResponse.data;
      return getCryptoCompareCoinList().then(function (coinListResponse) {
        coinListResponse = coinListResponse.data.Data;
        let coinListItems = Object.keys(coinListResponse).map(function (key) {
          return coinListResponse[key];
        });
        coinListItems = coinListItems.sort(function (a, b) {
          return Number(a.Rank) - Number(b.Rank);
        });
        let joinedCoinDataList = [];
        for (let a = 0; a < coinMarketApiResponse.length; a++) {
          for (let b = 0; b < coinListItems.length; b++) {
            if (coinMarketApiResponse[a].symbol.toLowerCase().trim() === coinListItems[b].Name.toLowerCase().trim() ||
              symbolNormalizerMatches(coinMarketApiResponse[a].symbol.toLowerCase(), coinListItems[b].Name.toLowerCase())) {
              // Normalize response to store in cassandra DB
              const normalizedCMApiResponse =
                Object.assign(...Object.keys(coinMarketApiResponse[a]).map(function (cmResponseKey) {
                  let temp = {};
                  if (cmResponseKey === "24h_volume_usd") {
                    temp["daily_volume_usd"] = coinMarketApiResponse[a]["24h_volume_usd"];
                  } else {
                    temp[cmResponseKey.toLowerCase()] = coinMarketApiResponse[a][cmResponseKey];
                  }
                  return temp;
                }));

              const normalizedCLApiResponse =
                Object.assign(...Object.keys(coinListItems[b]).map(function (clResponseKey) {
                  let temp = {};
                  temp[clResponseKey.toLowerCase()] = coinListItems[b][clResponseKey];
                  return temp;
                }));
              joinedCoinDataList.push(Object.assign({}, normalizedCMApiResponse, normalizedCLApiResponse));
              break;
            }
          }
        }
        return {data: joinedCoinDataList};
      });
    });
  },

  // Method returns 10080 minute data endpoints for past week
  getCoinWeekHistoryData: function(coinSymbol) {
    const dataEndpoint = "https://min-api.cryptocompare.com/data/histohour?fsym="+coinSymbol+"&tsym=USD&limit=1440&aggregate=3&e=CCCAGG";
    return axios.get(dataEndpoint);
  },

  // Method return 24 hourly data points for last day
  getCoinDayHistoryData: function(coinSymbol) {
    const histogramDataEndpoint = "https://min-api.cryptocompare.com/data/histohour?fsym="+coinSymbol+"&tsym=USD&limit=24&aggregate=1&e=CCCAGG";
    return axios.get(histogramDataEndpoint);
  },


  searchCoin: function(coinSymbol) {
    return ({data: []});
  },

  getCoinHistoricalPrice: function(fromSymbol, exchange, timeStamp) {
    let toSymbol = "BTC,USD,ETH";
    const priceHistoricalEndpoint = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
      + fromSymbol +"&tsyms=" + toSymbol + "&markets=" + exchange + "&ts=" + timeStamp;
    return axios.get(priceHistoricalEndpoint);
  }
}

function getCoinMarketCapCoinList()
{
  const getCoinMarketCapListEndpoint = "https://api.coinmarketcap.com/v1/ticker";
  return axios.get(getCoinMarketCapListEndpoint);
};
function getCryptoCompareCoinList () {
  const getCruptoCompreListEndpoint = "https://www.cryptocompare.com/api/data/coinlist/";
  return axios.get(getCruptoCompreListEndpoint);
};

function symbolNormalizerMatches(symbol, name) {
  if (symbol === "bcc" && name === "bccoin") {
    return true;
  }
}