function makeSignature(method, uri, timestamp, accessKey, secretKey) {
    var message = method + " " + uri + "\n" + timestamp + "\n" + accessKey;
    var signature = Utilities.computeHmacSha256Signature(message, secretKey);
    return Utilities.base64Encode(signature);
}

function getFilteredData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('탭이름');
  var dataRange = sheet.getRange('A2:G28');
  var values = dataRange.getValues();
  //Logger.log(values)
  return values.filter(row => !row[6] && row[5] !== 0);
}

function sendNotificationToManager_update() {
  const dataList = getFilteredData();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('탭이름');
  const serviceId = '알림톡용서비스 아이디';  // 알림톡용 서비스 ID로 변경해주세요
  const accessKey = '';
  const secretKey = '';
  const timestamp = new Date().getTime().toString();
  const method = "POST";
  const uri = `/alimtalk/v2/services/${serviceId}/messages`;
  const signature = makeSignature(method, uri, timestamp, accessKey, secretKey);
  const apiUrl = `https://sens.apigw.ntruss.com${uri}`;
  const headers = {
    "Content-Type": "application/json",
    "x-ncp-apigw-timestamp": timestamp,
    "x-ncp-iam-access-key": accessKey,
    "x-ncp-apigw-signature-v2": signature
  };


  dataList.forEach(function(data) {
      //... (알림 발송 부분)  data[열][행] 1: 부서, 2. 직급, 3. 성명, 4. 전화번호
      const content = `안녕하세요!! ${data[3]} ${data[2]}님,
이사장 지시사항 대장에 ${data[1]}의 신규사항이 업데이트 되었습니다.
확인하시고 이행계획 및 목표 부분에 내용을 작성하여 주시기 바랍니다.`;
      const payload = {
        "plusFriendId": "카카오플러스 아이디",
        "templateCode": "updatealarm",
        "messages": [
          {
            "countryCode": "82",
            "to": data[4], 
            
            "title": "이사장 지시사항 알림",
            "content": content,
            "buttons": [
          {
            "type": "WL",
            "name": "지시사항 관리대장",
            "linkMobile": "  ",
            "linkPc": "  "
          }
        ],
        "useSmsFailover": true,
        "failoverConfig": {
          "type": "SMS",
          "from": "전화번호",
          "content": "업데이트 알림톡 발송에 실패하였습니다. 상세 내용을 확인해주세요."
            }
          }
        ]
      };
      //Logger.log(content)
      const options = {
        method: method,
        headers: headers,
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };
      const response = UrlFetchApp.fetch(apiUrl, options);
      //Logger.log(response.getContentText());
      
      // 성명을 기반으로 해당 행을 찾기
      const rowIndex = findRowIndexByName(sheet, data[3]);

      // 발송 후 '발송' 표시
      if (rowIndex) {
        sheet.getRange('G' + rowIndex).setValue('발송');
        //Logger.log(`[${data[3]}]님에게 알림을 발송했습니다.`);
      }
  });
}

function findRowIndexByName(sheet, name) {
  const nameRange = sheet.getRange('D2:D' + sheet.getLastRow()).getValues();
  for (let i = 0; i < nameRange.length; i++) {
    if (nameRange[i][0] === name) {
      return i + 2; // +2는 헤더와 array index를 고려한 것입니다.
    }
  }
  return null;
}

//금요일 오후 늦게 실행
function resetSentColumn() { 
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('탭이름');
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange('G2:G' + lastRow);
    range.clearContent();
}