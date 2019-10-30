import 'package:flutter/material.dart';

class Trip {
  final int id;
  final String name;
  final DateTime startDate;
  final DateTime endDate;
  final String preview;
  final List<Event> events;

  const Trip(
      {
        this.id,
        this.name,
        this.startDate,
        this.endDate,
        this.preview,
        this.events
      });
}

class Location {
  final int id;
  final String name;
  final String lat;
  final String lng;

  const Location({
    this.id,
    this.name,
    this.lat,
    this.lng
  });
}

class 


{
  final int id;
  final String type;
  final String name;
  final DateTime date;
  final Location location;

  const Event({
    this.id,
    this.type,
    this.name,
    this.date,
    this.location,
  });
}

List<Trip> trips = [
  new Trip(
      id: 0,
      name: "Cyclades",
      startDate: new DateTime(2019, 11, 4),
      endDate: new DateTime(2019, 11, 4),
      preview: "https://www.verdie-voyages.com/images/fp/detail-produit/165/images/Paros-island--Greece-6696.jpg",
      events: [
        new Event(id: 0, type: "plane_start", name: "CDG Depart", date: new DateTime(2019, 07, 31, 17, 55), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "plane_end", name: "VIE Arrivee", date: new DateTime(2019, 07, 31, 19, 55), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "plane_start", name: "VIE Depart", date: new DateTime(2019, 07, 30, 21, 40), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "plane_end", name: "ATH Arrivee", date: new DateTime(2019, 07, 31, 0, 45), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "boat_start", name: "Piree", date: new DateTime(2019, 8, 1, 7, 5), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "boat_end", name: "Milos", date: new DateTime(2019, 8, 1, 15, 15), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "camping_start", name: "Camping Milos Arrivee", date: new DateTime(2019, 8, 1), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "camping_end", name: "Camping Milos Depart", date: new DateTime(2019, 8, 6), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "boat_start", name: "Milos - Serifos Depart", date: new DateTime(2019, 8, 6, 12, 50), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "boat_end", name: "Milos - Serifos Arrivee", date: new DateTime(2019, 8, 6, 15, 5), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "camping_start", name: "Coralli Camping Arrivee", date: new DateTime(2019, 8, 6), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "camping_end", name: "Coralli Camping Depart", date: new DateTime(2019, 8, 11), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "boat_start", name: "Serifos - Syros Depart", date: new DateTime(2019, 8, 11, 17, 45), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "boat_end", name: "Serifos - Syros Arrivee", date: new DateTime(2019, 8, 11, 21, 30), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "hotel_start", name: "Serifos Airbnb Arrivee", date: new DateTime(2019, 8, 11, 22, 0), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "hotel_end", name: "Serifos Airbnb Depart", date: new DateTime(2019, 8, 14, 10, 0), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "boat_start", name: "Syros - Athenes Depart", date: new DateTime(2019, 8, 14, 12, 10), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "boat_end", name: "Syros - Athenes Arrivee", date: new DateTime(2019, 8, 14, 14, 20), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "plane_start", name: "ATH Depart", date: new DateTime(2019, 8, 15, 6, 5), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "plane_end", name: "MUC Arrivee", date: new DateTime(2019, 8, 15, 7, 35), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "plane_start", name: "MUC Depart", date: new DateTime(2019, 8, 15, 18, 16), location: new Location(id: 0, lat: "42", lng: "2.5"),),
        new Event(id: 0, type: "plane_end", name: "CDG Arrivee", date: new DateTime(2019, 8, 15, 17, 10), location: new Location(id: 0, lat: "42", lng: "2.5"),),
      ]
  ),
  new Trip(
      id: 1,
      name: "Londres",
      startDate: new DateTime(2019, 11, 4),
      endDate: new DateTime(2019, 11, 4),
      preview: "https://www.voyagetips.com/wp-content/uploads/2018/07/Que-faire-a-Londres.jpg"
  ),
  new Trip(
      id: 2,
      name: "Islande",
      startDate: new DateTime(2019, 11, 4),
      endDate: new DateTime(2019, 11, 4),
      preview: "https://photo-thalasso-to.advences.com/islande-ballet-des-orques-01.jpg"
  ),
  new Trip(
      id: 3,
      name: "Copenhague",
      startDate: new DateTime(2019, 11, 4),
      endDate: new DateTime(2019, 11, 4),
      preview: "https://uploads.lebonbon.fr/source/2019/january/by3qlnedy7_3_292.jpg"
  ),
  new Trip(
      id: 3,
      name: "Copenhague",
      startDate: new DateTime(2019, 11, 4),
      endDate: new DateTime(2019, 11, 4),
      preview: "https://uploads.lebonbon.fr/source/2019/january/by3qlnedy7_3_292.jpg"
  ),
  new Trip(
      id: 3,
      name: "Copenhague",
      startDate: new DateTime(2019, 11, 4),
      endDate: new DateTime(2019, 11, 4),
      preview: "https://uploads.lebonbon.fr/source/2019/january/by3qlnedy7_3_292.jpg"
  ),

];
