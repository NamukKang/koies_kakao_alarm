function makeSignature(method, uri, timestamp, accessKey, secretKey) {
    var message = method + " " + uri + "\n" + timestamp + "\n" + accessKey;
    var signature = Utilities.computeHmacSha256Signature(message, secretKey);
    return Utilities.base64Encode(signature);
  }
  
  // 1. 데이터를 가져오는 함수
  function getPersonData(row) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('탭이름');
    
    var range = sheet.getRange(row, 2, 1, 10); // B to K
    var values = range.getValues()[0];
  
    return {
      department: values[0],
      position: values[1],
      name: values[2],
      phoneNumber: values[3],
      total: values[4],
      progress: values[5],
      dueIn5Days: values[6],
      dueIn3Days: values[7],
      dueIn1Days: values[8],
      overDays: values[9]
    };
  }
  
  function sendUpdatedNotificationToManager_deadline(row) {
    const data = getPersonData(row);
    // ... 기존 코드 (serviceId, accessKey, secretKey, signature 생성 부분 등) ...
    //const data = getSpreadsheetData();
    const serviceId = '  '; 
    const accessKey = '  ';
    const secretKey = '  ';
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
  
    const content = `안녕하세요! ${data.name} ${data.position}님,
  현재 ${data.department}에서는 ${data.progress}건의 지시사항을 진행하고 있으며,
  - 종료 5일 전 : ${data.dueIn5Days}건
  - 종료 3일 전  : ${data.dueIn3Days}건
  - 종료 1일 전 : ${data.dueIn1Days}건
  - 종료일 초과 : ${data.overDays}건
  이 있으니, 확인하여 주시기 바랍니다.`;
  const payload = {
      "plusFriendId": "  ",
      "templateCode": "fordepartmenthead",
      "messages": [
        {
          "countryCode": "82",
          "to": data.phoneNumber, 
          "title": "이사장 지시사항 알림",
          "content": content,
          "buttons": [
            {
              "type": "WL",
              "name": "지시사항 관리대장",
              "linkMobile": "",
              "linkPc": ""
            }
          ],
          "useSmsFailover": true,
          "failoverConfig": {
            "type": "SMS",
            "from": "  ",
            "content": "데드라인 알림톡 발송에 실패하였습니다. 상세 내용을 확인해주세요."
          }
        }
      ]
    };
  
    const options = {
      method: method,
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
  
    const response = UrlFetchApp.fetch(apiUrl, options);
    Logger.log(response.getContentText());
  }
  
  
  
  function sendMessagesToManagers() {
    for (let row = 2; row <= 16; row++) {
      sendUpdatedNotificationToManager_deadline(row);
    }
    return;
  }
  
