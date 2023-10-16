function makeSignature(method, uri, timestamp, accessKey, secretKey) {
    var message = method + " " + uri + "\n" + timestamp + "\n" + accessKey;
    var signature = Utilities.computeHmacSha256Signature(message, secretKey);
    return Utilities.base64Encode(signature);
}

function getSheetDataForDM() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('탭이름');
    var range = sheet.getRange('A1:F18');
    return range.getValues();
}
// [헹][열]
function generateContentForJung(sheetData) {
    return `안녕하세요! 경영관리본부 정준호 본부장님,
총 ${sheetData[16][1]} 건의 지시사항 중에 진행 ${sheetData[16][2]}건, 다음주 종료${sheetData[16][5]}건의 지시사항이 있으며, 아래는 부서별 세부 진행사항입니다.
공통사항 : 진행${sheetData[4][2]}건, 종료${sheetData[4][5]}건
기획조정실 : 진행${sheetData[5][2]}건, 종료${sheetData[5][5]}건
운영지원처 : 진행${sheetData[6][2]}건, 종료${sheetData[6][5]}건
안전문화처 : 진행${sheetData[7][2]}건, 종료${sheetData[7][5]}건
통합정보처 : 진행${sheetData[8][2]}건, 종료${sheetData[8][5]}건
감사실 : 진행${sheetData[13][2]}건, 종료${sheetData[13][5]}건
미래전략팀 : 진행${sheetData[14][2]}건, 종료${sheetData[14][5]}건
경영지원팀 : 진행${sheetData[15][2]}건, 종료${sheetData[15][5]}건`;
}

function generateContentForLee(sheetData) {
    return `안녕하세요! 사업관리본부 이병호 본부장님,
총 ${sheetData[17][1]} 건의 지시사항 중에 진행 ${sheetData[17][2]}건, 다음주 종료예정 ${sheetData[17][5]}건의 지시사항이 있으며, 아래는 부서별 세부 진행사항입니다.
공통사항 : 진행${sheetData[4][2]}건, 종료${sheetData[4][5]}건
공제사업처 : 진행${sheetData[9][2]}건, 종료${sheetData[9][5]}건
권역별지부 : 진행${sheetData[10][2]}건, 종료${sheetData[10][5]}건
안전관리처 : 진행${sheetData[11][2]}건, 종료${sheetData[11][5]}건
교육시설지원처 : 진행${sheetData[12][2]}건, 종료${sheetData[12][5]}건`;
}

function sendNotification(templateCode, content, phoneNumber) {
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

    const payload = {
        "plusFriendId": "  ",
        "templateCode": templateCode,
        "messages": [
        {
            "countryCode": "82",
            "to": phoneNumber,
            "title": "이사장 지시사항 관리대장",
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
          "from": "  ",
          "content": "알림톡 발송에 실패하였습니다. 상세 내용을 확인해주세요."
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

function sendUpdatedNotificationToDirectManagerForJung() {
    const sheetData = getSheetDataForDM();
    const content = generateContentForJung(sheetData);
    sendNotification("forgmjungv2", content, "010  "); //
    sendNotification("forgmjungv2", content, "010  "); //
}

function sendUpdatedNotificationToDirectManagerForLee() {
    const sheetData = getSheetDataForDM();
    const content = generateContentForLee(sheetData);
    sendNotification("forgmleev2", content, "010  "); //
    sendNotification("forgmleev2", content, "010  "); //
}