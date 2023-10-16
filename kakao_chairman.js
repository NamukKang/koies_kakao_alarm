function makeSignature(method, uri, timestamp, accessKey, secretKey) {
    var message = method + " " + uri + "\n" + timestamp + "\n" + accessKey;
    var signature = Utilities.computeHmacSha256Signature(message, secretKey);
    return Utilities.base64Encode(signature);
}

function getSheetData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('탭이름');  // 원하는 시트 이름
  var range = sheet.getRange('A1:F16');  // 원하는 범위
  var values = range.getValues();
  
  // 값을 콘솔에 출력 (필요에 따라 다른 작업을 수행할 수 있습니다)
  //Logger.log(values);
  return values;
}

function sendUpdatedNotificationToChairman() {
    //const data = getPersonData(row);
    // ... 기존 코드 (serviceId, accessKey, secretKey, signature 생성 부분 등) ...
  const serviceId = '서비스아이디'; 
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

  const sheetData = getSheetData();
    
  const content = `안녕하세요! (이름) 이사장님,
총 ${sheetData[1][1]}건의 지시사항 중에 진행 ${sheetData[1][2]}건, 다음주 종료예정 ${sheetData[1][5]}건의 지시사항이 있으며, 아래는 부서별 세부 진행사항입니다.
공통사항 : 진행${sheetData[4][2]}건, 종료${sheetData[4][5]}건
경영관리본부 : 진행${sheetData[2][2]}건, 종료${sheetData[2][5]}건
 -기획조정실 : 진행${sheetData[5][2]}건, 종료${sheetData[5][5]}건
 -운영지원처 : 진행${sheetData[6][2]}건, 종료${sheetData[6][5]}건
 -안전문화처 : 진행${sheetData[7][2]}건, 종료${sheetData[7][5]}건
 -통합정보처 : 진행${sheetData[8][2]}건, 종료${sheetData[8][5]}건
사업관리본부 : 진행${sheetData[3][2]}건, 종료${sheetData[3][5]}건
 -공제사업처 : 진행${sheetData[9][2]}건, 종료${sheetData[9][5]}건
 -권역별지부 : 진행${sheetData[10][2]}건, 종료${sheetData[10][5]}건
 -안전관리처 : 진행${sheetData[11][2]}건, 종료${sheetData[11][5]}건
 -교육시설지원처 : 진행${sheetData[12][2]}건,종료${sheetData[12][5]}건
감사실 : 진행${sheetData[13][2]}건, 종료${sheetData[13][5]}건
경영지원팀 : 진행${sheetData[15][2]}건, 종료${sheetData[15][5]}건
미래전략팀 : 진행${sheetData[14][2]}건, 종료${sheetData[14][5]}건`;
    
  const payload = {
    "plusFriendId": "플러스아이디",
    "templateCode": "forChairmanv2",
    "messages": [
      {
        "countryCode": "82",
        "to": "핸드폰번호", 
        "title": "이사장 지시사항 관리대장",
        "content": content,
        "buttons": [
          {
            "type": "WL",
            "name": '지시사항 관리대장',
            "linkMobile": "  ",
            "linkPc": "  "
          }
        ],
        "useSmsFailover": true,
        "failoverConfig": {
          "type": "SMS",
          "from": "담당자핸드폰번호",
          "content": "이사장 알림톡 발송에 실패하였습니다. 상세 내용을 확인해주세요."
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
  // 본인에게 알림 보내기
  const yourPhoneNumber = "담당자핸드폰번호"; // 
  
  const payloadForYou = {
    "plusFriendId": "카카오플러스아이디",
    "templateCode": "forChairmanv2",  // 동일한 템플릿 코드를 사용
    "messages": [
      {
        "countryCode": "82",
        "to": yourPhoneNumber,
        "title": "이사장 지시사항 관리대장",
        "content": content,
        "buttons": [
          {
            "type": "WL",
            "name": '지시사항 관리대장',
            "linkMobile": "  ",
            "linkPc": "  "
          }
        ],
        "useSmsFailover": true,
        "failoverConfig": {
          "type": "SMS",
          "from": "010  ", 
          "content": "이사장 알림톡 발송에 실패하였습니다. 상세 내용을 확인해주세요."
        }
      }
    ]
  };

  const optionsForYou = {
    method: method,
    headers: headers,
    payload: JSON.stringify(payloadForYou),
    muteHttpExceptions: true
  };

  const responseForYou = UrlFetchApp.fetch(apiUrl, optionsForYou);
  Logger.log(responseForYou.getContentText());
}

