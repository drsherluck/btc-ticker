'use strict';
const Config = require("./Config") ;

module.exports = (_ => {
    let red = "\x1b[31m"
    let green = "\x1b[32m"
    let res = "\x1b[0m"

    let Ticker = () => {
        let last_price = null;
        let first_price = null;
        
        let coin = Config.coin;

        // updates the price if it changed.
        let setNewPrices = (specs) => {
            let { price_eur, price_usd } = specs
            last_price = { price_eur, price_usd }
        }

        // get the percentage of increased or decreased
        let percentage = (specs) => {
            let { price_eur, price_usd } = specs
            let percent = { 
                last_color: red, 
                first_color: red, 
                last_per: "0", 
                first_per: "0"
            };
            percent.last_color = red
            percent.first_color = red

            let last_per = 100 - (price_eur/last_price.price_eur)*100;
            percent.last_per = ""+ last_per;
            if (last_per >= 0) {
                percent.last_color = green
                percent.last_per = "+" + percent.last_per;
            }

            let first_per = 100 - (price_eur/first_price.price_eur)*100;
            percent.first_per = "" + first_per
            if (first_per >= 0) {
                percent.first_color = green
                percent.first_per = "+" + percent.first_per;
            }
            setNewPrices(specs)
            return percent;
        }

        // init prices which are null.
        let initPrices = (specs) => {
            let { price_eur, price_usd } = specs
            if (!last_price)
                last_price = { price_eur, price_usd }
            if (!first_price) 
                first_price = { price_eur, price_usd }                
        }

        function getPrice(info) {
            // did the price change?
            let { price_eur, price_usd } = info
            if (last_price && last_price.price_eur == price_eur ) return; 

            initPrices(info);
            let fiat = Config.fiat;
            let ret;
            switch (fiat) {
                case "EUR": ret = info.price_eur; break;
                case "USD": ret = info.price_usd ; break;
                default:
                    return "The currency \"" + fiat + "\" is not currently supported.";
            }
            let p = percentage(info);
            let string = "> " + ret + " " + fiat;
            // not displaying percentage increased from beginning of execution of the program (first_per)
            // displayin the percentage increased from last price.
            console.log("%s" + " " + p.last_color + "%s" + res, string, p.last_per)
        }

        return Object.freeze({
            getPrice
        })

    }

    return Ticker;

})()