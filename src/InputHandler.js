const Config = require("./Config");
const ErrorHandler = require("./Errors");

module.exports = (_ => {

    let InputHandler = () => {
        let tricker = null        
        processArgs(process.argv);
        let stdin = process.openStdin();

        function printValues() {
            console.log("> crypto: " + Config.coin);
            console.log("> fiat: " + Config.fiat);
        }
        
        function reset(og_coin, og_fiat) {
            Config.coin = og_coin;
            Config.fiat = og_fiat;
        }

        function processArgs(args) {
            var coinSet = false;
            var fiatSet = false;
            var og_coin = Config.coin;
            var og_fiat = Config.fiat;
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
                    ErrorHandler.errorHandle(-101);
                    return;
                  }
          
                  if (next >= args.length) {
                    reset(og_coin, og_fiat);
                    ErrorHandler.errorHandle(-100);
                    return;
                  }
          
                  errorCode = setCrypto(args[next]);
                  if (errorCode != 0) {
                      reset(og_coin, og_fiat);
                      ErrorHandler.errorHandle(errorCode);
                      return;
                  }
                  break;
          
                case "--fiat":
                case "--valuta":
                case "--currency":
                case "-f":
                  if (fiatSet) {
                    reset(og_coin, og_fiat);
                    ErrorHandler.errorHandle(-102);
                    return;
                  }
          
                  if (next >= args.length) {
                    reset(og_coin, og_fiat);
                    ErrorHandler.errorHandle(-100);
                    return;
                  }
          
                  errorCode = setFiat(args[next]);
                  if (errorCode != 0) {
                      reset(og_coin, og_fiat);
                      ErrorHandler.errorHandle(errorCode);
                      return;
                  }
                  break;
                default:
              }
          
              if (next == args.length) printValues();
            });
        }

        let setCurrency = function(input) {
            input = input.toString().trim();
            switch (input) {
              case "EUR": Config.fiat = input; break;
              case "USD": Config.fiat = input; break;
              default:
                console.log("> The currency \"" + input + "\" is not currently supported.");
                return;
            }
            console.log("> The current currency is: " + input);
        }

        function setFiat(input) {
            var formated = input.toUpperCase();
            switch (formated) {
            case "EUR": Config.fiat = formated; break;
            case "USD": Config.fiat = formated; break;
            default:
            }
            return 0;
        }

        function setCrypto(input) {
            if (input.length != 3) return 102;
            var formated = input.toUpperCase();
            switch (formated) {
            case "BTC": Config.coin = formated; break;
            case "ETH": Config.coin = formated; break;
            default:
                return 101;
            }
            return 0;
        }

        stdin.addListener("data", (input) => {
            let st = input.toString().trim();
            let arr = st.split(' ');
            switch (arr[0]) {
                case('alert') : 
                    tricker.setAlertPrice( parseFloat(arr[1]) ); break;
                case('q'): case('quit'): 
                    process.exit(0); break;
                default: 
                    setCurrency(input); break;
            }
        });

        function setTricker(tt) {
            tricker = tt;
        }

        return Object.freeze({ setTricker })

    }

    return InputHandler;

})()