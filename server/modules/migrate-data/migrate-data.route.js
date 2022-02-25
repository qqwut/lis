var moment = require('moment');
var multer = require('multer');
var fs = require('fs');
var mkdirp = require('mkdirp');
const migrateCtrl = require('./migrate-data.ctrl');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../config/config.js');
var Utils = require('../../utils/common');
var tmpPath = cfg.tmp_path || 'server/data/tmp'
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(tmpPath)){
            mkdirp(tmpPath);
        }
        cb(null, tmpPath)
    },
    filename: function (req, file, cb) {
        cb(null, 'tmp-' + moment().format('YYYYMMDDHHmmss'))
    }
})
var upload = multer({
    storage: storage
});

module.exports = (app) => {

    app.post('/migrate-data/upload', upload.single('file'), migrateCtrl.migrateDataExcel);

    app.get('/migrate-data/:id/status', migrateCtrl.checkStatusMigrate);

    app.get('/migrate-data/export/:id/result', migrateCtrl.getResultFile);

    app.get('/migrate-data/export/:id/type/:type', migrateCtrl.getExcelFile);

    app.get('/migrate-data',migrateCtrl.getMigrateData);

    app.get('/migrate-data/repair-data/:id',migrateCtrl.repairData);
};