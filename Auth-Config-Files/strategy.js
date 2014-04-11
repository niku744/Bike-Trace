/**
 * Created by Nicholas on 4/10/14.
 */
var util = require('util');

var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var InternalOAuthError = require('passport-oauth').InternalOAuthError;

//authentication strategy stuff
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = 'https://www.mapmyfitness.com/v7.0/oauth2/authorize';
    options.tokenURL = 'https://oauth2-api.mapmyapi.com/v7.0/oauth2/access_token';
    options.Headers = options.Headers || {'Api-Key': options.clientID};

    OAuth2Strategy.call(this, options, verify);
    this.name = 'mapMyFitness';
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

module.exports = Strategy;