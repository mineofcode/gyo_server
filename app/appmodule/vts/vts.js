var mondb = require("../../db/mongodbservice.js");
var schedule = require('node-schedule');

var db = require("db");
var rs = require("gen").res;
var globals = require("gen").globals;

var tripapi = require("../schoolapi/tripapi.js");
var vts = module.exports = {};

function saveNotification(req, res, _remark3, _data) {
    var params = {
        "grpid": 0,
        "frmid": 1,
        "frmtype": "admin",
        "remark3": _remark3,
        "studid": _data.studid,
        "title": _data.title,
        "msg": _data.msg,
        "sendtype": "{parents}",
        "ntftype": "fence",
        "enttid": req.query.enttid,
        "issendsms": false,
        "issendemail": false,
        "cuid": "admin.goyo"
    };

    db.callFunction("select " + globals.erpschema("funsave_notification") + "($1::json);", [params], function(data) {
        rs.resp(res, 200, data.rows);
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    })
}

vts.getFence = function(req, res, done) {
    var ntfparams = {
        "flag": req.query.almtyp,
        "almtyp": req.query.almtyp,
        "batchid": req.query.batchid,
        "drvid": req.query.drvid,
        "vehid": req.query.vehid,
        "rtid": req.query.rtid,
        "stpid": req.query.stpid,
        "stptype": req.query.stptype,
        "pdtype": req.query.pdtype,
        "tm": req.query.tm,
        "enttid": req.query.enttid
    };

    db.callProcedure("select " + globals.schema("funapisend_notification_or_not") + "($1,$2::json);", ['ntf', ntfparams], function(data) {
        var _data = data.rows[0];

        if (_data !== undefined) {
            if (_data.status == 0) {
                rs.resp(res, 200, _data);
            } else if (_data.status == -1) {
                rs.resp(res, 200, _data);
            } else {
                saveNotification(req, res, ntfparams, _data);
                tripapi.sendNotification(ntfparams);
            }
        } else {
            rs.resp(res, 200, "No Data Found");
        }
    }, function(err) {
        rs.resp(res, 401, "error : " + err);
    }, 1)
}

vts.getSpeed = function(req, res, done) {
    console.log(req);
}

// To MongoDB

var Schema = mondb.mongoose.Schema;

var NotificationSchema = new Schema({
    flag: String,
    almtyp: String,
    batchid: Number,
    drvid: Number,
    vehid: Number,
    rtid: Number,
    stpid: Number,
    stptype: String,
    pdtype: String,
    pdid: Number,
    tm: String,
    enttid: Number,
    isread: Boolean,
    servertime: String
});

mondb.mongoose.model('notification', NotificationSchema);

vts.addToMongodb = function(req, res, done) {
    var ntfparams = {
        "flag": req.query.almtyp,
        "almtyp": req.query.almtyp,
        "batchid": req.query.batchid,
        "drvid": req.query.drvid,
        "vehid": req.query.vehid,
        "rtid": req.query.rtid,
        "stpid": req.query.stpid,
        "stptype": req.query.stptype,
        "pdtype": req.query.pdtype,
        "tm": req.query.tm,
        "enttid": req.query.enttid
    };

    mondb.mongoose.model('notification').create(ntfparams, function(err, data) {
        if (err) {
            if (res) {
                rs.resp(res, 400, err);
            }

            return;
        }

        if (res) {
            rs.resp(res, 200, data);
        }
    });
}

// From MongoDB

var j = schedule.scheduleJob('*/2 * * * * *', function() {
    console.log('The answer to life, the universe, and everything!');

    var d = mondb.mongoose.model('notification').find({}).sort({ 'servertime': -1 }).limit(50);

    d.exec(function(err, mdata) {
        if (err) {
            return;
        }

        console.log(mdata);

        db.callProcedure("select " + globals.schema("funapisend_notification_or_not") + "($1,$2::json);", ['ntf', mdata], function(data) {
            var _data = data.rows[0];

            if (_data !== undefined) {
                var params = {
                    "grpid": 0,
                    "frmid": 1,
                    "frmtype": "admin",
                    "remark3": mdata,
                    "studid": _data.studid,
                    "title": _data.title,
                    "msg": _data.msg,
                    "sendtype": "{parents}",
                    "ntftype": "fence",
                    "enttid": _data.enttid,
                    "issendsms": false,
                    "issendemail": false,
                    "cuid": "admin.goyo"
                };

                db.callFunction("select " + globals.erpschema("funsave_notification") + "($1::json);", [params], function(data) {
                    console.log(data.rows);
                }, function(err) {
                    console.log(err);
                });

                tripapi.sendNotification(ntfparams);
            } else {
                console.log("No Data Found");
            }
        }, function(err) {
            console.log(err);
        }, 1)
    });
});