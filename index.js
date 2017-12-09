var coin = "BTC";
var fiat = "EUR";

var CoinMarketCap = require("node-coinmarketcap");


processArgs(process.argv);

var options = {
  events: true,
  refresh: 6,
  convert: fiat
};

var cap = new CoinMarketCap(options);
var stdin = process.openStdin();

function processArgs(args) {
  var coinSet = false;
  var fiatSet = false;
  var og_coin = coin;
  var og_fiat = fiat;
  var next;
  var errorCode;
  args.forEach((arg, index, args) => {
    next = index + 1;

    switch (arg) {
      case "--coin":
      case "--crypto":
      case "-c":
        if (coinSet) {
          reset(og_coin, og_fiat);
          errorHandle(-101);
          return;
        }

        if (next >= args.length) {
          reset(og_coin, og_fiat);
          errorHandle(-100);
          return;
        }

        errorCode = setCrypto(args[next]);
        if (errorCode != 0) {
            reset(og_coin, og_fiat);
            errorHandle(errorCode);
            return;
        }
        break;

      case "--fiat":
      case "--valuta":
      case "--currency":
      case "-f":
        if (fiatSet) {
          reset(og_coin, og_fiat);
          errorHandle(-102);
          return;
        }

        if (next >= args.length) {
          reset(og_coin, og_fiat);
          errorHandle(-100);
          return;
        }

        errorCode = setFiat(args[next]);
        if (errorCode != 0) {
            reset(og_coin, og_fiat);
            errorHandle(errorCode);
            return;
        }
        break;
      default:
    }

    if (next == args.length) printValues();
  });
}

function printValues() {
  console.log("> crypto: " + coin);
  console.log("> fiat: " + fiat);
}

function reset(og_coin, og_fiat) {
  coin = og_coin;
  fiat = og_fiat;
}

function errorHandle(errorCode) {
  switch (errorCode) {
    case 0:
      //no error duh
      break;
    case -100:
      console.log("> not enough arguments");
      break;
    case -101:
      console.log("> incorrect arguments, cryptocurrency is already set");
      break;
    case -102:
      console.log("> incorrect arguments, currency is already set");
      break;
    case 101:
      console.log("> unsupported cryptocurrency");
    case 102:
      console.log("> probably not a cryptocurrency code");
    case 201:
      console.log("> unsupported currency");
    case 202:
      console.log("> probably not a currency code");
      break;
    default:
      console.log("> weird this error code doesn't have a meaning");
  }
}

function setCrypto(input) {
  if (input.length != 3) return 102;
  var formated = input.toUpperCase();
  switch (formated) {
    case "BTC":
      coin = formated;
      break;
    case "ETH":
      coin = formated;
      break;
    default:
      return 101;
  }
  return 0;
}

function setFiat(input) {
  var formated = input.toUpperCase();
  switch (formated) {
    case "EUR":
      fiat = formated;
      break;
    case "USD":
      fiat = formated;
      break;
    default:
  }
  return 0;
}

function getPrice(info) {
  var ret;
  switch (fiat) {
    case "EUR":
      ret = info.price_eur;
      break;
    case "USD":
      ret = info.price_usd ;
      break;
    default:
      return "The currency \"" + fiat + "\" is not currently supported.";
  }
  return ret + " " + fiat;
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

process.on("exit", () => {
  console.log("\n> k bye");
  process.exit();
});

process.on("SIGINT", () => {
  console.log("\n> sigint");
  process.exit();
});
