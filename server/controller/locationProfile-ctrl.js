/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
var company = mongoose.model('company');
var locationDraft = mongoose.model('locationDraft');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
exports.checkNameEN = function (req, res) {
  var name = req.query.locationNameEN;
  var query = {
    nameEn: name
  };
  company.find(query, function (err, docs) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(docs);
    }
  });
};

exports.checkNameTH = function (req, res) {
  var name = req.query.locationNameTH;
  var query = {
    nameTh: name
  };
  company.find(query, function (err, docs) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(docs);
    }
  });
};

exports.getShopSegment = function (req, res) {
  // Fake Data
  var result = [
    {
      _id: "1",
      name: "Silver"
    },
    {
      _id: "2",
      name: "Basic"
    },
    {
      _id: "3",
      name: "Bronze"
    },
    {
      _id: "4",
      name: "Gold"
    },
    {
      _id: "5",
      name: "Test"
    }];
  res.json(result);
  // Implement To Mongo on Here...
};

exports.getShopArea = function (req, res) {
  // Fake Data
  var result = [
    {
      _id: "1",
      name: "Plaza"
    },
    {
      _id: "2",
      name: "Office"
    },
    {
      _id: "3",
      name: "Building"
    }];
  res.json(result);
  // Implement To Mongo on Here...
};

 

exports.getOpenHour = function (req, res) {
  // Fake Data
  var result = {
    _id: "594ce45cbe168c5822b5ff52",
    chnSalesCode: "AS",
    shopType: "RETAIL-SHOP",
    shopArea: "PLAZA",
    isOpeningMon: "Y",
    openingHourMon: "10:30",
    closingHourMon: "20:00",
    isOpeningTue: "Y",
    openingHourTue: "10:30",
    closingHourTue: "20:00",
    isOpeningWed: "Y",
    openingHourWed: "10:30",
    closingHourWed: "20:00",
    isOpeningThu: "Y",
    openingHourThu: "10:30",
    closingHourThu: "20:00",
    isOpeningFri: "Y",
    openingHourFri: "10:30",
    closingHourFri: "20:00",
    isOpeningSat: "Y",
    openingHourSat: "10:00",
    closingHourSat: "20:00",
    isOpeningSun: "Y",
    openingHourSun: "10:00",
    closingHourSun: "20:00",
    isOpeningHoliday: "Y",
    openingHourHoliday: "10:00",
    closingHourHoliday: "20:00"
  };
  res.json(result);
  // Implement To Mongo on Here...
};

exports.saveStepOne = function(req, res) {
  var data = req.body;
  var stepOneToDraft = new locationDraft({
    pagegroup: {
      profileInfo: {
        nameEn: data.nameEn,
        nameTh: data.nameTh,
        abbrev: data.abbrev,
        status: data.status,
        effectiveDt: data.effectiveDt,
        remark: data.remark,
        shopClass: data.chnSalesCode,
        shopSegment: data.chnSalesName,
        shopArea: data.companyNameTh,
        shopType: data.shopType
        // isOpeningMon: data.isOpeningMon,
        // openingHourMon: data.openingHourMon,
        // closingHourMon: data.closingHourMon,
        // isOpeningTue: data.isOpeningTue,
        // openingHourTue: data.openingHourTue,
        // closingHourTue: data.closingHourTue,
        // isOpeningWed: data.isOpeningWed,
        // openingHourWed: data.openingHourWed,
        // closingHourWed: data.closingHourWed,
        // isOpeningThu: data.isOpeningThu,
        // openingHourThu: data.openingHourThu,
        // closingHourThu: data.closingHourThu,
        // isOpeningFri: data.isOpeningFri,
        // openingHourFri: data.openingHourFri,
        // closingHourFri: data.closingHourFri,
        // isOpeningSat: data.isOpeningSat,
        // openingHourSat: data.openingHourSat,
        // closingHourSat: data.closingHourSat,
        // isOpeningSun: data.isOpeningSun,
        // openingHourSun: data.openingHourSun,
        // closingHourSun: data.closingHourSun,
        // isOpeningHoliday: data.isOpeningHoliday,
        // openingHourHoliday: data.openingHourHoliday,
        // closingHourHoliday: data.closingHourHoliday,
      }
    }
  });
  console.log(stepOneToDraft);

  stepOneToDraft.save(function(err, docs) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log(docs);
      res.json(docs);
    }
  });
};


/* ------------- [END IMPLEMENT API] ------------ */
