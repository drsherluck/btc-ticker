'use strict';
const Config = require("./Config") ;

module.exports = (_ => {
    let red = "\x1b[31m"
    let green = "\x1b[32m"
    let res = "\x1b[0m"

    let Ticker = () => {
        let last_price = null;
        let first_price = null;
        let alert_price = null;
        
        let coin = Config.coin;

        // updates the price if it changed.
        let setNewPrices = (specs) => {
            let { price_eur, price_usd } = specs
            last_price = { price_eur, price_usd }
        }

        let alert = () => {
            if (!alert_price) return;
            if (alert_price => last_price) {
                console.log("> PRICE GOAL REACHED!")
            }
        }
        
        let round = (value) => {
            return Number(Math.round(value+'e3')+'e-3');
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

            let last_per = ((price_eur/last_price.price_eur)*100) - 100;
            percent.last_per = ""+ round(last_per)
            if (last_per >= 0) {
                percent.last_color = green
                percent.last_per = "+" + percent.last_per;
            }

            let first_per = ((price_eur/first_price.price_eur)*100) - 100;
            percent.first_per = "" + round(first_per)
            if (first_per >= 0) {
                percent.first_color = green
                percent.first_per = "+" + percent.first_per;
            }
            setNewPrices(specs)
            return percent;
        }

        // init prices which are null.
        let initPrices = (specs) => {
            if (last_price) return
            let { price_eur, price_usd } = specs
            if (!last_price)
                last_price = { price_eur, price_usd }
            if (!first_price) 
                first_price = { price_eur, price_usd }
            
            let colors = {
                c_1h: red,
                c_24h: red,
                c_7d: red
            }
            if (specs.percent_change_1h >= 0) colors.c_1h = green
            if (specs.percent_change_24h >= 0) colors.c_24h = green
            if (specs.percent_change_7d >= 0) colors.c_7d = green
            console.log("1h: " + colors.c_1h + "%s"+ res +" 24h: "+ colors.c_24h + "%s"+ res +" 7d: " + colors.c_7d + "%s"+ res,
                            specs.percent_change_1h, specs.percent_change_24h, specs.percent_change_7d )            
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
            alert();
            let string = "> " + round(ret) + " " + fiat;
            // not displaying percentage increased from beginning of execution of the program (first_per)
            // displayin the percentage increased from last price.
            console.log("%s" + " " + p.first_color + "%s" + res, string, p.first_per)
        }

        function setAlertPrice(price) {
            alert_price = price;
            console.log("> Alert price set to " + price)
        }

        return Object.freeze({
            getPrice,
            setAlertPrice
        })

    }

    return Ticker;

})()