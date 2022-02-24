var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var requestFlowDraftSchema = new Schema({
  url: {
    type: String,
    default: '/requestFlow/AE'
  },
  //   historyNavigator: {
  //     type: String,
  //     default: undefined
  //   },
  // expire: {
  //   type: Date
  // },
  createdBy: {
    type: String
  },
  userGroup: {
    type: Array
  },
  remark: [{
    userName: {
      type: String
    },
    remark: {
      type: String
    },
  }],
  createdDate: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String
  },
  modifiedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['PENDING', 'REQUEST', 'APPROVE', 'REJECT', 'APPROVE-FINAL', 'CANCEL', 'DRAFT'],
    default: 'DRAFT'
  },
  approved: [{
    type: String
  }],
  requestFlow: {
    companyInformation: {
      chnSalesCode: {
        type: String
      },
      chnSalesName: {
        type: String
      },
      chnType: {
        type: String
      },
      companyAbbr: {
        type: String
      },
      companyId: {
        type: String
      },
      companyIdNo: {
        type: String
      },
      companyIdType: {
        type: String
      },
      companyNameEn: {
        type: String
      },
      companyNameTh: {
        type: String
      },
      companyTitleCode: {
        type: String
      },
      companyTitleEn: {
        type: String
      },
      companyTitleTh: {
        type: String
      },
      distChnCode: {
        type: String
      },
      distChnName: {
        type: String
      },
      distChnSaleId: {
        type: String
      },
      vatType: {
        type: String
      },
      wtName: {
        type: String
      }
    },
    locationInformation: {
      locationTitleEn: {
        type: String
      },
      locationTitleTh: {
        type: String
      },
      locationNameTh: {
        type: String
      },
      locationNameEn: {
        type: String
      },
      locationContactNumber: [{
        phoneType: {
          type: String
        },
        phoneNumber: {
          type: String
        },
        phoneExt: {
          type: String
        },
        phoneMainFlg: {
          type: String
        },
      }],
      isOpeningMon: {
        type: String
      },
      openingHourMon: {
        type: String
      },
      closingHourMon: {
        type: String
      },
      isOpeningTue: {
        type: String
      },
      openingHourTue: {
        type: String
      },
      closingHourTue: {
        type: String
      },
      isOpeningWed: {
        type: String
      },
      openingHourWed: {
        type: String
      },
      closingHourWed: {
        type: String
      },
      isOpeningThu: {
        type: String
      },
      openingHourThu: {
        type: String
      },
      closingHourThu: {
        type: String
      },
      isOpeningFri: {
        type: String
      },
      openingHourFri: {
        type: String
      },
      closingHourFri: {
        type: String
      },
      isOpeningSat: {
        type: String
      },
      openingHourSat: {
        type: String
      },
      closingHourSat: {
        type: String
      },
      isOpeningSun: {
        type: String
      },
      openingHourSun: {
        type: String
      },
      closingHourSun: {
        type: String
      },
      isOpeningHoliday: {
        type: String
      },
      openingHourHoliday: {
        type: String
      },
      closingHourHoliday: {
        type: String
      }
    },
    addressInformation: [{
      addressType: {
        type: String
      },
      addressHouseNo: {
        type: String
      },
      addressTypeName: {
        type: String
      },
      addressMoo: {
        type: String
      },
      addressMooban: {
        type: String
      },
      addressBuilding: {
        type: String
      },
      addressFloor: {
        type: String
      },
      addressRoom: {
        type: String
      },
      addressSoi: {
        type: String
      },
      addressStreet: {
        type: String
      },
      addressTumbolTh: {
        type: String
      },
      addressTumbolEn: {
        type: String
      },
      addressAmphurTh: {
        type: String
      },
      addressAmphurEn: {
        type: String
      },
      addressProvinceCode: {
        type: String
      },
      addressProvinceNameTh: {
        type: String
      },
      addressProvinceNameEn: {
        type: String
      },
      addressProvinceName: {
        type: String
      },
      addressCountryCode: {
        type: String
      },
      addressCountryTh: {
        type: String
      },
      addressCountryEn: {
        type: String
      },
      addressCountry: {
        type: String
      },
      addressZipCode: {
        type: String
      },
      addressZipCodeId: {
        type: String
      },
      addressRegionCode: {
        type: String
      },
      addressRegionName: {
        type: String
      },
      addressSubRegionCode: {
        type: String
      },
      addressSubRegion: {
        type: String
      },
      addressSubRegionName: {
        type: String
      }
    }],
    financialInformation: {
      bankId: {
        type: String
      },
      bankKey: {
        type: String
      },
      bankName: {
        type: String
      },
      bankNameTh: {
        type: String
      },
      branchNameTh: {
        type: String
      },
      branchCode: {
        type: String
      },
      branchName: {
        type: String
      },
      accountName: {
        type: String
      },
      accountNumber: {
        type: String
      },
      accountTitleCode: {
        type: String
      },
      accountType: {
        type: String
      },
      accountTypeName: {
        type: String
      },
      businessTypeCode: {
        type: String
      },
      businessTypeName: {
        type: String
      }
    },
    retailDistributorInformation: [{
      provinceCode: {
        type: String
      },
      subRegion: {
        type: String
      },
      region: {
        type: String
      },
      distType: {
        type: String
      },
      status: {
        type: String
      },
      provinceName: {
        type: String
      },
      distLocationName: {
        type: String
      },
      distLocationCode: {
        type: String
      },
      productName: {
        type: String
      },
      distLocationId: {
        type: String
      },
      productId: {
        type: String
      }
    }],
    contactInformation: [{
      idType: {
        type: String
      },
      idNumber: {
        type: String
      },
      titleCode: {
        type: String
      },
      fnameTh: {
        type: String
      },
      lnameTh: {
        type: String
      },
      fnameEn: {
        type: String
      },
      lnameEn: {
        type: String
      },
      nickName: {
        type: String
      },
      gender: {
        type: String
      },
      birthDayDt: {
        type: String
      },
      age: {
        type: String
      },
      isMain: {
        type: String
      },
      nationality: {
        type: String
      },
      idCardExpiredDt: {
        type: String
      },
      rowIdSB: {
        type: String
      },
      pinCode: {
        type: String
      },
      personId: {
        type: String
      },
      phone: [{
        // type: String
      }],
      social: [{
        // roleCode: {
        //   type: String
        // },
        // roleName: {
        //   type: String
        // },
        // roleCode: {
        //   type: String
        // },
        // roleName: {
        //   type: String
        // }
      }]
      ,
      role: [{
        role: {
          type: String
        },
        roleName: {
          type: String
        }
      }]
    }],
    userInformation: {
      pinCode: {
        type: String
      },
      userName: {
        type: String
      },
      titleCode: {
        type: String
      },
      firstNameTh: {
        type: String
      },
      phone: [{
        phoneTitle: {
          type: String
        },
        phoneNumber: {
          type: String
        }
      }]
    },
  },
}, {
  strict: false,
  versionKey: false
});

var requestFlowDraft = mongoose.model('requestFlowDraft', requestFlowDraftSchema, 'requestFlowDraft');

module.exports = requestFlowDraft;