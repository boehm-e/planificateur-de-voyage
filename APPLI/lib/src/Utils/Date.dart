const _monthes = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const _weekDays = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

String dateToString(DateTime date, {bool weekday=true}) {
  return "${weekday==true?_weekDays[date.weekday-1]:""} ${date.day} ${_monthes[date.month-1]} ${date.year}";
}

String timeToString(DateTime date) {
  date = date.toLocal();
  String _minutes = date.minute > 9 ? date.minute.toString() : "0${date.minute}";
  String _hours = date.hour > 9 ? date.hour.toString() : "0${date.hour}";
  return "${_hours}:${_minutes}";
}