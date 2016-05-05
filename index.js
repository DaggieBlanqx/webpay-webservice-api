var request = require('request');
var parseString = require('xml2js').parseString;

module.exports = {
    doTransaction: function(gateway_url, txn, options, cb) {
        txn.terminalType = txn.terminalType ? txn.terminalType : "1";

        var txn_xml = 
            `<?xml version='1.0'?>
            <transaction>
                <interface>CREDITCARD</interface>
                <transactiontype>` + txn.txnType + `</transactiontype>
                <terminaltype>` + txn.terminalType + `</terminaltype>
                <clientid>` + txn.clientID + `</clientid>
                <authenticationtoken>` + txn.authToken + `</authenticationtoken>
                <carddata>` + txn.cardNumber + `</carddata>
                <cardexpirydate>` + txn.expiryMonth + checkExpiryYear(txn.expiryYear) + `</cardexpirydate>
                <cvc2>` + txn.cvc + `</cvc2>
                <totalamount>` + txn.amount + `</totalamount>
            </transaction>`;
        
        // set the correct URL 
        var gw_url = gateway_url;
        var gw_url_split = gw_url.split("/");
        if(options.test_mode){
            if(options.test_mode == true){
                gateway_url = gw_url_split.slice(0, gw_url_split.length - 1).join("/") + "/testtransaction";
            }else{
                gateway_url = gw_url_split.slice(0, gw_url_split.length - 1).join("/") + "/transaction";
            }
        }else{
            gateway_url = gw_url_split.slice(0, gw_url_split.length - 1).join("/") + "/transaction";
        }
        
        // set the options
        options.url = gateway_url
        options.body = txn_xml;
        options.headers = {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        };
        options.rejectUnauthorized = false;

        // send the xml
        request.post(options, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                // parse the XML into a JS object and return it
                parseString(body, function (err, jsObject) {
                    cb(null, jsObject.transaction);
                });
            }else{
                // unknown error, lets create a -1 response
                var err_result = {};
                err_result.responsecode = "-1";
                err_result.responsetext = err;
                cb(err_result, null);
            }
        });
    }
};

function checkExpiryYear(expiryYear){
    if(expiryYear){
        // 2 digits which is the correct length, return as is
        if(expiryYear.toString().length == 2){
            return expiryYear;
        }
        // more than 2 digits, we want two so we grab the last 2 digits
        if(expiryYear.toString().length > 2){
            return expiryYear.toString().substr(expiryYear.toString().length - 2);
        }
        
        // who knows, just return it and see how we go
        return expiryYear;
    }else{
        return '00';
    }
}