
let support = (_ => {
    /**
     * Takes the unix time from coinmarketcap and converts it to hh:mm:ss.
     * 
     * @param {number} unix_tm data from coinmarketcap
     * @returns {string} time in hh:mm:ss
     */
    let unixTime = (unix_tm) => {
        let date = new Date(unix_tm*1000)
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    
        return formattedTime;
    }

    /**
     * Rounds a value to 3 decimal places
     * 
     * @param {number} value the float number to be rounded
     */
    let round = (value) => {
        return Number(Math.round(value+'e2')+'e-2');
    }

    return {
        round,
        unixTime
    }

})()

module.exports = support;