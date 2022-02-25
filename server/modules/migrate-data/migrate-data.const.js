module.exports = Object.freeze({
    URL_CREATE_LOCATION: '/phxPartner/v1/createLocation.json',
    URL_GET_LOCATION: '/phxPartner/v1/location/list.json',
    URL_GET_PROFILE: '/phxPartner/v1/location/profile.json',
    URL_GET_INFO: '/phxPartner/v1/location/info.json',
    URL_EDIT_INFO: '/phxPartner/v1/location/info.json',
    URL_GET_VAT_ADDRESS: '/phxPartner/v1/vatAddress/info.json',
    URL_EDIT_VAT_ADDRESS: '/phxPartner/v1/vatAddress/info.json',
    URL_GET_ADDRESS: '/phxPartner/v1/address/list.json',
    URL_EDIT_ADDRESS: '/phxPartner/v1/address/list.json',
    URL_GET_CONTACT: '/phxPartner/v1/contact/list.json',
    URL_EDIT_CONTACT: '/phxPartner/v1/contact/info.json',

    EXCEL_HEADER: ['LocationCode', 'CreatedBy', 'CreatedDate', 'MigrateDate', 'ModifiedBy', 'ModifiedDate', 'DistChnCode', 'DistChnName', 'ChnSalesCode', 'ChnSalesName', 'CompanyAbbr',
        'CompanyId', 'CompanyIdNo', 'CompanyTitleTh', 'CompanyNameTh', 'LicenseCode','SbPartnerId', 'LocationIdType', 'LocationIdNo', 'LocationIdForSB', 'TitleTh', 'NameEn', 'NameTh',
        'Abbrev', 'Status', 'EffectiveDt', 'TerminateDt', 'Remark', 'RetailShop', 'ShopSegment', 'ShopArea', 'ShopType', 'ShopSize', 'IsOpeningMon', 'OpeningHourMon',
        'ClosingHourMon', 'IsOpeningTue', 'OpeningHourTue', 'ClosingHourTue', 'IsOpeningWed', 'OpeningHourWed', 'ClosingHourWed', 'IsOpeningThu', 'OpeningHourThu',
        'ClosingHourThu', 'IsOpeningFri', 'OpeningHourFri', 'ClosingHourFri', 'IsOpeningSat', 'OpeningHourSat', 'ClosingHourSat', 'IsOpeningSun', 'OpeningHourSun',
        'ClosingHourSun', 'IsOpeningHoliday', 'OpeningHourHoliday', 'ClosingHourHoliday', 'BusinessRegistration', 'LocationVatBranchNo', 'LocationVatBranchName',
        'TypeCodeSB', 'SubTypeCodeSB', 'BusinessTypeSB', 'CharacteristicSB','ContactNumber_PhoneId' ,'ContactNumber_PhoneType', 'ContactNumber_PhoneNumber', 'ContactNumber_PhoneExt',
        'ContactNumber_phoneMainFlg', 'Address_AddressId', 'Address_AddressType', 'Address_HouseNo', 'Address_Moo', 'Address_Mooban', 'Address_Building', 'Address_Floor',
        'Address_Room', 'Address_Soi', 'Address_Street', 'Address_ZipCode', 'Address_TumbolTh', 'Address_AmphurTh', 'Address_ProvinceNameTh' ,'Address_ProvinceCode', 'Address_CountryCode',
        'Address_SubRegionCode', 'Address_Remark', 'Address_ZipCodeId', 'VatAddress_VatAddressId', 'VatAddress_CompanyAbbrev', 'VatAddress_VatBranchNo', 'VatAddress_Address',
        'VatAddress_OwnerLocation','ContactPerson_PersonId' ,'ContactPerson_Pincode', 'ContactPerson_TitleTh', 'ContactPerson_FnameTh', 'ContactPerson_LnameTh', 'ContactPerson_TitleEn',
        'ContactPerson_FnameEn', 'ContactPerson_LnameEn', 'ContactPerson_IsMain', 'ContactPerson_IdNumber', 'ContactPerson_IdType', 'ContactPerson_Role','ContactPerson_Phone_Id' ,'ContactPerson_Phone_Type',
        'ContactPerson_Phone_Number', 'ContactPerson_Phone_Ext', 'ContactPerson_Phone_IsMain','ContactPerson_Social_Id' ,'ContactPerson_Social_Type', 'ContactPerson_Social_Social',
        'ContactPerson_Social_IsMain', 'SendSiebel', 'ContactSiebel'
    ],

    EXCEL_GENERAL_HEADER: ['LocationCode', 'CreatedBy', 'CreatedDate', 'MigrateDate', 'ModifiedBy', 'ModifiedDate', 'DistChnCode', 'DistChnName', 'ChnSalesCode', 'ChnSalesName', 
        'CompanyAbbr', 'CompanyId', 'CompanyIdNo', 'CompanyTitleTh', 'CompanyNameTh', 'LicenseCode','SbPartnerId', 'locationIdType', 'locationIdNo', 'LocationIdForSB', 'TitleTh', 
        'NameEn', 'NameTh', 'Abbrev', 'Status', 'EffectiveDt', 'TerminateDt', 'remark', 'RetailShop', 'ShopSegment', 'ShopArea', 'ShopType', 'ShopSize', 'IsOpeningMon', 'OpeningHourMon',
         'ClosingHourMon', 'IsOpeningTue', 'OpeningHourTue', 'ClosingHourTue', 'IsOpeningWed', 'OpeningHourWed', 'ClosingHourWed', 'IsOpeningThu', 'OpeningHourThu', 
         'ClosingHourThu', 'IsOpeningFri', 'OpeningHourFri', 'ClosingHourFri', 'IsOpeningSat', 'OpeningHourSat', 'ClosingHourSat', 'IsOpeningSun', 'OpeningHourSun', 
         'ClosingHourSun', 'IsOpeningHoliday', 'OpeningHourHoliday', 'ClosingHourHoliday', 'BusinessRegistration', 'LocationVatBranchNo', 'LocationVatBranchName', 'TypeCodeSB', 
         'SubTypeCodeSB', 'BusinessTypeSB', 'CharacteristicSB', 'ContactNumber_PhoneId' ,'ContactNumber_PhoneType', 'ContactNumber_PhoneNumber', 'ContactNumber_PhoneExt', 'ContactNumber_phoneMainFlg',
         'Region','SubRegion'
    ],

    EXCEL_ADDRESS_HEADER: ['LocationCode', 'Address_AddressId', 'Address_AddressType', 'Address_HouseNo', 'Address_Moo', 'Address_Mooban', 'Address_Building', 
        'Address_Floor', 'Address_Room', 'Address_Soi', 'Address_Street', 'Address_ZipCode', 'Address_TumbolTh', 'Address_AmphurTh','Address_ProvinceNameTh' , 'Address_ProvinceCode', 
        'Address_CountryCode', 'Address_SubRegionCode', 'Address_Remark', 'Address_ZipCodeId','LocationIdForSB'
    ],

    EXCEL_VAT_ADDRESS_HEADER: [ 'LocationCode', 'VatAddress_VatAddressId', 'VatAddress_CompanyAbbrev', 'VatAddress_VatBranchNo', 'VatAddress_Address', 'VatAddress_OwnerLocation','LocationIdForSB'
    ],

    EXCEL_CONTACT_HEADER: [ 'LocationCode','ContactPerson_PersonId', 'ContactPerson_Pincode', 'ContactPerson_TitleTh', 'ContactPerson_FnameTh', 'ContactPerson_LnameTh', 'ContactPerson_TitleEn', 
        'ContactPerson_FnameEn', 'ContactPerson_LnameEn', 'ContactPerson_IsMain', 'ContactPerson_IdNumber', 'ContactPerson_IdType', 'ContactPerson_Role', 
        'ContactPerson_Phone_Id','ContactPerson_Phone_Type', 'ContactPerson_Phone_Number', 'ContactPerson_Phone_Ext', 'ContactPerson_Phone_IsMain', 
        'ContactPerson_Social_Id','ContactPerson_Social_Type', 'ContactPerson_Social_Social', 'ContactPerson_Social_IsMain','LocationIdForSB'
],

    EXCEL_STYLE: {
        headerGrey: {
            fill: {
                fgColor: {
                    rgb: 'FFA6A6A6'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 12
            },
            alignment: {
                vertical: 'center',
                horizontal: 'center'
            },
            border: {
                top: {
                    style: 'thin',
                    color: {
                        rgb: 'FFFFFFFF'
                    }
                },
                bottom: {
                    style: 'thin',
                    color: {
                        rgb: 'FFFFFFFF'
                    }
                },
                left: {
                    style: 'thin',
                    color: {
                        rgb: 'FFFFFFFF'
                    }
                },
                right: {
                    style: 'thin',
                    color: {
                        rgb: 'FFFFFFFF'
                    }
                }
            }
        }
    }
});