

function readToken(req, res, next) {

var clearUid = req.body.userID;
var clientSecret = "2d698b20184a3f7f0e760baec66c4aff";
var signedRequest = req.body.signedRequest; 

var verifier = new SignedRequest(clientSecret, signedRequest);
verifier.verify() // whether or not the signed request verifies
console.log('Cleartext User ID is: ' + clearUid ); // the data from the signed request
console.log('Crypo User ID is    : ' + verifier.data.user_id ); // the data from the signed request
console.log('Authorized:' + (clearUid == verifier.data.user_id));
}

module.exports = readToken;