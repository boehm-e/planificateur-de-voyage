import 'package:flutter/material.dart';

class PlaceList {
  int _count;
  List<Place> _places = [];

  PlaceList.fromJson(Map<String, dynamic> data) {
    List<dynamic> places = data["places"];
    print("PLACES : " + places.toString());
    _count = places.length;
    List<Place> temp_places = [];

    for (int i = 0; i < _count; i++) {
      Place place = Place(places[i]);
      temp_places.add(place);
    }
     _places = temp_places;
  }

  int get count => _count;
  List<Place> get places => _places;
}

class Place {
  int _id;
  String _shortName;
  String _longName;
  String _googlePlaceId;
  String _rom2rioName;
  String _kind;
  double _lat;
  double _lng;

  Place(place) {
    print("place : " + place.toString());
    _id = place['id'];
    _shortName = place['shortName'];
    _longName = place['longName'];
    _googlePlaceId = place['googlePlaceId'];
    _kind = place['kind'];
    _lat = place['lat'];
    _lng = place['lng'];
  }

  double get lng => _lng;

  double get lat => _lat;

  String get kind => _kind;

  String get rom2rioName => _rom2rioName;

  String get googlePlaceId => _googlePlaceId;

  String get longName => _longName;

  String get shortName => _shortName;

  int get id => _id;

}
