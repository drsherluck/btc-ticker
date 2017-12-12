let config_file = require("./config.json")

// I guess its a singleton
let config_mod = (_ => {
    let fiat = config_file.fiat;
    let coin = config_file.coin;
    let refresh_rate = config_file.refresh;

    getOptions = () => {
        return {
            events: true,
            convert: fiat,
            refresh: refresh_rate
        }
    }

    // add save method.
    return {
        fiat,
        coin,
        refresh_rate,
        getOptions
    }

})()


module.exports = config_mod;