let Ticker = require("./src/Ticker")();
const CoinMarketCap = require("node-coinmarketcap");
let ErrorHandler = require("./src/Errors");
const Config = require("./src/Config");
const InputHandler = require("./src/InputHandler");

let input = InputHandler();
let cointicker = new CoinMarketCap(Config.getOptions());

input.setTricker(Ticker);

cointicker.on(Config.coin, (info) => {
  Ticker.getPrice(info);
});



process.on("SIGINT", () => {
  console.log("\n> sigint");
  process.exit();
});
