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
var stdin = process.openStdin();

function getPrice(info) {
  var ret;
  switch (currency) {
    case "EUR":
      ret = info.price_eur;
      break;
    case "USD":
      ret = info.price_usd ;
      break;
    default:
      return "The currency \"" + currency + "\" is not currently supported.";
  }
  return ret + " " + currency;
}

function setCurrency(input) {
  input = input.toString().trim();
  switch (input) {
    case "EUR":
      currency = input;
      break;
    case "USD":
      currency = input;
      break;
    default:
      console.log("> The currency \"" + input + "\" is not currently supported.");
      return;
  }
  console.log("> The current currency is: " + input);
}


cap.on(coin, (info) => {
  console.log("> " + getPrice(info));
});

stdin.addListener("data", (input) => {
  setCurrency(input)
});
