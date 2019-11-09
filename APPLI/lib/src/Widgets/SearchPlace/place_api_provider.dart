import 'dart:async';
import 'dart:io';
import 'package:http/http.dart' show Client;
import 'package:planificateur_voyage/src/Widgets/SearchPlace/place_model.dart';
import 'dart:convert';
import '../../models/triplist_model.dart';

String USER_ID = "2";


String getUrl(String search) {


  return "https://www.rome2rio.com/api/1.5/json/geocode?key=oK8vkE5x&query=${search}&languageCode=fr";
}

class PlaceListApiProvider {
  Client client = Client();

  Future<PlaceList> getPlaces(String search) async {
    print("place_api_provider::getPlaces");

    final response = await client
        .get(getUrl(search));

    if (response.statusCode == 200) {
      // If the call to the server was successful, parse the JSON
      print(response.body);
      return PlaceList.fromJson(json.decode(response.body));
    } else {
      // If that call was not successful, throw an error.
      throw Exception('Failed to fetch places.');
    }
  }
}