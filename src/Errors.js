module.exports = (_ => {
    
    let errorHandle = function(errorCode) {
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

    return {
        errorHandle
    }

})()