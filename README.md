# webpay-webserviceAPI

A Node.js module to process merchant credit card transactions to the Webpay transaction server (WTS) via the WebServiceAPI.

## Installation

```
npm install webpay-webserviceAPI --save
```

## Usage

``` javascript
var webpay = require('webpay-webserviceAPI');

// set the transaction data
var transaction = {
    txnType: 'PURCHASE',
    terminalType: '1',
    clientID: '90000000',
    authToken: 'Igfgfgfgfgfgfgfgfgfej',
    cardNumber: '4111111111111111',
    expMonth: 12,
    expYear: 30,
    cvc: 123,
    amount: '1.00'
};

// processs the transaction
var gateway_url = 'https://www.gatewayURL.com/WebServiceAPI/service/transaction'
webpay.doTransaction(gateway_url, transaction, <options>, function(err, result) {
    console.log(result);
    console.log(err);
});
```

The `result` will be a Javascript Object containing the response of the transaction from the Webpay Payment Gateway. 
Using the `responsecode` field, the outcome of the transaction can be determined.

## Options

The following options are allowed to be passed to `doTransaction`. 

- `proxy` allows for a proxy server to be specified in order to connect to the gateway. The proxy URL format is: http(s)://host:port
- `test_mode` is a boolean value which changes the gateway URL to enable live or test transactions.

``` javascript
var options = {
    proxy: '', 
    test_mode: false
}
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[The MIT License](https://github.com/mrvautin/webpay-webserviceAPI/tree/master/LICENSE)