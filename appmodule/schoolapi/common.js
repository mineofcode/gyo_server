var db = require("../../db/dbservice.js");
var rs = require("../util/resp.js");
var globals = require("../../globals.js");

var common = module.exports = {};

common.getAutoData = function getAutoData(req, res, done) {
    db.callProcedure("select " + globals.schema("funget_auto") + "($1,$2::json);", ['auto', req.query], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    }, 1)
}

common.getDashboard = function getDashboard(req, res, done) {
    db.callProcedure("select " + globals.schema("funget_dashboard") + "($1,$2::json);", ['db', req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    }, 1)
}