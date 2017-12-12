let Ticker = require("./src/Ticker")();
const CoinMarketCap = require("node-coinmarketcap");
let ErrorHandler = require("./src/Errors");
const Config = require("./src/Config");
const InputHandler = require("./src/InputHandler");

InputHandler();
let cointicker = new CoinMarketCap(Config.getOptions());

cointicker.on(Config.coin, (info) => {
  console.log("> " + Ticker.getPrice(info));
});

process.on("exit", () => {
  console.log("\n> k bye");
  process.exit();
});

process.on("SIGINT", () => {
  console.log("\n> sigint");
  process.exit();
});
