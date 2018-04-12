var Handlebars = require('handlebars');
var moment = require('moment');
var reports = module.exports = {};

reports.getAssesmentResultReports = function getAssesmentResultReports(data) {
    var _hndlbar = Handlebars;
    data_header = data.data2;

    _hndlbar.registerHelper('date_cols', function(row) {
        var columns = '';
        let data = '';

        for (var i = 0; i < data_header.length; i++) {
            data = row[data_header[i].assdate];
            columns = columns + '<td width="150px" align="center">' + (data == null ? '-' : data) + '</td>'
        }

        // columns += '<th class="text-center" >' + total + '</th>';

        return columns;
    });

    _hndlbar.registerHelper('emptydatamsg', function(params) {
        if (examdt.length == 0) {
            return "No Data Found";
        } else {
            return "";
        }
    });

    return _hndlbar;
}