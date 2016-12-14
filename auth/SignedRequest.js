var crypto = require('crypto');

function SignedRequest() {
};


SignedRequest.prototype.FbVerify = function(secret, req) {
    var kauth = req.cookies.kauth;
    var signedRequest = req.body.signedRequest; 

    if (kauth != null) signedRequest = kauth;
    
    if (signedRequest == null)  {
        return {
            status: false,
            user_id: null,
            data: null
        };
    }

    var parts = signedRequest.split('.');
    var encodedSignature = parts[0];
    var encoded = parts[1];
    var signature = base64decode(encodedSignature);
    var decoded = base64decode(encoded);
    var data = JSON.parse(decoded);
    var algorithm = data.algorithm; 

    var ret = {
        status: verify(algorithm, signedRequest, encodedSignature, secret, encoded),
        user_id: data.user_id,
        data: signedRequest
    };
    return ret;
}

function verify(algorithm, sr, encodedSignature, secret, encoded) {
    if (algorithm !== 'HMAC-SHA256') {
        return false;
    }
    var hmac = crypto.createHmac('SHA256', secret);
    hmac.update(encoded);
    var result = hmac.digest('base64').replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
    console.log(result);
    return result === encodedSignature;
};

base64encode = function(data) {
    return new Buffer(data, 'utf8').toString('base64').replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
};

base64decode = function(data) {
    while (data.length % 4 !== 0) {
        data += '=';
    }
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    return new Buffer(data, 'base64').toString('utf-8');
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = SignedRequest;
else
    window.Validator = SignedRequest;