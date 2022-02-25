const xl = require('excel4node');
const fs = require('fs');
const path = require('path');
const name = 'testExcel';
const filePath = path.join(__dirname, `../excel/${name}.xlsx`);
console.log('Make Excel New Lib.');
fs.closeSync(fs.openSync(filePath, 'w'));
exports.test = function() {
  var wb = new xl.Workbook();
  /* ------------- [START ADD WORK SHEET] ------------ */
  var ws = wb.addWorksheet('Sheet 1');
  /* ------------- [END ADD WORK SHEET] ------------ */
  var data = [{
    "resultCode": "200",
    "resultDescription": "success",
    "resultData": [{
      "distChnCode": "TL",
      "distChnName": "Telecom",
      "chnSalesCode": "TW",
      "chnSalesName": "AIS Shop",
      "company": [{
          "comapnyIdNo": "1123123123123",
          "companytitleTh": "บริษัท",
          "companynameTh": "แอดวานซ์ ไวเลส เน็ทเวิร์ค จำกัด",
          "companyAbbr": "awn"
        },
        {
          "comapnyIdNo": "1123123123123",
          "companytitleTh": "บริษัท",
          "companynameTh": "แอดวานซ์ ไวเลส เน็ทเวิร์ค มหาชน",
          "companyAbbr": "awl"
        }
      ]
    }]
  }];
  console.log(data[0].resultData[0].distChnCode);
  ws.cell(1, 1).string(data[0].resultCode);
  ws.cell(1, 2).string(data[0].resultDescription);
  ws.cell(1, 3).string(data[0].resultData[0].distChnCode);
  ws.cell(1, 4).bool(true);
  wb.write(filePath);
  console.log('End Make Excel.');
};
