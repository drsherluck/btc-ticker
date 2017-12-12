'use strict';
const Config = require("./Config") ;

module.exports = (_ => {

    let Ticker = () => {
        
        let coin = Config.coin;
        

        function getPrice(info) {
            let ret;
            let fiat = Config.fiat;
            switch (fiat) {
                case "EUR": ret = info.price_eur; break;
                case "USD": ret = info.price_usd ; break;
                default:
                    return "The currency \"" + fiat + "\" is not currently supported.";
            }
            return ret + " " + fiat;
        }

        return Object.freeze({
            getPrice
        })

    }

    return Ticker;

})()