import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:planificateur_voyage/src/Widgets/SearchPlace/place_api_provider.dart';
import 'package:planificateur_voyage/src/Widgets/SearchPlace/place_model.dart';
import 'package:planificateur_voyage/src/models/triplist_model.dart';



class SearchPlaceTextField extends StatefulWidget {


  SearchPlaceTextField({Key key, this.decoration}) : super(key: key);

  final InputDecoration decoration;


  _SearchPlaceTextFieldState _state =new _SearchPlaceTextFieldState();
  @override
  _SearchPlaceTextFieldState createState() => _state;

  Location getLocation() {
    return _state.getLocation();
  }
}

class _SearchPlaceTextFieldState extends State<SearchPlaceTextField> {
  TextEditingController _searchTextController = new TextEditingController();
  PlaceListApiProvider placeProvider = new PlaceListApiProvider();

  PlaceList _placeListe;
  Location _location;
  bool _locationSelected = false;


  Location getLocation() {
    return _location;
  }

  Widget buildList(PlaceList pl) {
    PlaceList _data = pl;
    return ListView.builder(
        shrinkWrap: true,
        itemCount: _data.count,
        itemBuilder: (BuildContext context, int index) {

          IconData iconData = Icons.place;
          switch (_data.places[index].kind) {
            case "country":
              iconData = Icons.language;
              break;
            case "airport":
              iconData = Icons.airplanemode_active;
              break;
            case "station":
              iconData = Icons.train;
              break;
            default:
              iconData = Icons.place;
          }

          return Container(
            child: InkWell(
              onTap: () {
                Location location = new Location({
                  "name": _data.places[index].longName,
                  "latitude": _data.places[index].lat,
                  "longitude": _data.places[index].lng
                });
                print(location.lng);
                print(location.lat);
                print(location.name);
                _location = location;
                setState(() {
                  _locationSelected = true;
                });
                _searchTextController.value =
                    new TextEditingController.fromValue(
                        new TextEditingValue(text: location.name)).value;
                FocusScope.of(context).requestFocus(FocusNode());
              },
              child: Padding(
                padding: const EdgeInsets.only(left: 16, top: 15, bottom: 15),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(right: 16.0),
                      child: Icon(iconData, color: Color(0xffb3b3b3),),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            Text(_data.places[index].longName.split(",")[0],
                              style: TextStyle(fontSize: 16,
                                  color: Color(0xff010101),
                                  fontWeight: FontWeight.bold),),
                            Text(", " + _data.places[index].longName.split(",")
                                .getRange(1, _data.places[index].longName
                                .split(",")
                                .length)
                                .join(","), style: TextStyle(fontSize: 16,
                                color: Color(0xffb3b3b3),
                                fontWeight: FontWeight.bold),),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        }
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: Container(
            width: MediaQuery
                .of(context)
                .size
                .width,
            child: Stack(
                children: <Widget>[
                  new Container(
                      child: new TextField(
                        controller: _searchTextController,
                        decoration: widget.decoration,
                        onChanged: (text) async {
                          PlaceList newPlaceListe = await placeProvider.getPlaces(text);
                          setState(() {
                            _locationSelected = false;
                            _placeListe = newPlaceListe;
                          });
                        },
                      )
                  ),

                  Padding(
                      padding: const EdgeInsets.only(top: 45.0),
                      child: (_placeListe != null && _placeListe.places.length > 0 && !_locationSelected) ? buildList(_placeListe) : Container()
                  ),
                ]
            )
        )
    );
  }
}