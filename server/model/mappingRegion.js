var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var mappingRegionSchema = new Schema({
    provinceCode_key0: {
        type: String
    },
    sapProvinceCode_data: {
        type: String
    },
    saleSubRegionCode_data: {
        type: String
    },
    addrSubRegionCode_data: {
        type: String
    },
    sapRegionGrpCode_data: {
        type: String
    },
    regionCode_key2: {
        type: String
    },
    sapSalesDistrict_data: {
        type: String
    },
    sapSalesOffice_data: {
        type: String
    },
    sapSalesGroup_data: {
        type: String
    },
    created_data: {
        type: String
    },
    createdBy_data: {
        type: String
    },
    lastUpd_data: {
        type: String
    },
    lastUpdBy_data: {
        type: String
    }
}, {
    versionKey: false
});

var mappingRegion = mongoose.model('mappingRegion', mappingRegionSchema, 'mappingRegion');

module.exports = mappingRegion;