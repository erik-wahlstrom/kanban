function Configuration() {   
};


var localConfig = {
    appId: "1817968725151384",
    secret: "7142f66c6459e268c013ed6fdb477ebb",
    connection_string: "postgres://erik:Leadville100@aacxnw4546m2a8.caoeqvnamynp.us-west-2.rds.amazonaws.com:5432/kanban",
    port: 3000,
    authCookieMaxAge: 90000
}

var testConfig = {
    appId: "1817968725151384",
    secret: "7142f66c6459e268c013ed6fdb477ebb",
    connection_string: "postgres://postgres:@localhost:5432/kanban",
    port: 3000,
    authCookieMaxAge: 90000
}
var prodConfig = {
    appId: "1817608658520724",
    secret: "2d698b20184a3f7f0e760baec66c4aff",
    connection_string: "postgres://erik:Leadville100@aacxnw4546m2a8.caoeqvnamynp.us-west-2.rds.amazonaws.com:5432/kanban",
    port: 3000,
    authCookieMaxAge: 90000
}
var configs = {
    dev_aws: localConfig,
    dev: testConfig,
    prod: prodConfig
}
var PORT = 3000;
var ACTIVE_CONFIG = "dev";

Configuration.prototype.ActiveConfiguration = function ActiveConfiguration() {
    return configs[ACTIVE_CONFIG];
}

module.exports = Configuration;