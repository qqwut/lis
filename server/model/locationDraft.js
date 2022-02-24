var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var locationDraftSchema = new Schema({
  url: {
    type: String,
    default: '/location/new/location-info'
  },
  historyNavigator: {
    type: String,
    default: undefined
  },
  expire: {
    type: Date
  },
  createdBy: {
    type: String
  },
  userGroup: {
    type: Array
  },
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
    enum: ['CREATED', 'EDITED', 'DELETED', 'PROGRESS', 'COMPLETED'],
    default: 'CREATED'
  },
  approved: [{
    type: String
  }],
  step: {
    type: String
  },
  authAddrEn: {
    type: Array
  },
  pageGroup: {
    selectChannel: {
      companyIdNo: {
        type: String
      },
      companyTitleTh: {
        type: String
      },
      companyNameTh: {
        type: String
      },
      companyAbbr: {
        type: String
      },
      distChnCode: {
        type: String
      },
      distChnName: {
        type: String
      },
      chnSalesCode: {
        type: String
      },
      chnSalesName: {
        type: String
      },
      companyId: {
        type: String
      },
      typeCode: {
        type: String
      },
      mapTypeSubTypeId: {
        type: String
      },
      subTypeName: {
        type: String
      },
      subTypeCode: {
        type: String
      },
      companyIdTypeName: {
        type: String
      },
      chnSalesGroupId: {
        type: String
      },
      businessCode: {
        type: String
      },
      businessName: {
        type: String
      }

    },
    profileInfo: {
      default: undefined,
      type: {
        nameEn: {
          type: String
        },
        nameTh: {
          type: String
        },
        abbrev: {
          type: String
        },
        status: {
          type: String
        },
        effectiveDt: {
          type: Date
        },
        remark: {
          type: String
        },
        shopSegmentCode: {
          type: String
        },
        shopSegment: {
          type: String
        },
        shopAreaCode: {
          type: String
        },
        shopArea: {
          type: String
        },
        shopTypeCode: {
          type: String
        },
        shopType: {
          type: String
        },
        businessCode: {
          type: String
        },
        businessName: {
          type: String
        },
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
        },
        storeFrontNameTh: {
          type: String
        },
        storeFrontNameEn: {
          type: String
        },
        contactNumber: [{
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
        }]
      }
    },
    step2Product: {
      default: undefined,
      type: Array
    },
    addressInfo: {
      default: undefined,
      type: {
        address: [{
          partyAddressId: {
            type: String
          },
          partyAddressName: {
            type: String
          },
          houseNo: {
            type: String
          },
          moo: {
            type: String
          },
          mooban: {
            type: String
          },
          building: {
            type: String
          },
          floor: {
            type: String
          },
          room: {
            type: String
          },
          soi: {
            type: String
          },
          street: {
            type: String
          },
          districtCode: {
            type: String
          },
          tumbolTh: {
            type: String
          },
          amphurTh: {
            type: String
          },
          provinceCode: {
            type: String
          },
          provinceName: {
            type: String
          },
          countryCode: {
            type: String
          },
          countryEn: {
            type: String
          },
          zipCode: {
            type: String
          },
          subRegionCode: {
            type: String
          },
          subRegionName: {
            type: String
          },
          retailShop: {
            type: String
          },
          landmarkTh: {
            type: String
          },
          landmarkEn: {
            type: String
          }
        }],
        vatAddress: [{
          companyId: {
            type: String
          },
          companyName: {
            type: String
          },
          vatBranchNo: {
            type: String
          },
          address: {
            type: String
          },
          locationNo: {
            type: String
          },
          effectiveDt: {
            type: Date
          },
          endDt: {
            type: Date
          }
        }]
      }
    },
    contactInfo: {
      default: undefined,
      type: {
        contactList: [{
          pincode: {
            type: String
          },
          titleTh: {
            type: String
          },
          fnameTh: {
            type: String
          },
          lnameTh: {
            type: String
          },
          titleEn: {
            type: String
          },
          fnameEn: {
            type: String
          },
          lnameEn: {
            type: String
          },
          isMain: {
            type: String
          },
          phone: [{
            type: {
              type: String
            },
            number: {
              type: String
            },
            ext: {
              type: String
            },
            isMain: {
              type: String
            },
          }],
          social: [{
            type: {
              type: String
            },
            social: {
              type: String
            },
            isMain: {
              type: String
            }
          }]
        }]
      }
    },
    financialInfo: [{
      bankKey: {
        type: String
      },
      bankNameCode: {
        type: String
      },
      bankName: {
        type: String
      },
      branchNameCode: {
        type: String
      },
      branchName: {
        type: String
      },
      accountType: {
        type: String
      },
      accountNumber: {
        type: String
      },
      accountNameTitile: {
        type: String
      },
      accountName: {
        type: String
      },
      bankremark: {
        type: String
      },
    }],
    retailDistributorInfo: {
      type: {
        locationId: {
          type: String
        },
        productId: {
          type: String
        },
        productName: {
          type: String
        },
        distLocationId: {
          type: String
        },
        distLocationCode: {
          type: String
        },
        distLocationName: {
          type: String
        },
        provinceCode: {
          type: String
        },
        provinceName: {
          type: String
        },
        status: {
          type: String
        },
        distType: {
          type: String
        },
        region: {
          type: String
        },
        subRegion: {
          type: String
        },
        roleIdSb: {
          type: String
        },
        createdDt: {
          type: String
        },
        createdBy: {
          type: String
        },
        distType: {
          type: String
        },
        lastUpDt: {
          type: String
        },
        lastUpBy: {
          type: String
        },
        cmd: {
          type: String
        },
      }
    },
    userLoginInfo: {
      type: {
        levelCode: {
          type: String
        },
        username: {
          type: String
        },
        mobileOtp: {
          type: String
        },
        mobileSms: {
          type: String
        },
        mobileLdap: {
          type: String
        },
        email: {
          type: String
        },
        activeFlg: {
          type: String
        },
        action: {
          type: String
        }
      }
    },
    summary: {
      default: undefined,
      type: {
        locationCode: {
          type: String
        }
      }
    },
    resendLocation: {
      default: undefined,
      type: String
    },
    response: {
      default: undefined,
      type: {
        errorCode: {
          type: String
        },
        errorResponse: {
          type: String
        }
      }
    }
  },
}, {
  strict: false,
  versionKey: false
});

var locationDraft = mongoose.model('locationDraft', locationDraftSchema, 'locationDraft');

module.exports = locationDraft;