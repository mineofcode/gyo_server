var db = require("db");
var rs = require("gen").res;
var globals = require("gen").globals;

var classroster = module.exports = {};

classroster.saveClassRoster = function saveClassRoster(req, res, done) {
    db.callFunction("select " + globals.erpschema("funsave_classroster") + "($1::json);", [req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    })
}

classroster.getClassRoster = function getClassRoster(req, res, done) {
    db.callProcedure("select " + globals.erpschema("funget_classroster") + "($1,$2::json);", ['clsrst', req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    }, 1)
}

classroster.saveTimeTable = function saveTimeTable(req, res, done) {
    db.callFunction("select " + globals.erpschema("funsave_timetable") + "($1::json);", [req.body], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    })
}