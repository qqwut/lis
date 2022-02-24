var env = process.env.NODE_ENV || 'development';
var cfg = require('../../config/config.js');
var _request = require('request-promise');
const xlsx = require('node-xlsx');
const _ = require('lodash');
const fs = require('fs');
var cache = require('memory-cache');
var moment = require('moment');
var extend = require('util')._extend;
var utils = require('../../utils/common');
const _const = require('./migrate-data.const');
const migrateServ = require('./migrate-data.service');
var LocationMod = require('./model/location.model');
const excel = require('node-excel-export');
var logger = require('../../utils/logger');
var cache = require('memory-cache');
var tmpPath = cfg.tmp_path || 'server/data/tmp'

var MigrateMod = require('../../model/migrateData');

function loadDataExcel(idCache, filePath, req) {
    logger.info('load data form excel file :: ' + filePath);
    var dataMigrate = null;
    const XLX_HEADER = _const.EXCEL_HEADER || [];
    const excelData = xlsx.parse(filePath);
    var sheetLocation = excelData[0];
    var headerExcel = sheetLocation.data.shift();
    var dataLocation = [];
    logger.info('row data size ' + sheetLocation.data.length);
    for (var idx = 0; idx < XLX_HEADER.length; idx++) {
        var key = XLX_HEADER[idx];
        if (key.toUpperCase() != headerExcel[idx].toUpperCase()) {
            var err = 'Position Column not match [' + utils.excelColName((idx + 1)) + '] ==> ' + key.toUpperCase() + '|' + headerExcel[idx].toUpperCase();
            logger.error(err);
            throw new Error(err);
            // return;
        }
    }
    var dataLocation = [];
    for (var i = 0; i < sheetLocation.data.length; i++) {
        var data = sheetLocation.data[i];
        var tmp = {
            rowId: (i + 1)
        };
        for (var index = 0; index < data.length; index++) {
            var value = data[index];
            tmp[XLX_HEADER[index]] = value ? value : '';
        }
        dataLocation.push(tmp);
    }
    logger.debug('group data migrate by locationCode');
    var locationGroup = _.groupBy(dataLocation, function (item) {
        if (item.LocationCode && item.LocationCode.trim().length > 0) {
            return item.LocationCode + '';
        }
        var tmp = '';
        var lastIndex = item.rowId - 1;
        // var check
        while (lastIndex > 0 && tmp.length == 0) {
            lastIndex--;
            tmp = dataLocation[lastIndex].LocationCode && dataLocation[lastIndex].LocationCode.length > 0 ? dataLocation[lastIndex].LocationCode + '' : '';

        }
        return tmp;
    });
    var t = 0;
    var dataMigrate = [];
    for (var key in locationGroup) {
        var locMod = new LocationMod(locationGroup[key]);
        dataMigrate.push(locMod);
        t++;
    }
    dataMigrate = _.sortBy(dataMigrate, 'rowId');
    logger.info('location code after group size  ' + dataMigrate.length);
    logger.debug('load data migrate success.');
    return dataMigrate;
}

function exportExcel(list, name, columnList) {
    const excelStyle = _const.EXCEL_STYLE;
    var heading = [];
    const XLX_HEADER = _const.EXCEL_HEADER;
    const specification = {};

    if (columnList) {
        for (var index = 0; index < columnList.length; index++) {
            var colName = columnList[index];
            specification[colName] = {
                displayName: colName,
                headerStyle: _const.EXCEL_STYLE.headerGrey,
                width: 125
            };
        }
    } else {
        var tmp = list[0];
        for (var key in tmp) {
            specification[key] = {
                displayName: key,
                headerStyle: _const.EXCEL_STYLE.headerGrey,
                width: 125
            };
        }
    }
    const report = excel.buildExport(
        [{
            name: name || 'sheet1', // <- Specify sheet name (optional) 
            // heading: heading, // <- Raw heading array (optional) 
            // merges: merges, // <- Merge cell ranges 
            specification: specification, // <- Report specification 
            data: list
        }]
    );
    return report;
}

function addLocationPM(locData) {
    return new Promise((resolve, reject) => {
        try {
            migrateServ.addLocation(locData.toSdfData()).then(function (response) {
                locData.response = response;
                logger.info('add location '+(response.resultCode == '20000'?'success':'fail'));
                if (response.resultCode == '20000') {
                    logger.debug('locData.sendSiebel = '+locData.sendSiebel +', locData.contactSiebel = '+locData.contactSiebel);
                    if (locData.sendSiebel == 'N' && locData.contactSiebel == 'Y') {
                        logger.info('get data for send ContactSiebel');
                        return migrateServ.getLocationContact(locData.locationCode).then(function (contactRes) {
                            if (contactRes == null) {
                                logger.info('fail :: get data contact for put to seibel is null.');
                                locData.result = 'fail';
                                locData.error = 'get data contact for put to seibel is null.';
                                resolve(locData);
                                return;
                            }
                            var contactPs = locData.pageGroup.step4Contact.contactPerson;
                            for (var index = 0; index < contactPs.length; index++) {
                                var ps = contactPs[index];
                                var cps = _.find(contactRes, function (item) {
                                    return item.pincode == ps.pincode
                                });
                                if (cps) {
                                    ps.personId = cps.personId;
                                    ps.phone = cps.phone;
                                    ps.social = cps.social;
                                    contactPs[index] = ps;

                                }
                            }
                            locData.pageGroup.step4Contact.contactPerson = contactPs;
                            return migrateServ.updLocationContact(locData.locationCode, parseContactUpdData(locData)).then(function (updContactRes) {
                                logger.info('updLocationContact response : '+updContactRes.responseCode);
                                if (updContactRes.responseCode == '20000') {
                                    locData.result = 'success';
                                    resolve(locData);
                                } else {
                                    locData.result = 'fail';
                                    locData.error = updContactRes.error;
                                    resolve(locData);
                                }
                            }).catch(function (err) {
                                locData.result = 'fail';
                                locData.error = err;
                                resolve(locData);
                            });

                        }).catch(function (err) {
                            locData.result = 'fail';
                            locData.error = err;
                            resolve(locData);
                        });
                    } else {
                        locData.result = 'success';
                        resolve(locData);
                    }
                } else {
                    locData.result = 'fail';
                    locData.error = response.resultCode + ':' + response.resultDescription;
                    resolve(locData);
                }
            }).catch(function (err) {
                locData.result = 'fail';
                locData.error = err;
                resolve(locData);
            });
        } catch (error) {
            locData.result = 'fail';
            console.error(error);
            locData.error = error;
            resolve(locData);
        }
    });
}

function parseGeneralUpdData(locData) {
    var updData = {};
    updData.locationCode = locData.locationCode;

    updData.distChnCode = utils.nullToStr(locData.pageGroup.selectChannel.distChnCode);
    updData.chnSalesCode = utils.nullToStr(locData.pageGroup.selectChannel.chnSalesCode);
    updData.companyId = utils.nullToStr(locData.pageGroup.selectChannel.companyId);
    updData.companyIdNo = utils.nullToStr(locData.pageGroup.selectChannel.companyIdNo);
    updData.status = utils.nullToStr(locData.pageGroup.step1Location.status);
    updData.shopSegment = utils.nullToStr(locData.pageGroup.step1Location.shopSegment);
    updData.shopArea = utils.nullToStr(locData.pageGroup.step1Location.shopArea);
    updData.shopType = utils.nullToStr(locData.pageGroup.step1Location.shopType);
    updData.shopSize = utils.nullToStr(locData.pageGroup.step1Location.shopSize);
    updData.renovateFlag = utils.nullToStr(locData.pageGroup.step1Location.renovateFlag);
    updData.retailShop = utils.nullToStr(locData.pageGroup.step1Location.retailShop);
    updData.effectiveDt = utils.dateFormatSDF(locData.pageGroup.step1Location.effectiveDt);
    updData.terminateDt = utils.dateFormatSDF(locData.pageGroup.step1Location.terminateDt);
    updData.licenseCode = utils.nullToStr(locData.pageGroup.step1Location.licenseCode);
    updData.locationIdType = utils.nullToStr(locData.pageGroup.step1Location.locationIdType);
    updData.locationIdNo = utils.nullToStr(locData.pageGroup.step1Location.locationIdNo);
    updData.busRegistration = utils.nullToStr(locData.pageGroup.step1Location.businessRegistration);
    updData.remark = utils.nullToStr(locData.pageGroup.step1Location.remark);
    updData.locationVatBranchNo = utils.nullToStr(locData.pageGroup.step1Location.locationVatBranchNo);
    updData.locationVatBranchName = utils.nullToStr(locData.pageGroup.step1Location.locationVatBranchName);
    updData.locationVatType = utils.nullToStr(locData.pageGroup.step1Location.locationVatType);
    updData.wtName = utils.nullToStr(locData.pageGroup.step1Location.wtName);
    updData.wtAddress = utils.nullToStr(locData.pageGroup.step1Location.wtAddress);
    updData.locationIdForSB = utils.nullToStr(locData.pageGroup.step1Location.locationIdForSB);
    updData.typeCodeSB = utils.nullToStr(locData.pageGroup.step1Location.typeCodeSB);
    updData.subTypeCodeSB = utils.nullToStr(locData.pageGroup.step1Location.subTypeCodeSB);
    updData.characteristicSB = utils.nullToStr(locData.pageGroup.step1Location.characteristicSB);
    updData.partyTypeCode = utils.nullToStr(locData.pageGroup.step1Location.partyTypeCode);
    updData.sbPartnerId = utils.nullToStr(locData.pageGroup.step1Location.sbPartnerId);
    updData.modifiedBy = utils.nullToStr(locData.modifiedBy);
    // updData.subRegion = utils.nullToStr(locData.);
    updData.sbPartnerId = utils.nullToStr(locData.pageGroup.step1Location.sbPartnerId);
    updData.nameEn = utils.nullToStr(locData.pageGroup.step1Location.nameEn);
    updData.nameTh = utils.nullToStr(locData.pageGroup.step1Location.nameTh);
    updData.abbrev = utils.nullToStr(locData.pageGroup.step1Location.abbrev);
    updData.isOpeningMon = utils.nullToStr(locData.pageGroup.step1Location.isOpeningMon);
    updData.openingHourMon = utils.nullToStr(locData.pageGroup.step1Location.openingHourMon);
    updData.closingHourMon = utils.nullToStr(locData.pageGroup.step1Location.closingHourMon);
    updData.isOpeningTue = utils.nullToStr(locData.pageGroup.step1Location.isOpeningTue);
    updData.openingHourTue = utils.nullToStr(locData.pageGroup.step1Location.openingHourTue);
    updData.closingHourTue = utils.nullToStr(locData.pageGroup.step1Location.closingHourTue);

    updData.isOpeningWed = utils.nullToStr(locData.pageGroup.step1Location.isOpeningWed);
    updData.openingHourWed = utils.nullToStr(locData.pageGroup.step1Location.openingHourWed);
    updData.closingHourWed = utils.nullToStr(locData.pageGroup.step1Location.closingHourWed);

    updData.isOpeningThu = utils.nullToStr(locData.pageGroup.step1Location.isOpeningThu);
    updData.openingHourThu = utils.nullToStr(locData.pageGroup.step1Location.openingHourThu);
    updData.closingHourThu = utils.nullToStr(locData.pageGroup.step1Location.closingHourThu);

    updData.isOpeningFri = utils.nullToStr(locData.pageGroup.step1Location.isOpeningFri);
    updData.openingHourFri = utils.nullToStr(locData.pageGroup.step1Location.openingHourFri);
    updData.closingHourFri = utils.nullToStr(locData.pageGroup.step1Location.closingHourFri);
    updData.isOpeningSat = utils.nullToStr(locData.pageGroup.step1Location.isOpeningSat);

    updData.openingHourSat = utils.nullToStr(locData.pageGroup.step1Location.openingHourSat);
    updData.closingHourSat = utils.nullToStr(locData.pageGroup.step1Location.closingHourSat);
    updData.isOpeningSun = utils.nullToStr(locData.pageGroup.step1Location.isOpeningSun);
    updData.openingHourSun = utils.nullToStr(locData.pageGroup.step1Location.openingHourSun);
    updData.closingHourSun = utils.nullToStr(locData.pageGroup.step1Location.closingHourSun);

    updData.isOpeningHoliday = utils.nullToStr(locData.pageGroup.step1Location.isOpeningHoliday);
    updData.openingHourHoliday = utils.nullToStr(locData.pageGroup.step1Location.openingHourHoliday);
    updData.closingHourHoliday = utils.nullToStr(locData.pageGroup.step1Location.closingHourHoliday);
    updData.cmd = "put";
    updData.phone = [];

    if (locData.pageGroup.step1Location.contactNumber && Array.isArray(locData.pageGroup.step1Location.contactNumber)) {

        locData.pageGroup.step1Location.contactNumber.forEach(function (element) {
            var phoneData = {};
            var cmd = 'post';
            if (element.phoneId && element.phoneId.length > 0) {
                phoneData.phoneId = element.phoneId;
                cmd = 'put';
            }
            phoneData.phoneType = utils.nullToStr(element.phoneType);
            phoneData.phoneNumber = utils.nullToStr(element.phoneNumber);
            phoneData.phoneExt = utils.nullToStr(element.phoneExt);
            phoneData.phoneMainFlg = utils.nullToStr(element.phoneMainFlg);
            phoneData.cmd = cmd;
            updData.phone.push(phoneData);
        });
    }

    if (locData.pageGroup.step3Address.address && Array.isArray(locData.pageGroup.step3Address.address)) {
        for (var index = 0; index < locData.pageGroup.step3Address.address.length; index++) {
            var element = locData.pageGroup.step3Address.address[index];
            if (element.addressType == 'LOCATION_ADDR') {
                updData.subRegion = utils.nullToStr(element.subRegionCode);
                break;
            }
        }

    }

    return updData;
}

function parseAddressUpdData(locData) {
    var adessses = [];
    if (locData.pageGroup.step3Address.address && Array.isArray(locData.pageGroup.step3Address.address)) {
        locData.pageGroup.step3Address.address.forEach(function (element) {
            var addressData = {};
            var cmd = 'post';
            if (element.addressId && element.addressId.length > 0) {
                addressData.addressId = element.addressId;
                cmd = 'put';
            }
            addressData.companyId = utils.nullToStr(locData.pageGroup.selectChannel.companyId);
            addressData.licenseCode = utils.nullToStr(locData.pageGroup.step1Location.licenseCode);
            addressData.addressType = element.addressType;
            addressData.modifiedBy = locData.modifiedBy;
            addressData.houseNo = element.houseNo;
            addressData.moo = element.moo;
            addressData.mooban = element.mooban;
            addressData.building = element.building;
            addressData.floor = element.floor;
            addressData.room = element.room;
            addressData.soi = element.soi;
            addressData.street = element.street;
            addressData.zipCode = element.zipCode;
            addressData.tumbolTh = element.tumbolTh;
            addressData.amphurTh = element.amphurTh;
            addressData.provinceNameTh = element.provinceNameTh;
            addressData.provinceCode = element.provinceCode;
            addressData.countryCode = element.countryCode;
            addressData.subRegionCode = element.subRegionCode;
            addressData.remark = element.remark;
            addressData.zipCodeId = element.zipCodeId;
            addressData.partyType = 'Location';
            addressData.cmd = cmd;
            adessses.push(addressData);
        });

    }
    return adessses;
}

function parseVatAddressUpdData(locData) {
    var vatAdessses = [];
    if (locData.pageGroup.step3Address.vatAddress && Array.isArray(locData.pageGroup.step3Address.vatAddress)) {
        locData.pageGroup.step3Address.vatAddress.forEach(function (element) {
            var vatAddress = {};
            var cmd = 'post';
            if (element.ownerLocation && element.ownerLocation.length > 0) {
                cmd = 'post';
            } else if (element.vatAddressId && element.vatAddressId.length > 0) {
                vatAddress.vatAddressId = element.vatAddressId;
                element.ownerLocation = locData.locationCode;
                cmd = 'put';
            }
            vatAddress.vatAddress = element.vatAddress;
            vatAddress.companyAbbr = element.companyAbbr;
            vatAddress.vatBranchNo = element.vatBranchNo;
            vatAddress.ownerLocationCode = element.ownerLocation;
            vatAddress.modifiedBy = locData.modifiedBy;
            vatAddress.cmd = cmd;
            vatAdessses.push(vatAddress);
        });

    }
    return vatAdessses;
}

function parseContactUpdData(locData) {
    var contacts = [];
    if (locData.pageGroup.step4Contact.contactPerson && Array.isArray(locData.pageGroup.step4Contact.contactPerson)) {
        locData.pageGroup.step4Contact.contactPerson.forEach(function (element) {
            var contact = {};
            var cmd = 'post';
            if (element.personId && element.personId.length > 0) {
                contact.personId = element.personId;
                cmd = 'put';
            }
            contact.isMain = element.isMain;
            contact.pinCode = element.pinCode;
            contact.fnameTh = element.fnameTh;
            contact.lnameTh = element.lnameTh;
            contact.fnameEn = element.fnameEn;
            contact.lnameEn = element.lnameEn;
            contact.titleTh = element.titleTh;
            contact.titleEn = element.titleEn;
            contact.isMain = element.isMain;

            contact.phone = [];
            // contact.social = [];
            let social = [];
            if (element.phone && Array.isArray(element.phone)) {
                element.phone.forEach(function (itemPhone) {
                    var p = {};
                    var pCmd = 'post';
                    if (itemPhone.phoneId && itemPhone.phoneId.length) {
                        p.phoneId = itemPhone.phoneId;
                        contact.mainPhone = itemPhone.number;
                        pCmd = 'put';
                    }
                    p.type = itemPhone.type;
                    p.number = itemPhone.number;
                    p.ext = itemPhone.ext;
                    p.type = itemPhone.type;
                    p.isMain = itemPhone.isMain;
                    p.cmd = pCmd;

                    contact.phone.push(p);
                });
            }

            if (element.social && Array.isArray(element.social)) {
                element.social.forEach(function (itemSocial) {
                    var p = {};
                    var pCmd = 'post';
                    if (itemSocial.socialId && itemSocial.socialId.length) {
                        p.socialId = itemSocial.socialId;
                        pCmd = 'put';
                    }
                    p.type = itemSocial.type;
                    p.social = itemSocial.social;
                    p.isMain = itemSocial.isMain;
                    p.cmd = pCmd;
                    social.push(p);
                });
            }
            if(social.length > 0){
                contact.social = social ;
            }
            contact.modifiedBy = locData.modifiedBy;
            contact.companyId = utils.nullToStr(locData.pageGroup.selectChannel.companyId);
            contact.contactSiebel = locData.contactSiebel;
            contact.cmd = cmd;
            contacts.push(contact);
        });
    }
    return contacts;
}

function editLocationPM(locData) {
    var promises = [];
    promises.push(
        migrateServ.updLocationInfo(locData.locationCode, parseGeneralUpdData(locData))
    );
    promises.push(
        migrateServ.updLocationAddress(locData.locationCode, parseAddressUpdData(locData))
    );
    promises.push(
        migrateServ.updLocationVatAddress(locData.locationCode, parseVatAddressUpdData(locData))
    );
    promises.push(
        migrateServ.updLocationContact(locData.locationCode, parseContactUpdData(locData))
    );
    return new Promise((resolve, reject) => {
        try {
            Promise.all(promises).then(function (resultUpd) {
                var hasError = false;
                resultUpd.forEach(function (item) {
                    if (item.error) {
                        hasError = true;
                        locData.error = locData.error && Array.isArray(locData.error) ? locData.error : [];
                        locData.error.push(item.method + ':' + item.error);
                    }
                });
                locData.result = hasError ? 'fail' : 'success';
                resolve(locData);
            }).catch(function (err) {
                logger.error(err);
                locData.result = 'fail';
                locData.error = err.method + ':' + err.error;
                resolve(locData);
            });
        } catch (error) {
            logger.errorStack(error);
            locData.result = 'fail';
            locData.error = error;
            resolve(locData);
        }
    });
}

function getLocationByLocationCodePM(locData) {
    var promises = [];
    promises.push( //get location profile 
        new Promise((resolve, reject) => {
            try {
                migrateServ.getLocationByLocationCode(locData.locationCode).then(function (result) {
                    var thatResolve = resolve;
                    if (result.resultCode != '20000') {
                        reject(result.resultCode + ':' + result.resultDescription);
                        return;
                    }
                    var location = result.resultData[0].viewLocationList[0];
                    if (location == null) {
                        reject('location is null');
                        return;
                    }
                    return migrateServ.getLocationProfile(locData.locationCode, location.subRegion)
                        .then(function (locProfile) {
                            var profile = locProfile;
                            location.profile = profile;
                            return thatResolve(location);
                        }).catch(function (err) {
                            return thatResolve(location);
                        });

                }).catch(function (err) {
                    reject(err.message);
                    // resolve(null);
                });
            } catch (error) {
                // console.error(error);
                // locData.error = error;
                reject(error.message);
            }
        })
    );

    promises.push( //get location info 
        new Promise((resolve, reject) => {
            try {
                migrateServ.getLocationInfo(locData.locationCode).then(function (result) {
                    var locationInfo = result;
                    resolve(locationInfo);
                }).catch(function (err) {
                    resolve(null);
                });
            } catch (error) {
                console.error(error);
                locData.error = error;
                resolve(null);
            }
        })
    );

    promises.push( //get location address 
        new Promise((resolve, reject) => {
            try {
                migrateServ.getLocationAddress(locData.locationCode).then(function (result) {
                    var locationAddress = result;
                    resolve(locationAddress);
                }).catch(function (err) {
                    resolve(null);
                });
            } catch (error) {
                console.error(error);
                locData.error = error;
                resolve(null);
            }
        })
    );

    promises.push( //get location vat address 
        new Promise((resolve, reject) => {
            try {
                migrateServ.getLocationVatAddress(locData.locationCode).then(function (result) {
                    var locationVatAddress = result;
                    resolve(locationVatAddress);
                }).catch(function (err) {
                    resolve(null);
                });
            } catch (error) {
                console.error(error);
                locData.error = error;
                resolve(null);
            }
        })
    );

    promises.push( //get location contact
        new Promise((resolve, reject) => {
            try {
                migrateServ.getLocationContact(locData.locationCode).then(function (result) {
                    var locationContact = result;
                    resolve(locationContact);
                }).catch(function (err) {
                    resolve(null);
                });
            } catch (error) {
                console.error(error);
                locData.error = error;
                resolve(null);
            }
        })
    );

    return Promise.all(promises).then(function (resultLoc) {
        var location = {
            locationCode: locData.locationCode
        };
        location.rowId = locData.rowId;
        location.createdBy = locData.createdBy;
        location.createdDate = locData.createdDate;
        location.migrateDate = locData.migrateDate;
        location.modifiedBy = locData.modifiedBy;
        location.modifiedDate = locData.modifiedDate;

        location.profile = resultLoc[0];
        location.general = resultLoc[1];
        location.address = resultLoc[2];
        location.vatAddress = resultLoc[3];
        location.contact = resultLoc[4];
        return location;
    }).catch(function (err) {
        return err;
    });

}

function migrateData(req, idCache, dataMigrate) {
    var objCache = cache.get(idCache);
    var promises = [];
    logger.debug('consider condition add or edit data for migrate.');
    objCache.totalSent = dataMigrate.length;
    var retCount = 0;
    try {
        for (var index = 0; index < dataMigrate.length; index++) {
            var locData = dataMigrate[index];
            var isEdit = locData.data && locData.data.hasChildId;
            logger.debug('locationCode ' + locData.locationCode + ' :: ' + (isEdit ? 'EDIT' : 'ADD'));
            if (isEdit) {
                promises.push(editLocationPM(locData).then(function (result) {
                    retCount++;
                    objCache.retCount = retCount;
                    cache.put(idCache, objCache);
                    return result;
                }));
            } else {
                promises.push(addLocationPM(locData).then(function (result) {
                    retCount++;
                    objCache.retCount = retCount;
                    cache.put(idCache, objCache);
                    return result;
                }));
            }
            objCache.sentCount = (index + 1);
            cache.put(idCache, objCache);

        }
        return Promise.all(promises).then(function (result) {
            logger.info('result size :: ' + result.length);
            objCache.status = 'gen result';
            // objCache.endTime = moment();
            // objCache.processTime = objCache.endTime.diff(objCache.startTime, 'milliseconds');
            cache.put(idCache, objCache);
            logger.info('objCache :: ' + JSON.stringify(objCache));

            const excelData = xlsx.parse(objCache.file.path);
            var sheetLocation = excelData[0];
            var headerExcel = sheetLocation.data.shift();
            var listData = [];
            for (var i = 0; i < sheetLocation.data.length; i++) {
                var dataRow = {};
                var row = sheetLocation.data[i];
                var locationCode = row[0];
                if (!(locationCode && locationCode.length > 0)) {
                    var idxFind = i - 1;
                    while (idxFind >= 0 && !(locationCode && locationCode.length > 0)) {
                        locationCode = sheetLocation.data[idxFind][0];
                        idxFind--;
                    }
                }
                for (var index = 0; index < headerExcel.length; index++) {
                    var key = headerExcel[index];
                    dataRow[key] = row[index];
                }
                var resObj = _.find(result, function (ele) {
                    return ele.locationCode == locationCode;
                });
                if (resObj) {
                    dataRow['RESULT'] = resObj.result;
                    var errStrig = '';
                    if (resObj.result != 'success' && Array.isArray(resObj.error)) {
                        errStrig = resObj.error.join();
                    } else if (resObj.result != 'success') {
                        errStrig = resObj.error;
                    }
                    dataRow['ERROR'] = errStrig;
                    dataRow['RESPONSE'] = JSON.stringify(resObj.response);
                }
                listData.push(dataRow);
            }
            headerExcel.push('RESULT');
            headerExcel.push('ERROR');
            headerExcel.push('RESPONSE');

            var excelBinary = exportExcel(listData, 'Location Result', headerExcel);
            // var fs = require('fs');
            var fileName = 'result-' + idCache + '.xlsx';
            var writeStream = fs.createWriteStream(tmpPath + '/' + fileName);
            writeStream.write(excelBinary);
            // writeStream.close();
            writeStream.end();
            logger.info('export excel :: ' + fileName);
            objCache.status = 'complete';
            objCache.resultFile = fileName;
            objCache.endTime = moment();
            objCache.processTime = objCache.endTime.diff(objCache.startTime, 'milliseconds');
            cache.put(idCache, objCache);
            return result;
        }).catch(function (err) {
            logger.error(err)
            objCache.status = 'error';
            objCache.error = err;
            objCache.endTime = moment();
            objCache.processTime = objCache.endTime.diff(objCache.startTime, 'milliseconds');
            cache.put(idCache, objCache);

        });
    } catch (error) {
        logger.errorStack(error)
        objCache.status = 'error';
        objCache.error = error.message;
        objCache.endTime = moment();
        objCache.processTime = objCache.endTime.diff(objCache.startTime, 'milliseconds');
        return null;
    }

}

function postMigrateData(objCache, jsonData) {
    var idCache = objCache.id;
    var d = new Date();
    var d_date = d.yyyymmddhhmmss(false);
    // var jsonData = (req.body);
    var promisArray = [];
    console.log('Message in App');
    for (let i = 0; i < jsonData.length; i++) {
        var tmp = jsonData[i];
        tmp.idCache = idCache;
        promisArray.push(promiseSendSDF(jsonData[i]));
        objCache.sendSdf = (i + 1);
        cache.put(idCache, objCache);
        // sleep(500);
    }
    Promise.all(promisArray).then(function (indexresponse) {
        console.log('invoke Promise.all');
        var success_value = [];
        var error_value = [];
        for (let i = 0; i < indexresponse.length; i++) {
            var rowdata;
            var dataresponse;
            // Get response from BE
            if (indexresponse[i].response != undefined) {
                console.log('############################################## : ' + JSON.stringify(indexresponse[i]));
                if (indexresponse[i].response.resultCode == 20000) {
                    console.log('resultCode Success');
                    if (indexresponse[i].response.resultData != undefined) {
                        for (let j = 0; j < indexresponse[i].response.resultData.length; j++) {
                            if (indexresponse[i].response.resultData[j].createLocation != undefined) {
                                rowdata = indexresponse[i].response.resultData[j].createLocation.row;
                            } else {
                                rowdata = indexresponse[i].row;
                            }
                            dataresponse = indexresponse[i].response;
                        }
                    } else {
                        rowdata = indexresponse[i].row;
                        dataresponse = indexresponse[i].response
                    }

                    let request = new Request(
                        // rowMap.get(i)
                        rowdata
                    );
                    request.createJson();

                    let response = new Response(
                        // indexresponse[i]
                        dataresponse
                    );
                    response.createJson();

                    let sdfResponse = new SDFResponse(
                        request.getDataJson(), response.getDataJson()
                    );
                    sdfResponse.createJson();

                    // success_value.push(indexresponse[i]);
                    success_value.push(sdfResponse.getDataJson());
                } else {
                    console.log('resultCode Not Success');
                    if (indexresponse[i].response.resultData != undefined) {
                        for (let j = 0; j < indexresponse[i].response.resultData.length; j++) {
                            if (indexresponse[i].response.resultData[j].createLocation != undefined) {
                                rowdata = indexresponse[i].response.resultData[j].createLocation.row;
                            } else {
                                rowdata = indexresponse[i].row;
                            }
                            dataresponse = indexresponse[i].response;
                        }
                    } else {
                        rowdata = indexresponse[i].row;
                        dataresponse = indexresponse[i].response
                    }
                    let request = new Request(
                        // rowMap.get(i)
                        rowdata
                    );
                    request.createJson();

                    let response = new Response(
                        // indexresponse[i]
                        dataresponse
                    );
                    response.createJson();

                    let sdfResponse = new SDFResponse(
                        request.getDataJson(), response.getDataJson()
                    );
                    sdfResponse.createJson();
                    error_value.push(sdfResponse.getDataJson());
                }
            }
            // not have response from BE
            else if (indexresponse[i].error != undefined) {
                let request = new Request(
                    indexresponse[i].row
                );
                request.createJson();

                let timeout = new Timeout(
                    '5000', 'Timeout'
                )
                timeout.createJson();

                let response = new Response(
                    timeout.getDataJson()
                );
                response.createJson();

                let sdfResponse = new SDFResponse(
                    request.getDataJson(), response.getDataJson()
                );
                sdfResponse.createJson();

                error_value.push(sdfResponse.getDataJson());
            } else {
                console.log('ERROR!!');
                let request = new Request(
                    indexresponse[i].row
                );
                request.createJson();

                let timeout = new Timeout(
                    'ERROR', 'Data response invalid'
                )
                timeout.createJson();

                let response = new Response(
                    timeout.getDataJson()
                );
                response.createJson();

                let sdfResponse = new SDFResponse(
                    request.getDataJson(), response.getDataJson()
                );
                sdfResponse.createJson();

                error_value.push(sdfResponse.getDataJson());
            }
        }
        // Write log success
        if (success_value.length != 0) {
            var file = `${__dirname}/data/success` + d_date + `.json`;
            var obj = success_value;

            jsonfile.writeFileSync(file, obj);
        }

        // Write log error
        if (error_value.length != 0) {
            var file = `${__dirname}/data/error` + d_date + `.json`;
            var obj = error_value;

            jsonfile.writeFileSync(file, obj);
        }
        resData = {
            success: success_value,
            fail: error_value
        };
        objCache.status = 'complete';
        objCache.success = success_value;
        objCache.fail = error_value;
        cache.put(idCache, objCache);
        // res.json({
        //     "result": "fail"
        // });
        // res.json(resData);
        // res.end(JSON.stringify(resData));
    }).catch((error) => {

        console.log('Data Respons Invalid');
        objCache.error = error;
        objCache.status = 'error';
        cache.put(idCache, objCache);
        // res.json(error);
        // let request = new Request(
        //     'Data catch'
        // );
        // request.createJson();

        // let response = new Response(
        //     indexresponse[i].response
        // );
        // response.createJson();

        // let sdfResponse = new SDFResponse(
        //     request.getDataJson(), response.getDataJson()
        // );
        // sdfResponse.createJson();

        // error_value.push(sdfResponse.getDataJson());

        // // Write log success
        // if (success_value.length != 0) {
        //     var file = `${__dirname}/data/success` + d_date + `.json`;
        //     var obj = success_value;

        //     jsonfile.writeFileSync(file, obj);
        // }

        // // Write log error
        // if (error_value.length != 0) {
        //     var file = `${__dirname}/data/error` + d_date + `.json`;
        //     var obj = error_value;

        //     jsonfile.writeFileSync(file, obj);
        // }

        // resData = { success: success_value, fail: error_value };
        // res.end(JSON.stringify(resData));
    });

}

function parseGeneralData(migrateData) {
    var queryData = migrateData.queryData;
    var result = [];
    for (var index = 0; index < queryData.length; index++) {
        var element = queryData[index];
        var generalObj = {};
        generalObj.LocationCode = element.locationCode;
        generalObj.CreatedBy = element.createdBy;
        generalObj.CreatedDate = element.createdDate;
        generalObj.MigrateDate = element.migrateDate;
        generalObj.ModifiedBy = element.modifiedBy;
        generalObj.ModifiedDate = element.modifiedDate;
        var info = element.general;
        var profile = element.profile || {};
        if (info == null) {
            result.push(generalObj);
            continue;
        }

        generalObj.DistChnCode = profile ? profile.distChnCode : '';
        generalObj.DistChnName = profile ? profile.distChnName : '';
        generalObj.ChnSalesCode = profile ? profile.chnSalesCode : '';
        generalObj.ChnSalesName = profile ? profile.chnSalesName : '';
        generalObj.CompanyAbbr = profile ? profile.companyAbbr : '';
        generalObj.CompanyId = profile ? profile.companyId : '';
        generalObj.CompanyIdNo = profile ? profile.companyIdNo : '';
        generalObj.CompanyTitleTh = profile ? profile.companyTitleTh : '';
        generalObj.CompanyNameTh = profile ? profile.companyNameTh : '';
        generalObj.LicenseCode = info.licenseCode;
        generalObj.SbPartnerId = info.sbPartnerId;
        generalObj.locationIdType = info.locationIdType;
        generalObj.locationIdNo = info.locationIdNo;
        generalObj.LocationIdForSB = info.locationIdForSB;
        generalObj.TitleTh = profile ? profile.companyTitleTh : '';
        generalObj.NameEn = info.locationNameEn;
        generalObj.NameTh = info.locationNameTh;
        generalObj.Abbrev = info.locationAbbrev;

        generalObj.Status = info.status;
        generalObj.EffectiveDt = info.effectiveDt;
        generalObj.TerminateDt = info.terminateDt;
        generalObj.remark = info.remark;
        generalObj.RetailShop = info.retailShop;
        generalObj.ShopSegment = info.shopSegment;
        generalObj.ShopArea = info.shopArea;
        generalObj.ShopType = info.shopType;
        generalObj.ShopSize = info.shopSize;
        generalObj.IsOpeningMon = info.isOpeningMon;
        generalObj.OpeningHourMon = info.openingHourMon;
        generalObj.ClosingHourMon = info.closingHourMon;
        generalObj.IsOpeningTue = info.isOpeningTue;
        generalObj.OpeningHourTue = info.openingHourTue;
        generalObj.ClosingHourTue = info.closingHourTue;
        generalObj.IsOpeningWed = info.isOpeningWed;
        generalObj.OpeningHourWed = info.openingHourWed;
        generalObj.ClosingHourWed = info.closingHourWed;
        generalObj.IsOpeningThu = info.isOpeningThu;
        generalObj.OpeningHourThu = info.openingHourThu;
        generalObj.ClosingHourThu = info.closingHourThu;
        generalObj.IsOpeningFri = info.isOpeningFri;
        generalObj.OpeningHourFri = info.openingHourFri;
        generalObj.ClosingHourFri = info.closingHourFri;
        generalObj.IsOpeningSat = info.isOpeningSat;
        generalObj.OpeningHourSat = info.openingHourSat;
        generalObj.ClosingHourSat = info.closingHourSat;
        generalObj.IsOpeningSun = info.isOpeningSun;
        generalObj.OpeningHourSun = info.openingHourSun;
        generalObj.ClosingHourSun = info.closingHourSun;
        generalObj.IsOpeningHoliday = info.isOpeningHoliday;
        generalObj.OpeningHourHoliday = info.openingHourHoliday;
        generalObj.ClosingHourHoliday = info.closingHourHoliday;

        generalObj.BusinessRegistration = info.busRegistration;
        generalObj.LocationVatBranchNo = info.locationVatBranchNo;
        generalObj.LocationVatBranchName = info.locationVatBranchName;

        generalObj.TypeCodeSB = info.typeCodeSB;
        generalObj.SubTypeCodeSB = info.subTypeCodeSB;
        generalObj.BusinessTypeSB = info.businessTypeSB;
        generalObj.CharacteristicSB = info.characteristicSB;
        generalObj.Region = profile ? profile.region : '';
        generalObj.SubRegion = profile ? profile.subRegion : '';
        var phone = info.phone || [];
        if (phone.length == 0) {
            result.push(generalObj);
            continue;
        }
        for (var j = 0; j < phone.length; j++) {
            var p = phone[j];
            var tmp = JSON.parse(JSON.stringify(generalObj));
            tmp.ContactNumber_PhoneId = utils.nullToStr(p.phoneId);
            tmp.ContactNumber_PhoneType = utils.nullToStr(p.phoneType);
            tmp.ContactNumber_PhoneNumber = utils.nullToStr(p.phoneNumber);
            tmp.ContactNumber_PhoneExt = utils.nullToStr(p.phoneExt);
            tmp.ContactNumber_phoneMainFlg = utils.nullToStr(p.phoneMainFlg);
            result.push(tmp);
        }
    }
    return result;
}

function parseAddressData(migrateData) {
    var queryData = migrateData.queryData;
    var result = [];

    for (var index = 0; index < queryData.length; index++) {
        var element = queryData[index];
        var obj = {};
        obj.LocationCode = element.locationCode;
        var address = element.address;
        var info = element.general;

        if (!(address && address.length > 0)) {
            result.push(obj);
            continue;
        }
        for (var j = 0; j < address.length; j++) {
            var p = address[j];
            var tmp = JSON.parse(JSON.stringify(obj));
            tmp.Address_AddressId = utils.nullToStr(p.addressId);
            tmp.Address_AddressType = utils.nullToStr(p.addressType);
            tmp.Address_Moo = utils.nullToStr(p.moo);
            tmp.Address_HouseNo = utils.nullToStr(p.houseNo);
            tmp.Address_Mooban = utils.nullToStr(p.mooban);
            tmp.Address_Building = utils.nullToStr(p.building);
            tmp.Address_Floor = utils.nullToStr(p.floor);
            tmp.Address_Room = utils.nullToStr(p.room);
            tmp.Address_Soi = utils.nullToStr(p.soi);
            tmp.Address_Street = utils.nullToStr(p.street);
            tmp.Address_ZipCode = utils.nullToStr(p.zipCode);
            tmp.Address_TumbolTh = utils.nullToStr(p.tumbolTh);
            tmp.Address_AmphurTh = utils.nullToStr(p.amphurTh);
            tmp.Address_ProvinceNameTh= utils.nullToStr(p.provinceNameTh);
            tmp.Address_ProvinceCode = utils.nullToStr(p.provinceCode);
            tmp.Address_CountryCode = utils.nullToStr(p.country);
            tmp.Address_SubRegionCode = utils.nullToStr(p.subRegion);
            tmp.Address_Remark = utils.nullToStr(p.remark);
            tmp.Address_ZipCodeId = utils.nullToStr(p.zipCodeId);
            if (info) {
                tmp.LocationIdForSB = utils.nullToStr(info.locationIdForSB);
            }

            result.push(tmp);
        }
    }
    return result;
}

function parseVatAddressData(migrateData) {
    var queryData = migrateData.queryData;
    var result = [];
    for (var index = 0; index < queryData.length; index++) {
        var element = queryData[index];
        '', '', '', '', '', ''
        var obj = {};
        obj.LocationCode = element.locationCode;
        var vatAddress = element.vatAddress;
        var info = element.general;
        if (!(vatAddress && vatAddress.length > 0)) {
            result.push(obj);
            continue;
        }

        for (var j = 0; j < vatAddress.length; j++) {
            var p = vatAddress[j];
            var tmp = JSON.parse(JSON.stringify(obj));
            tmp.VatAddress_VatAddressId = utils.nullToStr(p.vatAddressId);
            tmp.VatAddress_CompanyAbbrev = utils.nullToStr(p.companyAbbr);
            tmp.VatAddress_VatBranchNo = utils.nullToStr(p.vatBranchNo);
            tmp.VatAddress_Address = utils.nullToStr(p.vatAddress);
            tmp.VatAddress_OwnerLocation = utils.nullToStr(p.ownerLocationCode);
            if (info) {
                tmp.LocationIdForSB = utils.nullToStr(info.locationIdForSB);
            }
            result.push(tmp);
        }
    }
    return result;
}

function parseContactData(migrateData) {
    var queryData = migrateData.queryData;
    var result = [];
    for (var index = 0; index < queryData.length; index++) {
        var element = queryData[index];
        var obj = {};
        obj.LocationCode = element.locationCode;

        var contact = element.contact;
        var info = element.general;
        if (!(contact && contact.length > 0)) {
            result.push(obj);
            continue;
        }

        for (var j = 0; j < contact.length; j++) {
            var c = contact[j];
            var tmp = JSON.parse(JSON.stringify(obj));
            tmp.ContactPerson_PersonId = utils.nullToStr(c.personId);
            tmp.ContactPerson_Pincode = utils.nullToStr(c.pinCode);
            tmp.ContactPerson_TitleTh = utils.nullToStr(c.titleTh);
            tmp.ContactPerson_TitleEn = utils.nullToStr(c.titleEn);
            tmp.ContactPerson_FnameTh = utils.nullToStr(c.fnameTh);
            tmp.ContactPerson_LnameTh = utils.nullToStr(c.lnameTh);
            tmp.ContactPerson_FnameEn = utils.nullToStr(c.fnameEn);
            tmp.ContactPerson_LnameEn = utils.nullToStr(c.lnameEn);
            tmp.ContactPerson_IsMain = utils.nullToStr(c.isMain);
            tmp.ContactPerson_IdNumber = utils.nullToStr(c.idNumber);
            tmp.ContactPerson_IdType = utils.nullToStr(c.idType);
            tmp.ContactPerson_Role = utils.nullToStr(c.role);
            var phone = c.phone;
            var social = c.social;

            if (!(phone && phone.length > 0) && !(social && social.length > 0)) {
                result.push(tmp);
                continue;

            }
            var a = phone ? phone.length : 0;
            var b = social ? social.length : 0;
            var max = a > b ? a : b;

            for (var k = 0; k < max; k++) {
                var ext = extend({}, tmp);
                if (phone && k < phone.length) {
                    var p = phone[k];
                    ext.ContactPerson_Phone_Id = utils.nullToStr(p.phoneId);
                    ext.ContactPerson_Phone_Type = utils.nullToStr(p.type);
                    ext.ContactPerson_Phone_Number = utils.nullToStr(p.number);
                    ext.ContactPerson_Phone_Ext = utils.nullToStr(p.ext);
                    ext.ContactPerson_Phone_IsMain = utils.nullToStr(p.isMain)
                }
                if (social && k < social.length) {
                    var s = social[k];
                    ext.ContactPerson_Social_Id = utils.nullToStr(s.socialId);
                    ext.ContactPerson_Social_Type = utils.nullToStr(s.type);
                    ext.ContactPerson_Social_Social = utils.nullToStr(s.social);
                    ext.ContactPerson_Social_IsMain = utils.nullToStr(s.isMain);
                }
                if (info) {
                    ext.LocationIdForSB = utils.nullToStr(info.locationIdForSB);
                }

                result.push(ext);
            }
        }
    }
    return result;
}

exports.migrateDataExcel = (req, res, next) => {
    logger.info('API migrate data excel file ' + (req.file ? req.file.originalname : 'null'));
    var startTime = moment();
    var file = req.file;
    if (!file) {
        logger.error('file is null');
        res.json({
            responseCode: 403,
            responseMessage: 'Fail',
            responseDescription: 'file is null',
            error: ['file is null.']
        });
        return;
    }
    var tmpArr = file.filename.split("-");
    var idCache = tmpArr[tmpArr.length - 1];
    try {
        var objCache = {
            id: idCache,
            file: file,
            status: 'upload data.',
            startTime: startTime
        };
        cache.put(idCache, objCache);
        logger.debug('save stat in cache [' + idCache + ']');
        var dataMigrate = loadDataExcel(idCache, file.path, req);
        var locMod = dataMigrate[0];
        var migrateMod = {};
        migrateMod.transactionId = idCache;
        migrateMod.migrateDate = new Date();
        migrateMod.migrateBy = req.currentUser ? req.currentUser.username : locMod.modifiedBy;
        migrateMod.fileLocation = file.path;
        migrateMod.status = 'group-data';
        migrateMod.migrateData = dataMigrate;
        MigrateMod.create(migrateMod, function (err, mgMod) {
            logger.debug('save data to db ::' + idCache);
            if (err) {
                logger.error(err);
            }
        });
        objCache.status = 'parse data.'
        cache.put(idCache, objCache);
        logger.info('parse file time ' + moment().diff(startTime, 'milliseconds') + 'ms.');
        res.json({
            responseCode: 200,
            responseMessage: 'Success',
            responseDescription: 'parse data success',
            data: objCache
        });
        var retPm = migrateData(req, idCache, dataMigrate);
        if (retPm != null) {
            retPm.then(function (result) {
                if (result && Array.isArray(result)) {
                    objCache = cache.get(idCache);
                    objCache.statusQuery = 'start';
                    cache.put(idCache, objCache);
                    var promises = [];
                    result.forEach(function (ele) {
                        promises.push(getLocationByLocationCodePM(ele))
                    });
                    Promise.all(promises).then(function (resultAll) {
                        objCache.statusQuery = 'complete';
                        cache.put(idCache, objCache);
                        var query = {
                            transactionId: idCache
                        };
                        MigrateMod.find(query, function (err, docs) {
                            if (err) {
                                logger.error('find migratedata ' + idCache + ' error :: ', err);
                                return;
                            }
                            if (docs && docs.length > 0) {
                                var migrateMod = docs[0];
                                migrateMod.queryData = resultAll;
                                migrateMod.save(function (err, mgRes) {
                                    logger.info('save response query ' + (err ? 'error' : 'success'));
                                });
                            }
                        });
                    }).catch(function (errorAll) {
                        objCache.error = errorAll;
                        objCache.statusQuery = 'error';
                        cache.put(idCache, objCache);
                    });;
                }
            });
        }
    } catch (error) {
        logger.errorStack(error)
        res.status(500).json({
            responseCode: 500,
            responseMessage: error.message
        });
    }


}

exports.getExcelFile = function (req, res) {
    var transactionId = req.params.id;
    var fileType = req.params.type;
    var report = null;
    if (fileType == 'general') {
        MigrateMod.findOne({
            transactionId: transactionId
        }, function (err, migrateData) {
            if (err) {
                logger.error(err);
                return res.status(500).send(err);
            }
            if (!migrateData) {
                return res.status(404).send('data not found');
            }
            var dataList = parseGeneralData(migrateData);
            var report = exportExcel(dataList, 'General', _const.EXCEL_GENERAL_HEADER);
            res.attachment('general-' + transactionId + '.xlsx'); // This is sails.js specific (in general you need to set headers) 
            return res.send(report);
        });
        return;
    } else if (fileType == 'address') {
        MigrateMod.findOne({
            transactionId: transactionId
        }, function (err, migrateData) {
            if (err) {
                logger.error(err);
                return res.status(500).send(err);
            }
            if (!migrateData) {
                return res.status(404).send('data not found');
            }
            var dataList = parseAddressData(migrateData);
            var report = exportExcel(dataList, 'Address', _const.EXCEL_ADDRESS_HEADER);
            res.attachment('address-' + transactionId + '.xlsx'); // This is sails.js specific (in general you need to set headers) 
            return res.send(report);
        });
        return;

    } else if (fileType == 'vat-address') {
        MigrateMod.findOne({
            transactionId: transactionId
        }, function (err, migrateData) {
            if (err) {
                logger.error(err);
                return res.status(500).send(err);
            }
            if (!migrateData) {
                return res.status(404).send('data not found');
            }
            var dataList = parseVatAddressData(migrateData);
            var report = exportExcel(dataList, 'Vat-Address', _const.EXCEL_VAT_ADDRESS_HEADER);
            res.attachment('vat-address-' + transactionId + '.xlsx'); // This is sails.js specific (in general you need to set headers) 
            return res.send(report);
        });
        return;
    } else if (fileType == 'contact') {
        MigrateMod.findOne({
            transactionId: transactionId
        }, function (err, migrateData) {
            if (err) {
                logger.error(err);
                return res.status(500).send(err);
            }
            if (!migrateData) {
                return res.status(404).send('data not found');
            }
            var dataList = parseContactData(migrateData);
            var report = exportExcel(dataList, 'Contact', _const.EXCEL_CONTACT_HEADER);
            res.attachment('contact-' + transactionId + '.xlsx'); // This is sails.js specific (in general you need to set headers) 
            return res.send(report);
        });
        return;
    }

    return res.status(403).send('bad request');
}

exports.getResultFile = function (req, res) {
    var idCache = req.params.id;
    // 2017101704545394
    var filename = 'result-' + idCache + '.xlsx'
    const excelData = xlsx.parse(tmpPath + '/' + filename);
    var bufferExcel = xlsx.build(excelData);
    res.attachment(filename); // This is sails.js specific (in general you need to set headers) 
    return res.send(bufferExcel);
}

exports.checkStatusMigrate = (req, res, next) => {
    var idCache = req.params.id;
    if (!idCache || isNaN(parseInt(idCache)) || idCache.length < 14 ||
        !moment(idCache.substring(0, 14), 'YYYYMMDDHHmmss', true).isValid()) {
        res.json({
            resultCode: 403,
            resultDescription: 'id invalid format'
        });
        return;
    }
    var objCache = cache.get(idCache);
    if (objCache == null) {
        res.json({
            resultCode: 404,
            resultDescription: 'Not found'
        });
        return;
    }
    var ret = {
        resultCode: 200,
        resultDescription: objCache.status,
        data: objCache
    }
    res.json(ret);
}

exports.getMigrateData = (req, res, next) => {
    logger.info('get migrate data success ');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        MigrateMod.find('',{
            transactionId: 1,
            migrateDate: 1,
            migrateBy: 1,
            fileLocation: 1,
            status: 1,
        }, function (err, result) {

            if (err) {
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                return;
            }
            if (result == null) {
                ret.responseCode = 404;
                ret.responseMessage = 'Data not found';
                ret.responseDescription = 'Data not found';
                res.json(ret);
                return;
            }
            logger.info('get migrate data success ');
            result = _.sortBy(result, 'migrateDate');
            ret.data = result.reverse();
            res.json(ret);
        })/* .sort({
            migrateDate: 'desc'
        }); */
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }

}

function checkQuerySubDataIsNull(queryDataTmp) {
    if (queryDataTmp.general == null) {
        return true;
    }
    if (queryDataTmp.address == null) {
        return true;
    }
    if (queryDataTmp.vatAddress == null) {
        return true;
    }
    if (queryDataTmp.contact == null) {
        return true;
    }
    // vatAddress   
    return false;
}

function repairGetData(transactionId, req, res) {
    var ret = {};

    MigrateMod.findOne({
        transactionId: transactionId
    }, function (err, result) {
        if (err) {
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            return;
        }
        if (result == null) {
            ret.responseCode = 404;
            ret.responseMessage = 'data not found';
            ret.responseDescription = 'data not found';
            res.json(ret);
            return;
        }
        var midMod = result;
        let errorDataArr = [];
        var queryData = result.queryData;
        var migrateData = result.migrateData;
        for (var index = 0; index < queryData.length; index++) {
            var element = queryData[index];
            if (element === 'Error: socket hang up' || checkQuerySubDataIsNull(element)) {
                if (migrateData[index]) {
                    let locData = migrateData[index];
                    locData.idx = index;
                    errorDataArr.push(migrateData[index]);
                }
            }
        }

        let promises = [];
        errorDataArr.forEach(function (ele) {
            promises.push(getLocationByLocationCodePM(ele))
        });
        Promise.all(promises).then(function (resultAll) {
            for (var index = 0; index < errorDataArr.length; index++) {
                let element = errorDataArr[index];
                let idx = element.idx;
                queryData[idx] = resultAll[index];
            }
            var queryDataUpd = [];
            queryData.forEach(function (element) {
                queryDataUpd.push(element);
            });

            MigrateMod.update({
                _id: result._id,
            }, {
                $set: {
                    'queryData': queryDataUpd
                }

            }, function (err, mgRes) {
                logger.info('save response query ' + (err ? 'error' : 'success'));
                ret.responseCode = 200;
                ret.responseMessage = 'success';
                ret.data = mgRes;
                res.json(ret);
            });

        });


    });
}

exports.repairData = function (req, res) {
    var transactionId = req.params.id;
    repairGetData(transactionId, req, res);
}