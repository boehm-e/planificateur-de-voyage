import 'dart:async';
import 'package:planificateur_voyage/src/Widgets/SearchPlace/place_model.dart';
import 'package:planificateur_voyage/src/Widgets/SearchPlace/place_api_provider.dart';

import 'trips_api_provider.dart';
import '../models/triplist_model.dart';

class Repository {
  final triplistApiProvider = TripListApiProvider();
  Future<TripList> fetchAllTrips() => triplistApiProvider.fetchTripList();
  Future<bool> createTrip(String name, String description, DateTime startDate, DateTime endDate) => triplistApiProvider.createTrip(name, description, startDate, endDate);
  Future<bool> createEvent(int tripId, String type, String name, DateTime startDate, DateTime endDate, Location startLocation, Location endLocation) => triplistApiProvider.createEvent(tripId, type, name, startDate, endDate, startLocation, endLocation);
  Future<bool> removeTrip(int id) => triplistApiProvider.removeTrip(id);

  final placelistApiProvider = PlaceListApiProvider();
  Future<PlaceList> getPlaces(String search) => placelistApiProvider.getPlaces(search);
}