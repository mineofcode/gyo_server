var db = require("db");
var rs = require("gen").res;
var globals = require("gen").globals;

var lvpsngr = module.exports = {};

lvpsngr.saveLeavePassenger = function saveLeavePassenger(req, res, done) {
    db.callFunction("select " + globals.schema("funsave_studentleave") + "($1::json);", [req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    })
}

lvpsngr.getLeavePassenger = function getLeavePassenger(req, res, done) {
    db.callProcedure("select " + globals.schema("funget_studentleave") + "($1,$2::json);", ['lp', req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    }, 1)
}