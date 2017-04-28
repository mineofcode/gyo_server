var db = require("../../db/dbservice.js");
var rs = require("../util/resp.js");
var globals = require("../../globals.js");

var hld = module.exports = {};

hld.saveHoliday = function saveHoliday(req, res, done) {
    db.callFunction("select " + globals.schema("funsave_holiday") + "($1::json);", [req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    })
}

hld.getHoliday = function getHoliday(req, res, done) {
    db.callProcedure("select " + globals.schema("funget_holiday") + "($1,$2::json);", ['holiday', req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    }, 1)
}