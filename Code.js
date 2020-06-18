function updateFlightLog() {
  var sheetId = PropertiesService.getScriptProperties().getProperty("sheetId");
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Loggar");
  var lastFlightDate = new Date(sheet.getRange(sheet.getLastRow(), 1).getValue());
  var currentDate = new Date();
  
  var email = PropertiesService.getScriptProperties().getProperty("userEmail");
  var name = PropertiesService.getScriptProperties().getProperty("userName");
  
  var response = fetchLogsBetween(lastFlightDate.addDays(1), currentDate);
  
  if (response.result.FlightLog === undefined) {
    throw new Error("Expected FlightLog, but got this response instead:\n" + JSON.stringify(response));
  }
  if (response.result.FlightLog.length != 0) {
    var logsNum = response.result.FlightLog.length;
    var logs = response.result.FlightLog;
    
    for (var i = 0; i < logs.length; i++) {
      var log = logs[i];
      var logData = {
        "date": log.flight_datum,
        "aircraft_reg": log.regnr,
        "aircraft_type": regToType(log.regnr),
        "flight_type": description(log.nature_beskr),
        "from": airfieldCodeToName(log.departure),
        "to": airfieldCodeToName(log.arrival),
        "flight_time": hoursToReadableTime(log.airborne_total),
        "flights": log.flights,
        "start_method": startMethod(log.departure),
        "height": startMethodToHeight(startMethod(log.departure))
      };
      
      sheet.appendRow([logData.date,
                       logData.aircraft_reg,
                       logData.aircraft_type,
                       logData.flight_type,
                       logData.from,
                       logData.to,
                       logData.flight_time,
                       (isDk(logData.flight_type) ? logData.flight_time : ""),
                       "", "", "",
                       logData.flights,
                       "", "",
                       logData.start_method,
                       logData.height]);
    }
    
    var multiple = logsNum > 1;
    
    GmailApp.sendEmail(email, 
                       logsNum + " " + (multiple ? "nya" : "ny") + " flygning" + (multiple ? "ar" : "") + " loggad" + (multiple ? "e" : ""), 
      "Hej " + name + ",\n\n" + 
        logsNum + " flygning" + (multiple ? "ar" : "") + " är loggad" + (multiple ? "e" : "") + " i din flygdagbok.\n\n" +
          "Verifiera här: https://docs.google.com/spreadsheets/d/" + sheetId + "/edit#gid=0\n\n" +
            "Med vänlig hälsning,\nUpdateFlightLog");
  }
}
  
function fetchLogsBetween(fromDate, toDate) {
  var properties = PropertiesService.getScriptProperties();
  var mwlU = properties.getProperty("mwlU");
  var mwlP = properties.getProperty("mwlP");
  var appToken = properties.getProperty("appToken");
  var timeZone = properties.getProperty("timeZone");
  var apiVersion = properties.getProperty("apiVersion");
  
  var url = "https://api.myweblog.se/api_mobile.php?version=" + apiVersion;
  var options = {
    "method": "post",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "payload": {
      "qtype": "GetFlightLog",
      "mwl_u": mwlU,
      "mwl_p": mwlP,
      "app_token": appToken,
      "returnType": "JSON",
      "myflights": "1",
      "from_date": Utilities.formatDate(fromDate, timeZone, "yyyy-MM-dd"),
      "to_date": Utilities.formatDate(toDate, timeZone, "yyyy-MM-dd")
    }
  };
  
  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response);
}
