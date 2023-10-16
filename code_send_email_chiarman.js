function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  }
  function sendEmailWithData_for_ch() {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var data = ss.getSheetByName("탭이름").getDataRange().getValues();
      var template = HtmlService.createTemplateFromFile('email_template_chairman.html');
    
  
  // 예시: 첫 번째 행의 데이터를 공통사항에 반영
      template.content = {
          today: getFormattedDate(), // 오늘 날짜 데이터
          common_progress: data[4][2], // 진행 건수
          common_over: data[4][4], // 초과 건수
          common_predict: data[4][5], // 종료 건수
          
          control_progress: data[5][2], 
          control_over: data[5][4],
          control_predict: data[5][5],
          
          support_progress : data[6][2],
          support_over : data[6][4],
          support_predict : data[6][5],
                              
          culture_progress : data[7][2],
          culture_over : data[7][4],
          culture_predict : data[7][5],
                              
          information_progress : data[8][2],
          information_over : data[8][4],
          information_predict : data[8][5],
                              
          manage_sum_progress : data[2][2],
          manage_sum_over : data[2][4],
          manage_sum_predict : data[2][5],
                              
          insurance_progress : data[9][2],
          insurance_over : data[9][4],
          insurance_predict : data[9][5],
  
          region_progress : data[10][2],
          region_over : data[10][4],
          region_predict : data[10][5],
                              
          safety_progress : data[11][2],
          safety_over : data[11][4],
          safety_predict : data[11][5],
                              
          facility_progress : data[12][2],
          facility_over : data[12][4],
          facility_predict : data[12][5],
                              
          business_sum_progress : data[3][2],
          business_sum_over : data[3][4],
          business_sum_predict : data[3][5],
                              
          audit_progress : data[13][2],
          audit_over : data[13][4],
          audit_predict : data[13][5],
                              
          future_progress : data[14][2],
          future_over : data[14][4],
          future_predict : data[14][5],
                              
          management_progress : data[15][2],
          management_over : data[15][4],
          management_predict : data[15][5],
                              
          total_sum_progress : data[1][2],
          total_sum_over : data[1][4],
          total_sum_predict : data[1][5],
  
          fileURL: "  " // 지시사항 관리대장의 URL
      };
  
      
     // 다른 부서의 데이터도 이와 같은 방식으로 템플릿에 적용
  
      var emailBody = template.evaluate().getContent();
  
      MailApp.sendEmail({
          to: "받는사람 메일주소",
          subject: "메일 제목",
          cc : '참조 이메일',
          htmlBody: emailBody
      });
  }
  