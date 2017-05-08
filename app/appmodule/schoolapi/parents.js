var db = require("db");
var rs = require("gen").res;
var globals = require("gen").globals;

var parent = module.exports = {};

parent.mykids = function(req, res, done) {
    db.callProcedure("select " + globals.schema("funget_api_mykids") + "($1,$2::json);", ['mykids', req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    }, 1);
}