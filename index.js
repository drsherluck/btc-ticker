"use strict";

const coin = "BTC";
var currency = "EUR";

var CoinMarketCap = require("node-coinmarketcap");

var options = {
  events: true,
  refresh: 6,
  convert: currency
};

var cap = new CoinMarketCap(options);

cap.on(coin, (info) => {
  console.log("> " + getPrice(info));
});

function getPrice(info) {
  switch (currency) {
    case "EUR":
      return info.price_eur + " " + currency;
      break;
    case "USD":
      return info.price_usd;
      break;
    default:
      return "The currency \"" + currency + "\" is not currently supported.";
  }
}
