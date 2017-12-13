'use strict';
const Config = require("./Config") ;
const support = require("./support");

module.exports = (_ => {
    let red = "\x1b[31m"
    let green = "\x1b[32m"
    let res = "\x1b[0m"

    /**
     * Object that manages input from CoinMarketCap.
     */
    let Ticker = () => {
        let last_price = null;
        let alert_price = null;
        let hour_trend = 4;

        /**
         * Sets the last_price.
         * 
         * @param {Object} specs data from coinmarketcap
         */
        let setLastPrice = (specs) => {
            let { price_eur, price_usd } = specs
            last_price = { price_eur, price_usd }
        }

        /**
         * Alerts the user if a price goal has been achieved.
         */
        let alert = () => {
            if (!alert_price) return;
            if (alert_price >= last_price) {
                console.log("> PRICE GOAL REACHED!")
            }
        }

        /**
         * Gives the change compared to the last price in percentage.
         * 
         * @param {Object} specs data from coinmarketcap
         * @returns {number, string} the percentage in number and the output string e.g +2.0%
         */
        let percentage = (specs) => {
            let { price_eur, price_usd } = specs
            let percent = {
                last_per: 0,
                output: ""
            }

            let last_per = ((price_eur/last_price.price_eur)*100) - 100;
            percent.last_per = support.round(last_per)
            percent.output = red + ("" + percent.last_per) + "%" + res;
            if (last_per >= 0) {
                percent.output = green + "+" + percent.last_per + "%" + res;
            }
            setLastPrice(specs)
            return percent;
        }

        /**
         * Displays the hourly, daily and 7 day trend every 4 updates.
         * 
         * @param {Object} specs data from coinmarketcap
         */
        let trendChange = (specs) => {
            if (hour_trend && hour_trend < 4) {
                (hour_trend == 0) ? hour_trend = 4 : hour_trend--;
                return;
            }
            trendPercentages(specs);
            hour_trend--;
        }

        /**
         * Displays the hourly, daily and 7 day percentages
         * 
         * @param {Object} specs data from coinmarketcap
         */
        let trendPercentages = (specs) => {
            let colors = {
                c_1h: red,
                c_24h: red,
                c_7d: red
            }
            if (specs.percent_change_1h >= 0)   colors.c_1h  = green
            if (specs.percent_change_24h >= 0)  colors.c_24h = green
            if (specs.percent_change_7d >= 0)   colors.c_7d  = green
            let s1 = colors.c_1h + specs.percent_change_1h + "%" + res
            let s2 = colors.c_24h + specs.percent_change_24h + "%" + res
            let s3 = colors.c_7d + specs.percent_change_7d  + "%" + res
            console.log("1h: " + s1 +" 24h: "+ s2 +" 7d: " + s3)      
        }

        /**
         * Initializes the prices at frist run.
         * 
         * @param {Object} specs data from coinmarketcap
         */
        let initPrices = (specs) => {
            if (last_price) return
            let { price_eur, price_usd } = specs
            if (!last_price)
                last_price = { price_eur, price_usd }
        }

        /**
         * By default will return prices in USD.
         * 
         * @param {Object} info data from coinmarketcap
         * @returns {string} the price of the crypto currency e.g 14023.90 USD
         */
        let getPrice = (info) => {
            let fiat = Config.fiat;
            let price = null;
            let srting = null;
            switch (fiat) {
                case "EUR": price = info.price_eur; break;
                default: price = info.price_usd ; break; 
            }
            return support.round(price) + " " + fiat;
        }

        /**
         * Displays the recent updates on the value of the crypto currency.
         * 
         * @param {Object} info data from coinmarketcap
         */
        let update = (info) => {
            // if price didnt change stop.
            let { price_eur, price_usd } = info
            if (last_price && last_price.price_eur == price_eur ) return; 

            initPrices(info);
            trendChange(info);
            let p = percentage(info);
            alert();
            console.log("%s %s %s", getPrice(info) , p.output, "[" + support.unixTime(info.last_updated) + "]")
        }

        /**
         * Set a 'alarm' for when the value of a crypto currency
         * gets below or at the given price.
         * 
         * @param {number} price to be alerted for.
         */
        let setAlertPrice = (price) => {
            alert_price = price;
            console.log("> Alert price set to " + price)
        }

        /**
         * Return the object with only some visible methods.
         */
        return Object.freeze({
            getPrice,
            update,
            setAlertPrice
        })

    }

    return Ticker;

})()