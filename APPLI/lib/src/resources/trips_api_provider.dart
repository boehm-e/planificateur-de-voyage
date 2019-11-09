import 'dart:async';
import 'dart:io';
import 'package:http/http.dart' show Client;
import 'dart:convert';
import '../models/triplist_model.dart';

String JWT = "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiZW1haWwiOiJlcndhbi5ib2VobUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4ifQ.JG_WquIoj4j-zJeyUO6RuCrlqSft5oozuZgnI7fBvAs";
String API_IP = "192.168.43.91";
String API_PORT = "3000";
String API_BASE_URL = "http://${API_IP}:${API_PORT}";
String USER_ID = "2";

class TripListApiProvider {
  Client client = Client();

  Future<TripList> fetchTripList() async {
    print("trips_api_provider::fetchTripList");
    final response = await client
        .get("${API_BASE_URL}/users/${USER_ID}/trips", headers: {HttpHeaders.authorizationHeader: JWT},);
    print(response.body.toString());
    if (response.statusCode == 200) {
      // If the call to the server was successful, parse the JSON
      return TripList.fromJson(json.decode(response.body));
    } else {
      // If that call was not successful, throw an error.
      throw Exception('Failed to load post');
    }
  }

  Future<bool> createTrip(String name, String description, DateTime startDate, DateTime endDate) async {
    final response = await client.post(
      "${API_BASE_URL}/trip",
      body: {
        "name": name,
        "description": description,
        "start_date": startDate.toLocal().toIso8601String(),
        "end_date": endDate.toLocal().toIso8601String()
      },
      headers: {HttpHeaders.authorizationHeader: JWT},
    );
    print(response.body.toString());
    if (response.statusCode == 200) {
      print(response.body);
      return true;
    } else {
      throw Exception('Failed to load post');
    }
  }

  Future<bool> removeTrip(int id) async {
    final response = await client.delete(
        "${API_BASE_URL}/trip/${id}",
        headers: {HttpHeaders.authorizationHeader: JWT});
    if (response.statusCode == 200) {
      return true;
    } else {
      throw Exception('Failed to remove the trip');
    }
  }

  Future<bool> createEvent(int tripId, String type, String name, DateTime startDate, DateTime endDate, Location startLocation, Location endLocation) async {

    var data  = {
      "trip_id": tripId,
      "type": type,
      "name": name,
      "start_date": startDate.toLocal().toIso8601String(),
      "start_location": {
        "name": startLocation.name,
        "latitude": startLocation.lat,
        "longitude": startLocation.lng,
      },
    };
    if (endDate != null) {
      data["end_date"] = endDate.toLocal().toIso8601String();
    }
    if (endLocation != null) {
      data["end_location"] = {
        "name": endLocation.name,
        "latitude": endLocation.lat,
        "longitude": endLocation.lng,
      };
    }

    final response = await client.post(
      "${API_BASE_URL}/events",
      body: json.encode(data),
      headers: {HttpHeaders.authorizationHeader: JWT,
        'Content-Type': 'application/json'},
    );
    print(response.body.toString());
    if (response.statusCode == 200) {
      print(response.body);
      return true;
    } else {
      throw Exception('Failed to load post');
    }
  }

}