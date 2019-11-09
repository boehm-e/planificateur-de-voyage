import 'package:flutter/material.dart';

class TripList {
  int _count;
  List<Trip> _trips = [];

  TripList.fromJson(List<dynamic> data) {
    _count = data.length;
    List<Trip> temp_trips = [];
    for (int i = 0; i < _count; i++) {
      Trip trip = Trip(data[i]);
      temp_trips.add(trip);
    }
     _trips = temp_trips;
  }

  int get count => _count;
  List<Trip> get trips => _trips;
}

class Trip {
  int _id;
  String _name;
  DateTime _startDate;
  DateTime _endDate;
  String _preview = "https://www.club7holidays.com/wp-content/themes/adventure-tours/assets/images/placeholder.png";

  int get id => _id;
  List<Event> _events;

  Trip(trip) {
    _id = trip['id'];
    _name = trip['name'];
    _startDate = DateTime.parse(trip['start_date']);
    _endDate = DateTime.parse(trip['end_date']);

    List<Event> temp_events = [];
    for (int i = 0; i < trip['events'].length; i++) {
      Event event = Event(trip['events'][i]);
      temp_events.add(event);
    }
    _events = temp_events;
  }

  List<Event> get events => _events;
  String get name => _name;
  DateTime get startDate => _startDate;
  DateTime get endDate => _endDate;
  String get preview => _preview;
}

class Location {
  int _id;
  String _name;
  double _lat;
  double _lng;

  Location(location) {
    _id = location['id'];
    _name = location['name'];
    _lat = double.parse(location['latitude'].toString());
    _lng = double.parse(location['longitude'].toString());
  }

  int get id => _id;
  String get name => _name;
  double get lat => _lat;
  double get lng => _lng;
}

class Event {
  int _id;
  String _type;
  String _name;
  DateTime _start_date;
  DateTime _end_date;
  Location _start_location;
  Location _end_location;

  Event(event) {
    _id = event['id'];
    _type = event['type'];
    _name = event['name'];
    _start_date  = DateTime.parse(event['start_date']);
    _end_date  = event['end_date'] != null ? DateTime.parse(event['end_date']) : null;
    _start_location = Location(event['start_location']);
    _end_location = event['end_location'] != null ? Location(event['end_location']) : null;
  }

  String get type => _type;
  String get name => _name;
  Location get end_location => _end_location;
  Location get start_location => _start_location;
  DateTime get end_date => _end_date;
  DateTime get start_date => _start_date;
  int get id => _id;
}
