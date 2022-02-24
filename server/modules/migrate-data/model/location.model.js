const _ = require('lodash');
var utils = require('../../../utils/common');

var parseContactNumber = function (row, data) {
    var contactArr = [];
    if (!Array.isArray(row)) {
        row = [row];
    }
    row.forEach(function (item) {
        var tmp = {};
        if (item.ContactNumber_PhoneId && item.ContactNumber_PhoneId.length > 0) {
            tmp.phoneId = item.ContactNumber_PhoneId;
            data.hasChildId = true;
        }
        tmp.phoneType = item.ContactNumber_PhoneType;
        tmp.phoneNumber = item.ContactNumber_PhoneNumber;
        tmp.phoneExt = item.ContactNumber_PhoneExt;
        tmp.phoneMainFlg = item.ContactNumber_phoneMainFlg;
        if (!utils.nullObj(tmp)) {
            tmp.rowId = item.rowId;
            contactArr.push(tmp);
        }
    });
    return contactArr;
}
var parseAddress = function (row, data) {
    var addressArr = [];
    if (!Array.isArray(row)) {
        row = [row];
    }
    row.forEach(function (item) {

        var tmp = {};
        if (item.Address_AddressId && item.Address_AddressId.length > 0) {
            tmp.addressId = item.Address_AddressId;
            data.hasChildId = true;
        }
        tmp.addressType = item.Address_AddressType;
        tmp.houseNo = item.Address_HouseNo;
        tmp.moo = item.Address_Moo;
        tmp.mooban = item.Address_Mooban;
        tmp.building = item.Address_Building;
        tmp.floor = item.Address_Floor;
        tmp.room = item.Address_Room;
        tmp.soi = item.Address_Soi;
        tmp.street = item.Address_Street;
        tmp.zipCode = item.Address_ZipCode;
        tmp.tumbolTh = item.Address_TumbolTh;
        tmp.amphurTh = item.Address_AmphurTh;
        tmp.provinceNameTh = item.Address_ProvinceNameTh;
        tmp.provinceCode = item.Address_ProvinceCode;
        tmp.countryCode = item.Address_CountryCode;
        tmp.subRegionCode = item.Address_SubRegionCode;
        tmp.remark = item.Address_Remark;
        tmp.zipCodeId = item.Address_ZipCodeId;
        if (!utils.nullObj(tmp)) {
            tmp.rowId = item.rowId;
            addressArr.push(tmp);
        }
    });
    return addressArr;
}

var parseVatAddress = function (row, data) {
    var vatAddressArr = [];
    if (!Array.isArray(row)) {
        row = [row];
    }
    row.forEach(function (item) {

        var tmp = {};
        if (item.VatAddress_VatAddressId && item.VatAddress_VatAddressId.length > 0) {
            tmp.vatAddressId = item.VatAddress_VatAddressId;
            // data.hasChildId = true;
        }
        tmp.vatAddressId = item.VatAddress_VatAddressId;
        tmp.companyAbbr = item.VatAddress_CompanyAbbrev;
        tmp.vatBranchNo = item.VatAddress_VatBranchNo;
        tmp.vatAddress = item.VatAddress_Address;
        tmp.ownerLocation = item.VatAddress_OwnerLocation;
        tmp.effectiveDt = utils.dateFormatSDF(item.effectiveDt);
        tmp.endDt = utils.dateFormatSDF(item.VatAddress_endDt);
        if (!utils.nullObj(tmp)) {
            tmp.rowId = item.rowId;
            vatAddressArr.push(tmp);
        }
    });
    return vatAddressArr;
}

var parseContactPersonPhone = function (row, data) {
    var phone = [];
    if (!Array.isArray(row)) {
        row = [row];
    }
    row.forEach(function (item) {
        var tmp = {};
        if (item.ContactPerson_Phone_Id && item.ContactPerson_Phone_Id.length > 0) {
            tmp.phoneId = item.ContactPerson_Phone_Id;
            data.hasChildId = true;
        }
        tmp.type = item.ContactPerson_Phone_Type;
        tmp.number = item.ContactPerson_Phone_Number;
        tmp.ext = item.ContactPerson_Phone_Ext;
        tmp.isMain = item.ContactPerson_Phone_IsMain;
        if (!utils.nullObj(tmp)) {
            tmp.rowId = item.rowId;
            phone.push(tmp);
        }
    });
    return phone;
}

var parseContactPersonSocial = function (row, data) {
    var social = [];
    if (!Array.isArray(row)) {
        row = [row];
    }
    row.forEach(function (item) {
        var tmp = {};
        if (item.ContactPerson_Social_Id && item.ContactPerson_Social_Id.length > 0) {
            tmp.socialId = item.ContactPerson_Social_Id;
            data.hasChildId = true;
        }
        tmp.type = item.ContactPerson_Social_Type;
        tmp.social = item.ContactPerson_Social_Social;
        tmp.isMain = item.ContactPerson_Social_IsMain;
        if (!utils.nullObj(tmp)) {
            tmp.rowId = item.rowId;
            social.push(tmp);
        }
    });
    return social;
}

function parseContactPerson(row, data) {
    var contactPersonArr = [];
    var idx = 0;
    var cpGrp = _.groupBy(row, function (item) {
        if (item.ContactPerson_Pincode && item.ContactPerson_Pincode.trim().length > 0) {
            idx++;
            return item.ContactPerson_Pincode;
        }
        var tmp = '';
        var lastIndex = idx;
        // var check
        while (lastIndex > 0 && tmp.length == 0) {
            lastIndex--;
            tmp = row[lastIndex].ContactPerson_Pincode && row[lastIndex].ContactPerson_Pincode.length > 0 ? row[lastIndex].ContactPerson_Pincode : '';

        }
        idx++;
        return tmp;
    });
    if (!Array.isArray(row)) {
        row = [row];
    }
    for (var key in cpGrp) {
        if (cpGrp.hasOwnProperty(key)) {
            var dataTmp = cpGrp[key];
            var cpItem = dataTmp[0];
            var tmp = {};
            if (cpItem.ContactPerson_PersonId && cpItem.ContactPerson_PersonId.length > 0) {
                tmp.personId = cpItem.ContactPerson_PersonId;
                data.hasChildId = true;
            }
            tmp.pinCode = cpItem.ContactPerson_Pincode;
            tmp.titleTh = cpItem.ContactPerson_TitleTh;
            tmp.fnameTh = cpItem.ContactPerson_FnameTh;
            tmp.lnameTh = cpItem.ContactPerson_LnameTh;
            tmp.titleEn = cpItem.ContactPerson_TitleEn;
            tmp.fnameEn = cpItem.ContactPerson_FnameEn;
            tmp.lnameEn = cpItem.ContactPerson_LnameEn;
            tmp.isMain = cpItem.ContactPerson_IsMain;
            tmp.IdNumber = cpItem.ContactPerson_IdNumber;
            tmp.IdType = cpItem.ContactPerson_IdType;
            tmp.role = cpItem.ContactPerson_Role;
            tmp.phone = parseContactPersonPhone(row, data);
            tmp.social = parseContactPersonSocial(row, data);
            if (!utils.nullObj(tmp)) {
                tmp.rowId = cpItem.rowId;
                contactPersonArr.push(tmp);
            }
        }
    }
    return contactPersonArr;
}

function Location(row) {
    if (!row) {
        throw 'object is null';
    }
    if (!Array.isArray(row)) {
        row = [row];
    }
    this.data = { rawData: row, hasChildId: false };

    var locData = row[0];
    if (!(locData.LocationCode && locData.LocationCode.length > 0)) {
        throw 'Location data invalid [location id]';
    }
    this.rowId = locData.rowId;
    this.locationCode = locData.LocationCode;
    this.createdBy = locData.CreatedBy;
    this.createdDate = utils.dateFormatSDF(locData.CreatedDate);
    this.migrateDate = utils.dateFormatSDF(locData.MigrateDate);
    this.modifiedBy = locData.ModifiedBy;
    this.modifiedDate = utils.dateFormatSDF(locData.ModifiedDate);
    this.sendSiebel = locData.SendSiebel;
    this.contactSiebel = locData.ContactSiebel;

    //step1lLocation parse
    this.pageGroup = {};
    this.pageGroup.selectChannel = {
        distChnCode: locData.DistChnCode,
        distChnName: locData.DistChnName,
        chnSalesCode: locData.ChnSalesCode,
        chnSalesName: locData.ChnSalesName,
        companyAbbr: locData.CompanyAbbr,
        companyId: locData.CompanyId,
        companyIdNo: locData.CompanyIdNo,
        companyTitleTh: locData.CompanyTitleTh,
        companyNameTh: locData.CompanyNameTh
    }
    this.pageGroup.profileInfo = {
        sbPartnerId: locData.SbPartnerId,
        licenseCode: locData.LicenseCode,
        locationIdType: locData.LocationIdType,
        locationIdNo: locData.LocationIdNo,
        locationIdForSB: locData.LocationIdForSB,
        titleTh: locData.TitleTh,
        nameEn: locData.NameEn,
        nameTh: locData.NameTh,
        abbrev: locData.Abbrev,
        status: locData.Status,
        effectiveDt: utils.dateFormatSDF(locData.EffectiveDt),
        terminateDt: utils.dateFormatSDF(locData.TerminateDt),
        remark: locData.Remark,
        retailShop: locData.RetailShop,
        shopSegment: locData.ShopSegment,
        shopArea: locData.ShopArea,
        shopType: locData.ShopType,
        shopSize: locData.ShopSize,
        //open
        isOpeningMon: utils.nullToStr(locData.IsOpeningMon),
        openingHourMon: utils.nullToStr(locData.OpeningHourMon),
        closingHourMon: utils.nullToStr(locData.ClosingHourMon),

        isOpeningTue: utils.nullToStr(locData.IsOpeningTue),
        openingHourTue: utils.nullToStr(locData.OpeningHourTue),
        closingHourTue: utils.nullToStr(locData.ClosingHourTue),

        isOpeningWed: utils.nullToStr(locData.IsOpeningWed),
        openingHourWed: utils.nullToStr(locData.OpeningHourWed),
        closingHourWed: utils.nullToStr(locData.ClosingHourWed),

        isOpeningThu: utils.nullToStr(locData.IsOpeningThu),
        openingHourThu: utils.nullToStr(locData.OpeningHourThu),
        closingHourThu: utils.nullToStr(locData.ClosingHourThu),

        isOpeningFri: utils.nullToStr(locData.IsOpeningFri),
        openingHourFri: utils.nullToStr(locData.OpeningHourFri),
        closingHourFri: utils.nullToStr(locData.ClosingHourFri),

        isOpeningSat: utils.nullToStr(locData.IsOpeningSat),
        openingHourSat: utils.nullToStr(locData.OpeningHourSat),
        closingHourSat: utils.nullToStr(locData.ClosingHourSat),

        isOpeningSun: utils.nullToStr(locData.IsOpeningSun),
        openingHourSun: utils.nullToStr(locData.OpeningHourSun),
        closingHourSun: utils.nullToStr(locData.ClosingHourSun),

        isOpeningHoliday: utils.nullToStr(locData.IsOpeningHoliday),
        openingHourHoliday: utils.nullToStr(locData.OpeningHourHoliday),
        closingHourholiday: utils.nullToStr(locData.ClosingHourholiday),

        businessRegistration: locData.BusinessRegistration,
        locationVatBranchNo: locData.LocationVatBranchNo,
        locationVatBranchName: locData.LocationVatBranchName,
        typeCodeSB: locData.TypeCodeSB,
        subTypeCodeSB: locData.SubTypeCodeSB,
        businessTypeSB: locData.BusinessTypeSB,
        characteristicSB: locData.CharacteristicSB,
        contactNumber: parseContactNumber(row, this.data)
    }
    this.pageGroup.addressInfo = {
        address: parseAddress(row, this.data),
        vatAddress: parseVatAddress(row, this.data)
    }

    this.pageGroup.contactInfo = {
        contactPerson: parseContactPerson(row, this.data)
    }
    this.pageGroup.summary = {
        locationCode: locData.LocationCode
    }

    this.error = [];
    this.phoneMainFlg = new Map();
    this.ismainFlg = new Map();
    this.phoneismainFlg = new Map();
    this.socialismainFlg = new Map();
}

Location.prototype.verify = function verify() {
    var data = JSON.parse(JSON.stringify(this || {}));

    //locationCode
    if (!utils.checkInteger(this.locationCode) && this.locationCode != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column A : locationCode must be Number');
    }
    else if (!utils.checkLength(this.locationCode, 1, 30) && this.locationCode != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column A : locationCode MaxLength is 30');
    }

    //createBy
    if (this.createdBy == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column B : createBy is required');
    } else if (this.createdBy != 'MIGRATE') {
        this.error.push('Row ' + (this.rowId) + ' Column B : createBy must be MIGRATE');
    }

    //createdDate
    if (this.createdDate == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column C : createDate is required');
    }
    else if (!utils.checkDateTime(this.createdDate)) {
        this.error.push('Row ' + (this.rowId) + ' Column C : createDate date/time format is invalid (yyyy-MM-dd hh:mm:ss)');
    }

    // migrateDate

    //modifiedBy
    if (this.modifiedBy == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column E : modifiedBy is required');
    } else if (this.modifiedBy != 'MIGRATE') {
        this.error.push('Row ' + (this.rowId) + ' Column E : modifiedBy must be MIGRATE');
    }

    //modfiedDate

    //distChnCode (Data in DB)
    if (this.pageGroup.selectChannel.distChnCode == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column G : distChnCode is required');
    } else if (!utils.checkDataInDB('userGroup', 'distChnCode_key1', this.pageGroup.selectChannel.distChnCode)) {
        this.error.push('Row ' + (this.rowId) + ' Column G : distChnCode must value in Database');
    }

    // distChnName (Data in DB)
    if (this.pageGroup.selectChannel.distChnName == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column H : distChnName is required');
    }
    else if (!utils.checkDataFindInDB(this.pageGroup.selectChannel.distChnName, utils.findDataDB('userGroup', 'distChnCode_key1', 'distChnName_data', this.distChnCode))) {
        this.error.push('Row ' + (this.rowId) + ' Column H : distChnName must value in Database');
    }

    // chnSalesCode (Data in DB)
    if (this.pageGroup.selectChannel.chnSalesCode == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column I : chnSalesCode is required');
    }
    else if (!utils.checkDataFindInDB(this.pageGroup.selectChannel.chnSalesCode, utils.findDataDB('userGroup', 'distChnCode_key1', 'chnSalesCode_key2', this.pageGroup.selectChannel.distChnCode))) {
        this.error.push('Row ' + (this.rowId) + ' Column I : chnSalesCode must value in Database');
    }

    // chnSalesName
    if (this.pageGroup.selectChannel.chnSalesName == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column J : chnSalesName is required');
    }
    else if (!utils.checkDataFindInDB(this.pageGroup.selectChannel.chnSalesName, utils.findDataDB('userGroup', 'distChnCode_key1', 'chnSaleName_data', this.pageGroup.selectChannel.distChnCode))) {
        this.error.push('Row ' + (this.rowId) + ' Column J : chnSalesName must value in Database');
    }

    //companyAbbr (Data in DB)
    if (this.pageGroup.selectChannel.companyAbbr == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column K : companyAbbr is required');
    } else if (!this.checkDataFindInDB(this.pageGroup.selectChannel.companyAbbr, utils.findDataDB2Value('mappingCompany', 'distChnCode_key0', 'chnSalesCode_key1', 'companyAbbr_key2', this.pageGroup.selectChannel.distChnCode, this.pageGroup.selectChannel.chnSalesCode))) {
        this.error.push('Row ' + (this.rowId) + ' Column K : companyAbbr must value in Database');
    }

    // companyId
    if (this.pageGroup.selectChannel.companyId == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column L : companyId is required');
    }

    // companyIdNo
    if (this.pageGroup.selectChannel.companyIdNo == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column M : companyIdNo is required');
    }

    // companyTitleTh
    if (this.pageGroup.selectChannel.companyTitleTh == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column N : companyTitleTh is required');
    }

    // companyNameTh
    if (this.pageGroup.selectChannel.companyNameTh == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column O : companyNameTh is required');
    }

    //sbPartnerId
    if (this.pageGroup.profileInfo.sbPartnerId == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column P : sbPartnerId is required');
    }

    // locationIdType(Data in DB)
    if (!this.checkDataFindInDB(this.pageGroup.profileInfo.locationIdType, utils.findDataDB('lov', 'lovType_data', 'lovCode_key0', 'ID_TYPE')) && this.pageGroup.profileInfo.locationIdType != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column Q : locationIdType must value in Database');
    }

    // locationIdNo
    if (this.pageGroup.profileInfo.locationIdNo == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column R : locationIdNo is required');
    } else if (!utils.checkInteger(this.pageGroup.profileInfo.locationIdNo)) {
        this.error.push('Row ' + (this.rowId) + ' Column R : locationIdNo string format is invalid 0-9');
    } else if (!utils.checkLength(this.pageGroup.profileInfo.locationIdNo, 13, 13)) {
        this.error.push('Row ' + (this.rowId) + ' Column R : locationIdNo must contain only leng is 13');
    }

    // locationIdForSB
    if (this.pageGroup.profileInfo.locationIdForSB == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column S : locationIdForSB is required');
    }

    // titleTh

    // nameEn
    if (utils.findDataDB2Value('authField', 'chnSalesCode_key1', 'attribute_data', 'value_data', this.pageGroup.profileInfo.chnSalesCode, 'nameEn') == 'Y') {
        if (this.pageGroup.profileInfo.nameEn == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column U : nameEn is required');
        } else if (!this.checkName('en', this.nameEn)) {
            this.error.push('Row ' + (this.rowId) + ' Column U : nameEn string format is invalid a-z A-Z 0-9  and space (),@ , . _ - / * & : +');
        }
    } else {
        if (!utils.checkName('en', this.pageGroup.profileInfo.nameEn) && this.pageGroup.profileInfo.nameEn != undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column U : nameEn string format is invalid a-z A-Z 0-9  and space (),@ , . _ - / * & : +');
        }
    }

    // nameTh
    if (this.pageGroup.profileInfo.nameTh == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column V : nameTh is required');
    } else if (!utils.checkName('th', this.pageGroup.profileInfo.nameTh)) {
        this.error.push('Row ' + (this.rowId) + ' Column V : nameTh string format is invalid thailanguage , a-z A-Z 0-9  and space (),@ -, . -_ / + * & : +');
    }

    //abbrev
    if (this.pageGroup.profileInfo.abbrev == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column W : abbrev is required');
    } else if (!utils.checkUppercase(this.pageGroup.profileInfo.abbrev)) {
        this.error.push('Row ' + (this.rowId) + ' Column W : abbrev must contain only uppercase characters');
    } else if (!utils.checkLength(this.pageGroup.profileInfo.abbrev, 2, 5)) {
        this.error.push('Row ' + (this.rowId) + ' Column W : abbrev must contain 2-5 uppercase characters');
    }

    //status (data in DB)
    if (this.pageGroup.profileInfo.status == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column X : status is required');
    }
    else if (!utils.checkDataFindInDB(this.pageGroup.profileInfo.status, utils.findDataDB('lov', 'lovType_data', 'lovCode_key0', 'STATUS_TYPE'))) {
        this.error.push('Row ' + (this.rowId) + ' Column X : status must be ' + utils.findDataDB('lov', 'lovType_data', 'lovCode_key0', 'STATUS_TYPE'));
    }

    //effectiveDt
    if (this.pageGroup.profileInfo.effectiveDt == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column Y : effectiveDt is required');
    } else if (!utils.checkDateTime(this.pageGroup.profileInfo.effectiveDt)) {
        this.error.push('Row ' + (this.rowId) + ' Column Y : effectiveDt date/time format is invalid (yyyy-MM-dd hh:mm:ss)');
    }

    // terminateDt
    if (!utils.checkDateTime(this.pageGroup.profileInfo.terminateDt) && this.pageGroup.profileInfo.terminateDt != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column Z : terminateDt date/time format is invalid (yyyy-MM-dd hh:mm:ss)');
    }

    // remark

    // retailShop (data in DB)
    if (!utils.checkDataFindInDB(this.pageGroup.profileInfo.retailShop, this.findDataDB('lov', 'lovType_data', 'lovName_data', 'RETAIL_SHOP')) && this.pageGroup.profileInfo.retailShop != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AB : retailShop must data in Database');
    }

    //shopSegment(data in DB)
    if (!utils.checkDataFindInDB(this.pageGroup.profileInfo.shopSegment, this.findDataDB('lov', 'lovType_data', 'lovName_data', 'SHOP_SEGMENT')) && this.pageGroup.profileInfo.shopSegment != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AC : shopSegment must be must data in Database');
    }

    // shopArea(data in DB)
    if (!utils.checkDataFindInDB(this.pageGroup.profileInfo.shopArea, this.findDataDB('lov', 'lovType_data', 'lovName_data', 'SHOP_AREA')) && this.pageGroup.profileInfo.shopArea != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AD : shopArea must be must data in Database');
    }

    // shopType(data in DB)
    if (!utils.checkDataFindInDB(this.pageGroup.profileInfo.shopType, this.findDataDB('lov', 'lovType_data', 'lovName_data', 'SHOP_TYPE')) && this.pageGroup.profileInfo.shopType != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AE : shopType must be must data in Database');
    }

    // shopSize
    if (!utils.checkDouble(this.pageGroup.profileInfo.shopSize) && this.pageGroup.profileInfo.shopSize != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AF : shopSize must be Number');
    } else if (!utils.checkDecimal(this.pageGroup.profileInfo.shopSize) && this.pageGroup.profileInfo.shopSize != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AF : shopSize must be Number 2 decimal places');
    }

    //MonDay        
    //isOpeningMon
    if ((this.pageGroup.profileInfo.isOpeningMon != 'Y' && this.pageGroup.profileInfo.isOpeningMon != 'N') && this.pageGroup.profileInfo.isOpeningMon != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AG : isOpeningMon must be Y or N');
    }

    // openingHourMon
    if (!utils.checkTime(this.pageGroup.profileInfo.openingHourMon) && this.pageGroup.profileInfo.openingHourMon != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AH : openingHourMon time format is invalid (hh:mm:ss)');
    }
    // closingHourMon
    if (!utils.checkTime(this.pageGroup.profileInfo.closingHourMon) && this.pageGroup.profileInfo.closingHourMon != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AI : closingHourMon time format is invalid (hh:mm:ss)');
    }

    //Tueday
    //isOpeningTue
    if ((this.pageGroup.profileInfo.isOpeningTue != 'Y' && this.pageGroup.profileInfo.isOpeningTue != 'N') && this.pageGroup.profileInfo.isOpeningTue != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AJ : isOpeningTue must be Y or N');
    }
    // openingHourTue
    if (!utils.checkTime(this.pageGroup.profileInfo.openingHourTue) && this.pageGroup.profileInfo.openingHourTue != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AK : openingHourTue time format is invalid (hh:mm:ss)');
    }
    // closingHourTue
    if (!utils.checkTime(this.pageGroup.profileInfo.closingHourTue) && this.pageGroup.profileInfo.closingHourTue != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AL : closingHourTue time format is invalid (hh:mm:ss)');
    }

    // WedDay
    // isOpeningWed
    if ((this.pageGroup.profileInfo.isOpeningWed != 'Y' && this.pageGroup.profileInfo.isOpeningWed != 'N') && this.pageGroup.profileInfo.isOpeningWed != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AM : isOpeningWed must be Y or N');
    }
    // openingHourWed
    if (!utils.checkTime(this.pageGroup.profileInfo.openingHourWed) && this.pageGroup.profileInfo.openingHourWed != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AN : openingHourWed time format is invalid (hh:mm:ss)');
    }
    // closingHourWed
    if (!utils.checkTime(this.pageGroup.profileInfo.closingHourWed) && this.pageGroup.profileInfo.closingHourWed != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AO : closingHourWed time format is invalid (hh:mm:ss)');
    }

    // ThuDay
    // isOpeningThu
    if ((this.pageGroup.profileInfo.isOpeningThu != 'Y' && this.pageGroup.profileInfo.isOpeningThu != 'N') && this.pageGroup.profileInfo.isOpeningThu != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AP : isOpeningThu must be Y or N');
    }
    // openingHourWed
    if (!utils.checkTime(this.pageGroup.profileInfo.openingHourWed) && this.pageGroup.profileInfo.openingHourWed != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AQ : openingHourThu time format is invalid (hh:mm:ss)');
    }
    // closingHourWed
    if (!utils.checkTime(this.pageGroup.profileInfo.closingHourWed) && this.pageGroup.profileInfo.closingHourWed != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AR : closingHourThu time format is invalid (hh:mm:ss)');
    }

    // FriDay
    // isOpeningFri
    if ((this.pageGroup.profileInfo.isOpeningFri != 'Y' && this.pageGroup.profileInfo.isOpeningFri != 'N') && this.pageGroup.profileInfo.isOpeningFri != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AS : isOpeningFri must be Y or N');
    }
    // openingHourFri
    if (!utils.checkTime(this.pageGroup.profileInfo.openingHourFri) && this.pageGroup.profileInfo.openingHourFri != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AT : openingHourFri time format is invalid (hh:mm:ss)');
    }
    // closingHourFri
    if (!utils.checkTime(this.pageGroup.profileInfo.closingHourFri) && this.pageGroup.profileInfo.closingHourFri != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AU : closingHourFri time format is invalid (hh:mm:ss)');
    }

    // SatDay
    // isOpeningSat
    if ((this.pageGroup.profileInfo.isOpeningSat != 'Y' && this.pageGroup.profileInfo.isOpeningSat != 'N') && this.pageGroup.profileInfo.isOpeningSat != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AV : isOpeningSat must be Y or N');
    }
    // openingHourSat
    if (!utils.checkTime(this.pageGroup.profileInfo.openingHourSat) && this.pageGroup.profileInfo.openingHourSat != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AW : openingHourSat time format is invalid (hh:mm:ss)');
    }
    // closingHourSat
    if (!utils.checkTime(this.pageGroup.profileInfo.closingHourSat) && this.pageGroup.profileInfo.closingHourSat != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AX : closingHourSat time format is invalid (hh:mm:ss)');
    }

    // SunDay
    // isOpeningSun
    if ((this.pageGroup.profileInfo.isOpeningSun != 'Y' && this.pageGroup.profileInfo.isOpeningSun != 'N') && this.pageGroup.profileInfo.isOpeningSun != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AY : isOpeningSun must be Y or N');
    }
    // openingHourSun
    if (!utils.checkTime(this.pageGroup.profileInfo.openingHourSun) && this.pageGroup.profileInfo.openingHourSun != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column AZ : openingHourSun time format is invalid (hh:mm:ss)');
    }
    // closingHourSun
    if (!utils.checkTime(this.pageGroup.profileInfo.closingHourSun) && this.pageGroup.profileInfo.closingHourSun != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column BA : closingHourSun time format is invalid (hh:mm:ss)');
    }

    // HolidayDay
    // isOpeningHoliday
    if ((this.pageGroup.profileInfo.isOpeningHoliday != 'Y' && this.pageGroup.profileInfo.isOpeningHoliday != 'N') && this.pageGroup.profileInfo.isOpeningHoliday != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column BB : isOpeningHoliday must be Y or N');
    }
    // openingHourHoliday
    if (!utils.checkTime(this.pageGroup.profileInfo.openingHourHoliday) && this.pageGroup.profileInfo.openingHourHoliday != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column BC : openingHourHoliday time format is invalid (hh:mm:ss)');
    }
    // closingHourHoliday
    if (!utils.checkTime(this.pageGroup.profileInfo.closingHourHoliday) && this.pageGroup.profileInfo.closingHourHoliday != undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column BD : closingHourHoliday time format is invalid (hh:mm:ss)');
    }

    // businessRegistration
    if (this.pageGroup.profileInfo.businessRegistration == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column BE : businessRegistration is required');
    }

    // locationVatBranchNo (novalidate)
    // locationVatBranchName (novalidate)
    // typeCodeSB (novalidate)
    // subTypeCodeSB (novalidate)
    // businessTypeSB (novalidate)
    // characteristicSB (novalidate)

    // titleTh (novalidate)

    // sendSiebel
    if (this.sendSiebel == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column DE : sendSiebel is required');
    } else if (this.sendSiebel != 'Y' && this.sendSiebel != 'N') {
        this.error.push('Row ' + (this.rowId) + ' Column DE : sendSiebel must be Y or N');
    }

    //contactSiebel
    if (this.contactSiebel == undefined) {
        this.error.push('Row ' + (this.rowId) + ' Column DF : contactSiebel is required');
    } else if (this.contactSiebel != 'Y' && this.contactSiebel != 'N') {
        this.error.push('Row ' + (this.rowId) + ' Column DF : contactSiebel must be Y or N');
    }

    // #######################################################################

    var reusltYes = 0;
    var reusltNo = 0;
    this.pageGroup.profileInfo.contactNumber.forEach(function (item) {
        // contactNumber.phoneType
        if (item.phoneType == undefined) {
            this.error.push('Row ' + (item.rowId) + ' Column BL : contactNumber.phoneType is required');
        }
        else if (!utils.checkDataFindInDB(item.phoneType, utils.findDataDB('lov', 'lovType_data', 'lovName_data', 'CHN_PHONE_TYPE'))) {
            this.error.push('Row ' + (item.rowId) + ' Column BL : contactNumber.phoneType must be must data in Database');
        }

        // contactNumber.phoneNumber
        if (item.phoneNumber == undefined) {
            this.error.push('Row ' + (item.rowId) + ' Column BM : contactNumber.phoneNumber is required');
        } else if (!utils.checkInteger(item.phoneNumber)) {
            this.error.push('Row ' + (item.rowId) + ' Column BM : contactNumber.phoneNumber must be Number');
        } else if (item.phoneNumber.toString()[0] != '0') {
            this.error.push('Row ' + (item.rowId) + ' Column BM : contactNumber.phoneNumber first character is 0');
        }

        // contactNumber.phoneExt (novalidate)

        // contactNumber.phoneMainFlg
        if (item.phoneMainFlg == undefined) {
            this.error.push('Row ' + (item.rowId) + ' Column BO : contactNumber.phoneMainFlg is required');
        } else if (item.phoneMainFlg != 'Y' && item.phoneMainFlg != 'N') {
            this.error.push('Row ' + (item.rowId) + ' Column BO : contactNumber.phoneMainFlg must be Y or N');
        } else {
            this.phoneMainFlg.set(item.rowId, item.phoneMainFlg);
            if (item.phoneMainFlg == 'Y') {
                reusltYes++;
            }
            else {
                reusltNo++;
            }
        }
    });

    // #######################################################################
    // verify contactNumber.phoneMainFlg
    for (var [key, value] of this.phoneMainFlg) {
        //  console.log(key + ' = ' + value);
        if (value == 'Y') {
            if (reusltYes > 1) {
                this.error.push('Row ' + (key) + ' Column BO : contactNumber.phoneMainFlg more Y');
            }
        }
        else {
            if (reusltNo == this.phoneMainFlg.size) {
                for (var key of this.phoneMainFlg.keys()) {
                    this.error.push('Row ' + (key) + ' Column BO : contactNumber.phoneMainFlg not have Y');
                }
            }
        }
    }
    this.phoneMainFlg.clear();
    // #######################################################################

    var reuslt_TAX_ADDR = 0;
    var result_LOCATION_ADDR = 0;
    this.pageGroup.addressInfo.address.forEach(function (item) {
        // address.AddressId (novalidate)

        // address.AddressType (Data in DB)
        if (item.addressType == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column BQ : address.AddressType is required');
        }
        else if (!utils.checkDataInDB('addressType', 'code', item.addressType)) {
            this.error.push('Row ' + (this.rowId) + ' Column BQ : address.AddressType must be must data in Database');
        }
        else {
            this.addressTypeFlg.set(this.rowId, item.addressType);
            if (item.addressType == 'TAX_ADDR') {
                reuslt_TAX_ADDR++;
            }
            else if (value == 'LOCATION_ADDR') {
                if (!utils.findDataDB3Value('authField', 'chnSalesCode_key1', 'action_data', 'attribute_data', 'value_data', this.pageGroup.selectChannel.chnSalesCode, 'REQUIRED', 'address.AddressType') != value) {
                    result_LOCATION_ADDR++;
                }
            }
        }

        // address.houseNo
        if (item.houseNo == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column BR : address.houseNo is required');
        }

        // address.moo (novalidate)
        // address.mooban (novalidate)
        // address.building (novalidate)
        // address.floor (novalidate)
        // address.room (novalidate)
        // address.soi (novalidate)
        // address.street (novalidate)

        // address.zipCode (Data in DB)
        if (item.zipCode == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column BZ : address.zipCode is required');
        }
        else if (!utils.checkDataInDB('zipCode', 'zipCode_key2', item.zipCode)) {
            this.error.push('Row ' + (this.rowId) + ' Column BZ : address.zipCode must value in Database');
        }

        // address.tumbolTh (Data in DB)
        if (item.tumbolTh == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CA : address.tumbolTh is required');
        }
        else if (!utils.checkDataFindInDB(item.tumbolTh, utils.findDataDB('zipCode', 'zipCode_key2', 'tumbolTh_key4', item.zipCode))) {
            this.error.push('Row ' + (this.rowId) + ' Column CA : address.tumbolTh must value in Database');
        }

        // address.amphurTh (Data in DB)
        if (item.amphurTh == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CB : address.amphurTh is required');
        }
        else if (!utils.checkDataFindInDB(item.amphurTh, utils.findDataDB('zipCode', 'zipCode_key2', 'amphurTh_key3', item.zipCode))) {
            this.error.push('Row ' + (this.rowId) + ' Column CB : address.amphurTh must value in Database');
        }

        // address.provinceCode (Data in DB)
        if (item.provinceCode == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CC : address.provinceCode is required');
        }
        else if (!utils.checkDataInDB('province', 'provinceCode_key0', item.provinceCode)) {
            this.error.push('Row ' + (this.rowId) + ' Column CC : address.provinceCode must be must data in Database');
        }

        // address.countryCode (Data in DB)
        if (item.countryCode == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CD : address.countryCode is required');
        }
        else if (!utils.checkDataFindInDB(item.countryCode, utils.findDataDB('lov', 'lovType_data', 'lovCode_key0', 'COUNTRY'))) {
            this.error.push('Row ' + (this.rowId) + ' Column CD : address.countryCode must be must data in Database');
        }

        // address.subRegionCode (Data in DB)
        if (item.subRegionCode == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CE : address.subRegionCode is required');
        }
        else if (!utils.checkDataFindInDB(item.subRegionCode, utils.findDataDB('mappingRegion', 'provinceCode_key0', 'saleSubRegionCode_data', item.provinceCode))) {
            this.error.push('Row ' + (this.rowId) + ' Column CE : address.subRegionCode must be must data in Database');
        }

        // address.remark (novalidate)

        // address.zipCodeId
        if (item.zipCodeId == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CG : address.zipCodeId is required');
        }
    });
    // #######################################################################
    // verify address.AddressType
    for (var [key, value] of this.addressTypeFlg) {
        if (value == 'TAX_ADDR') {
            if (reuslt_TAX_ADDR > 1) {
                this.error.push('Row ' + (key) + ' Column BQ : address.AddressType more TAX_ADDR');
            }
        }
        else if (value == 'LOCATION_ADDR') {
            if (utils.findDataDB3Value('authField', 'chnSalesCode_key1', 'action_data', 'attribute_data', 'value_data', this.pageGroup.selectChannel.chnSalesCode, 'REQUIRED', 'address.AddressType') != value) {
                this.error.push('Row ' + (key) + ' Column BQ : address.AddressType must be must data in Database not relate chnSalesCode');
            }
            else{
                if (result_LOCATION_ADDR > 1) {
                    this.error.push('Row ' + (key) + ' Column BQ : address.AddressType more LOCATION_ADDR');
                }
            }
        }
    }
    this.addressTypeFlg.clear();
    // #######################################################################

    this.pageGroup.addressInfo.vatAddress.forEach(function (item) {
        // vatAddress.companyAbbr
        if (item.companyAbbr != undefined) {
            if (!utils.checkDataFindInDB(item.companyAbbr, this.findDataDB('company', 'internalCompanyFlag_data', 'companyAbbr_data', 'I'))) {
                this.error.push('Row ' + (this.rowId) + ' Column CI : vatAddress.companyAbbr must be must data in Database');
            }
        }

        // vatAddress.vatBranchNo (Data in DB)
        if (item.vatBranchNo != undefined) {
            if (!utils.checkInteger(item.vatBranchNo)) {
                this.error.push('Row ' + (this.rowId) + ' Column CJ : vatAddress.vatBranchNo must be Number');
            } else if (!utils.checkLength(item.vatBranchNo, 5, 5)) {
                this.error.push('Row ' + (this.rowId) + ' Column CJ : vatAddress.vatBranchNo must contain 5 Digits');
            }
        }

        // vatAddress.ownerLocation
        if (item.ownerLocation != undefined) {
            if (!utils.checkInteger(item.ownerLocation)) {
                this.error.push('Row ' + (this.rowId) + ' Column CL : vatAddress.ownerLocation must be Number');
            } else if (!utils.checkLength(item.ownerLocation, 5, 5)) {
                this.error.push('Row ' + (this.rowId) + ' Column CL : vatAddress.ownerLocation must contain 5 Digits');
            }
        }
    });

    // #######################################################################
    var reusltYesisMain = 0;
    var reusltNoisMain = 0;
    var reusltYesphoneisMain = 0;
    var reusltNophoneisMain = 0;
    var reusltYessocialisMain = 0;
    var reusltNosociaisMain = 0;

    this.pageGroup.addressInfo.vatAddress.forEach(function (item) {

        // contactPerson.pincode
        if (item.pincode == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CM : contactPerson.pincode is required');
        } else if (!utils.checkInteger(item.pincode)) {
            this.error.push('Row ' + (this.rowId) + ' Column CM : contactPerson.pincode must be Number');
        }

        // contactPerson.titleTh
        if (item.titleTh == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CN : contactPerson.titleTh is required');
        }

        // contactPerson.fnameTh
        if (item.fnameTh == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CO : contactPerson.fnameTh is required');
        }

        // contactPerson.lnameTh
        if (item.lnameTh == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CP : contactPerson.lnameTh is required');
        }

        // contactPerson.titleEn
        if (item.titleEn == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CQ : contactPerson.titleEn is required');
        }

        // contactPerson.fnameEn
        if (item.fnameEn == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CR : contactPerson.fnameEn is required');
        }

        // contactPerson.lnameEn
        if (item.lnameEn == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CS : contactPerson.lnameEn is required');
        }

        // contactPerson.isMain (Y =  1 value , N multi value)
        if (item.isMain == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CT : contactPerson.isMain is required');
        } else if (item.isMain != 'Y' && item.isMain != 'N') {
            this.error.push('Row ' + (this.rowId) + ' Column CT : contactPerson.isMain must be Y or N');
        } else {
            this.ismainFlg.set(this.rowId, item.isMain);
            if (item.isMain == 'Y') {
                reusltYesisMain++;
            }
            else {
                reusltNoisMain++;
            }
        }

        // contactPerson.IdNumber
        if (this.contactPerson.IdNumber == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CU : contactPerson.IdNumber is required');
        }

        // contactPerson.IdType
        if (item.IdType == undefined) {
            this.error.push('Row ' + (this.rowId) + ' Column CV : contactPerson.IdType is required');
        }

        // contactPerson.role

        item.phone.forEach(function (itemPhone) {

            // contactPerson.phone.type
            if (itemPhone.type == undefined) {
                this.error.push('Row ' + (this.rowId) + ' Column CX : contactPerson.phone.type is required');
            }
            else if (!utils.checkDataFindInDB(itemPhone.type, utils.findDataDB('lov', 'lovType_data', 'lovCode_key0', 'PERSON_PHONE_TYPE'))) {
                this.error.push('Row ' + (this.rowId) + ' Column CX : contactPerson.phone.type must be must data in Database');
            }

            // contactPerson.phone.number
            if (itemPhone.number == undefined) {
                this.error.push('Row ' + (this.rowId) + ' Column CY : contactPerson.phone.number is required');
            }
            else if (!utils.checkInteger(itemPhone.number)) {
                this.error.push('Row ' + (this.rowId) + ' Column CY : contactPerson.phone.number must be Number');
            }
            else if (itemPhone.number.toString()[0] != '0') {
                this.error.push('Row ' + (this.rowId) + ' Column CY : contactPerson.phone.number first character is 0');
            }

            // contactPerson.phone.ext

            // contactPerson.phone.isMain
            if (itemPhone.isMain == undefined) {
                this.error.push('Row ' + (this.rowId) + ' Column DA : contactPerson.phone.isMain is required');
            } else if (itemPhone.isMain != 'Y' && itemPhone.isMain != 'N') {
                this.error.push('Row ' + (this.rowId) + ' Column DA : contactPerson.phone.isMain must be Y or N');
            } else {
                this.phoneismainFlg.set(this.rowId, itemPhone.isMain);
                if (itemPhone.isMain == 'Y') {
                    reusltYesphoneisMain++;
                }
                else {
                    reusltNophoneisMain++;
                }
            }
        });

        item.social.forEach(function (itemSocial) {

            // contactPerson.social.type ( Data in DB )
            if (itemSocial.type == undefined) {
                this.error.push('Row ' + (this.rowId) + ' Column DB : contactPerson.social.type is required');
            }
            else if (!utils.checkDataFindInDB(itemSocial.type, utils.findDataDB('lov', 'lovType_data', 'lovCode_key0', 'SOCIAL_TYPE'))) {
                this.error.push('Row ' + (this.rowId) + ' Column DB : contactPerson.social.type must be must data in Database');
            }

            // contactPerson.social.social
            if (itemSocial.social == undefined) {
                this.error.push('Row ' + (this.rowId) + ' Column DC : contactPerson.social.social is required');
            }

            // contactPerson.social.isMain
            if (itemSocial.isMain == undefined) {
                this.error.push('Row ' + (this.rowId) + ' Column DD : contactPerson.social.isMain is required');
            } else if (itemSocial.isMain != 'Y' && itemSocial.isMain != 'N') {
                this.error.push('Row ' + (this.rowId) + ' Column DD : contactPerson.social.isMain must be Y or N');
            }
            else {
                this.socialismainFlg.set(this.rowId, itemSocial.isMain);
                if (itemSocial.isMain == 'Y') {
                    reusltYessocialisMain++;
                }
                else {
                    reusltNosocialisMain++;
                }
            }
        });
    });

    // verify contactPerson.isMain
    for (var [key, value] of this.ismainFlg) {
        if (value == 'Y') {
            if (reusltYesisMain > 1) {
                this.error.push('Row ' + (key) + ' Column CT : contactPerson.isMain more Y');
            }
        }
        else {
            if (reusltNoisMain == this.ismainFlg.size) {
                for (var key of this.ismainFlg.keys()) {
                    this.error.push('Row ' + (key) + ' Column CT : contactPerson.isMain not have Y');
                }
            }
        }
    }
    this.ismainFlg.clear();

    // verify contactPerson.phone.isMain
    for (var [key, value] of this.phoneismainFlg) {
        if (value == 'Y') {
            if (reusltYesphoneisMain > 1) {
                this.error.push('Row ' + (key) + ' Column DA : contactPerson.phone.isMain more Y');
            }
        }
        else {
            if (reusltNophoneisMain == this.phoneismainFlg.size) {
                for (var key of this.phoneismainFlg.keys()) {
                    this.error.push('Row ' + (key) + ' Column DA : contactPerson.phone.isMain not have Y');
                }
            }
        }
    }
    this.phoneismainFlg.clear();

    // verify contactPerson.social.isMain
    for (var [key, value] of this.socialismainFlg) {
        if (value == 'Y') {
            if (reusltYessocialisMain > 1) {
                this.error.push('Row ' + (key) + ' Column DD : contactPerson.social.isMain more Y');
            }
        }
        else {
            if (reusltNosociaisMain == this.socialismainFlg.size) {
                for (var key of this.socialismainFlg.keys()) {
                    this.error.push('Row ' + (key) + ' Column DD : contactPerson.social.isMain not have Y');
                }
            }
        }
    }
    this.socialismainFlg.clear();

    return data;
};



Location.prototype.toSdfData = function toSdfData() {
    var locData = JSON.parse(JSON.stringify(this || {}));
    if (locData.data) {
        delete locData.data;
    }
    if (locData.pageGroup.profileInfo.contactNumber && Array.isArray(locData.pageGroup.profileInfo.contactNumber)) {
        locData.pageGroup.profileInfo.contactNumber.forEach(function (element) {
            if (element.rowId) {
                delete element.rowId;
            }
        });
    }
    if (locData.pageGroup.addressInfo.address && Array.isArray(locData.pageGroup.addressInfo.address)) {
        locData.pageGroup.addressInfo.address.forEach(function (element) {
            if (element.rowId) {
                delete element.rowId;
            }
        });
    }
    if (locData.pageGroup.addressInfo.vatAddress && Array.isArray(locData.pageGroup.addressInfo.vatAddress)) {
        locData.pageGroup.addressInfo.vatAddress.forEach(function (element) {
            if (element.rowId) {
                delete element.rowId;
            }
        });
    }
    if (locData.pageGroup.contactInfo.contactPerson && Array.isArray(locData.pageGroup.contactInfo.contactPerson)) {
        locData.pageGroup.contactInfo.contactPerson.forEach(function (element) {
            if (element.rowId) {
                delete element.rowId;
            }
            // element.contactSiebel =  locData.contactSiebel;
        });
    }

    return locData;
};

module.exports = Location;