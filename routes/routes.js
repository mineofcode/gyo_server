    var rs = require("../appmodule/util/resp.js");
    var globals = require("../globals.js");
    var fs = require('fs');



    var driverinfo = require("../appmodule/driverinfo.js");
    var dashboard = require("../appmodule/dashboard.js");

    var multer = require('multer');
    var upload = multer({
        limits: {
            fieldNameSize: 999999999,
            fieldSize: 999999999
        },
        dest: 'www/uploads/'
    });


    var appRouter = function(app) {
        //#################### API Details / ##########################
        var APIInfo = {
            ver: "1.0",
            type: "REST API",
            requestdata: "JSON",
            responsedata: "JSON",
        }

        app.post(globals.globvar.rootAPI + "/", function(req, res, done) {
            console.log(req.body)
            rs.resp(res, 200, APIInfo);
        });
        //#############################################################################################

        app.post(globals.globvar.rootAPI + "/savedriverinfo", driverinfo.saveDriverInfo);
        app.post(globals.globvar.rootAPI + "/getdriverinfogrid", driverinfo.getDriverGrid);
        app.post(globals.globvar.rootAPI + "/getdriverinfodetail", driverinfo.getDriverDetail);
        //####################################################################
        app.post(globals.globvar.rootAPI + "/getdashboard", dashboard.getDashboard);
        //####################################################################
        //############################File Uploads        
        app.post(globals.globvar.rootAPI + "/uploads", upload.any(), function(req, res) {

            //console.log(req.files);

            var tmp_path = req.files[0].path;

            var target_path = 'www/uploads/' + req.files[0].originalname;

            var src = fs.createReadStream(tmp_path);
            var dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            fs.unlink(req.files[0].path, function(err) {
                if (err) return console.log(err);
                //console.log('file deleted successfully');
            });

            src.on('end', function() { rs.resp(res, 200, req.body.id); });
            src.on('error', function(err) { res.send({ error: "upload failed" }); });
        });


    }

    module.exports = appRouter;