var UNKNOWN = "Okänt";

function regToType(reg) {
  switch(reg) {
    case "SE-SKZ":
    case "SE-TZY":
      return "ASK-21";
    case "SE-TVL":
      return "Pilatus B4";
    case "SE-UFA":
      return "LS-4";
    case "SE-UUY":
      return "Duo Discus";
    default:
      return UNKNOWN;
  }
}

function airfieldCodeToName(code) {
  switch (code) {
    case "ESSZ":
      return "ESSZ (Vängsö)";
    default:
      return UNKNOWN;
  }
}

function description(desc) {
  switch (desc) {
    case "SEGEL PRIVAT":
      return "F";
    case "SEGEL DK3":
      return "Infl/K/Skol";
    default:
      return UNKNOWN;
  }
}

function isDk(desc) {
  return desc === "Infl/K/Skol";
}

function startMethod(airfieldCode) {
  switch (airfieldCode) {
    case "ESSZ":
      return "Flygsläp";
    default:
      return UNKNOWN;
  }
}

function startMethodToHeight(startMethod) {
  switch (startMethod) {
    default:
    case "Flygsläp":
      return 600;
    case "Vinsch":
      return 300;
  }
}

function hoursToReadableTime(hours) {
  var timeHours = Math.floor(hours);
  var timeMins = Math.round((hours * 60) % 60);
  return timeHours + ":" + timeMins;
}
