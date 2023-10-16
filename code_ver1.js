function email_alarm() {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let emailSheet = ss.getSheetByName("부서장이메일(목)");
    let lengthCount = emailSheet.getDataRange().getValues().length;
    let members = [];
  
    for (let i = 2; i <= lengthCount; i++) {  // <= 사용하여 마지막 행까지 포함
      let member = {};
      member['department'] = emailSheet.getRange(i, 2).getValue();
      member['role'] = emailSheet.getRange(i, 3).getValue();
      member['name'] = emailSheet.getRange(i, 4).getValue();
      member['mail'] = emailSheet.getRange(i, 5).getValue();
      member['total_sum'] = emailSheet.getRange(i, 6).getValue();
      member['process_sum'] = emailSheet.getRange(i, 7).getValue();
      member['finish_sum'] = emailSheet.getRange(i, 8).getValue();
      member['overday_sum'] = emailSheet.getRange(i, 9).getValue();
      member['predict_sum'] = emailSheet.getRange(i, 10).getValue();
      
      // 이메일 주소가 빈 문자열이 아닌 경우에만 members 배열에 추가
      if (member['mail'].trim() !== "") {
        members.push(member);
      }
    }
  
    for (let i = 0; i < members.length; i++) {
      sendEmailForMember(members[i]);
    }
  }
  
  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  }
  
  function sendEmailForMember(member) {
    var template = HtmlService.createTemplateFromFile('email_template.html');
  
    template.content = {
      department: member['department'],
      name: member['name'],
      role: member['role'],
      today: getFormattedDate(),
      sum: member['total_sum'], 
      process: member['process_sum'], 
      finish: member['finish_sum'], 
      over: member['overday_sum'], 
      predict: member['predict_sum'], 
      fileURL: "  "
    };
  
    var htmlBody = template.evaluate().getContent();
  
    try { 
      MailApp.sendEmail({
        to: member['mail'],
        subject: "메일제목",
        cc : '참조1, 참조2',//
        htmlBody: htmlBody
      });
    } catch (error) {
      console.error(`Error sending email to ${member['mail']}: ${error}`);
    }
  }
  