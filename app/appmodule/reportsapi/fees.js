var db = require("db");
const gen = require("gen");

var rs = gen.res;
var globals = gen.globals;
var download = gen.download;

var fees = module.exports = {};
var feesapi = require("../../reports/templates/fees/fees.js");

fees.getFeesReports = function getFeesReports(req, res, done) {
    db.callProcedure("select " + globals.erpschema("funget_rpt_feescollection") + "($1,$2,$3::json);", ['feesrpt1', 'feesrpt2', req.query], function(data) {
        if (req.query.flag == "ledger") {
            download(req, res, {
                data: data.rows[0],
                data1: data.rows[1],
                data2: data.rows[0][0],
                params: req.query
            }, { 'all': "fees/feesledger.html" }, feesapi.getFeesLedgerReports);
        } else if (req.query.flag == "receipt") {
            download(req, res, {
                data: data.rows[0],
                data1: data.rows[1],
                data2: data.rows[0][0],
                params: req.query
            }, { 'all': "fees/feessleep.html" }, feesapi.getFeesSleepReports);
        } else {
            rs.resp(res, 200, data.rows);
        }
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    }, 2)
}