import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_slidable_list_view/flutter_slidable_list_view.dart';
import 'package:planificateur_voyage/src/models/triplist_model.dart';
import 'package:planificateur_voyage/src/ui/NewTrip.dart';
import 'TripDetail.dart';
import '../Utils/Date.dart';

import '../blocs/triplist_bloc.dart';

class MyTrips extends StatefulWidget {
  MyTrips({Key key}) : super(key: key);
  _MyTripsState createState() => _MyTripsState();
}

class _MyTripsState extends State<MyTrips> {


  _dismissDialog() {
    Navigator.pop(context);
  }

  void _deleteTrip(int tripId, String name, BaseSlideItem item) async {
    showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text("Supprimer ${name}?"),
            content: Text("Etes vous bien sur de vouloir supprimer ce voyage ? Cette action est definitive !"),
            actions: <Widget>[
              FlatButton(
                  onPressed: () {
                    _dismissDialog();
                  },
                  child: Text('Annuler')),
              FlatButton(
                onPressed: () async {
                  bool success = await trip_bloc.removeTrip(tripId);
                  if (success == true) {
                    item.remove();
                  }
                  _dismissDialog();
                },
                child: Text('Supprimer'),
              )
            ],
          );
        });
  }
  @override
  Widget build(BuildContext context) {
    trip_bloc.fetchTripList();
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Container(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          child: Stack(
            children: <Widget>[
              Container(
                padding: EdgeInsets.only(top: 145),
                height: MediaQuery.of(context).size.height,
                width: double.infinity,
                child:   StreamBuilder(
                  stream: trip_bloc.tripList,
                  builder: (context, AsyncSnapshot<TripList> snapshot) {
                    if (snapshot.hasData) {
                      return buildList(snapshot);
                    } else if (snapshot.hasError) {
                      return Text(snapshot.error.toString());
                    }
                    return Center(child: CircularProgressIndicator());
                  },
                ),
              ),
              Container(
                height: 140,
                width: double.infinity,
                decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor,
                    borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(30),
                        bottomRight: Radius.circular(30))),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 30),
                  child: Center(
                    child: Text(
                      "Mes voyages",
                      style: TextStyle(color: Colors.white, fontSize: 24),
                    ),
                  ),
                ),
              ),
              Container(
                child: Column(
                  children: <Widget>[
                    SizedBox(
                      height: 110,
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 20),
                      child: Material(
                        elevation: 5.0,
                        borderRadius: BorderRadius.all(Radius.circular(30)),
                        child: TextField(
                          // controller: TextEditingController(text: locations[0]),
                          cursorColor: Theme.of(context).primaryColor,
                          style: TextStyle(color: Colors.black, fontSize: 18),
                          decoration: InputDecoration(
                              hintText: "Recherche un voyage",
                              hintStyle: TextStyle(
                                  color: Colors.black38, fontSize: 16),
                              prefixIcon: Material(
                                elevation: 0.0,
                                borderRadius:
                                BorderRadius.all(Radius.circular(30)),
                                child: Icon(Icons.search),
                              ),
                              border: InputBorder.none,
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 25, vertical: 13)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              new Positioned(
                right: 16,
                top: 95/2,
                child: IconButton(
                  icon: Icon(Icons.add, color: Colors.white,),
                  onPressed: () {
                    Navigator.push(context, new MaterialPageRoute(builder: (context) => NewTrip()));
                  },
                ),
              )

            ],
          ),
        ),
      ),
    );
  }

  Widget buildList(AsyncSnapshot<TripList> snapshot) {
    return SlideListView(
        itemBuilder: (BuildContext context, int index) {
          return buildTripPreview(snapshot.data.trips[index], context);
        },
        actionWidgetDelegate: ActionWidgetDelegate(2, (index) {
          if (index == 0) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[Icon(Icons.delete), Text('delete')],
            );
          } else {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[Icon(Icons.edit), Text('edit|')],
            );
          }
        }, (int indexInList, int index, BaseSlideItem item) {
          if (index == 0) {
            _deleteTrip(snapshot.data.trips[indexInList].id, snapshot.data.trips[indexInList].name, item);
          } else {
            item.close();
          }
        }, [Theme.of(context).primaryColor.withAlpha(100), Theme.of(context).accentColor.withAlpha(100)]), dataList: snapshot.data.trips,
        refreshCallback: () async {
          await trip_bloc.fetchTripList();
//          await Future.delayed(Duration(seconds: 2));
          return;
        }
    );
  }
}

Widget buildTripPreview(Trip trip, BuildContext context) {
  return GestureDetector(
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (context) => new TripDetailView(trip: trip,)),);
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(25),
          color: Colors.white,
        ),
        width: double.infinity,
        height: 110,
        margin: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
//      padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
              width: 110,
              height: 110,
              margin: EdgeInsets.only(right: 15),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(25),
                border: Border.all(width: 1, color: Colors.transparent),
                image: DecorationImage(
                    image: CachedNetworkImageProvider(trip.preview),
                    fit: BoxFit.cover),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      trip.name,
                      style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 18),
                    ),
                    SizedBox(
                      height: 6,
                    ),
                    Row(
                      children: <Widget>[
                        Icon(
                          Icons.calendar_today,
                          color: Theme.of(context).accentColor,
                          size: 20,
                        ),
                        SizedBox(
                          width: 5,
                        ),
                        Text(dateToString(trip.startDate.toLocal(), weekday: false),
                            style: TextStyle(
                                color: Theme.of(context).primaryColor, fontSize: 13, letterSpacing: .3)),
                      ],
                    ),
                    SizedBox(
                      height: 6,
                    ),
                    Row(
                      children: <Widget>[
                        Icon(
                          Icons.calendar_today,
                          color: Theme.of(context).accentColor,
                          size: 20,
                        ),
                        SizedBox(
                          width: 5,
                        ),
                        Text(dateToString(trip.endDate.toLocal(), weekday: false),
                            style: TextStyle(
                                color: Theme.of(context).primaryColor, fontSize: 13, letterSpacing: .3)),
                      ],
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
      )
  );
}