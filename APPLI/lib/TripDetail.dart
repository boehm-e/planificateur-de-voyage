import 'package:flutter/material.dart';
import 'dart:math';
import 'Utils/Date.dart';
import 'Widgets/FabCircularMenu.dart';
import 'Data/Trip.dart';

class TripDetailView extends StatefulWidget {
  final Trip trip;
  TripDetailView({Key key, @required this.trip}) : super(key: key);
  _TripDetailViewState createState() => _TripDetailViewState();
}

class _TripDetailViewState extends State<TripDetailView> {

  @override
  Widget build(BuildContext context) {
    final double statusBarHeight = MediaQuery.of(context).padding.top;
    return Scaffold(
      backgroundColor: Color(0xfff0f0f0),
      body: SingleChildScrollView(
        child: InkWell(
          onTap: () {
            print("DEBUG ERWAN : ");
          },
          child: Stack(
            children: <Widget>[
              Container(
                  color: Theme.of(context).primaryColor,
                  child: SafeArea(
                    child: Container(
                      height: 50,
                      width: double.infinity,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 30),
                        child: Center(
                          child: Text(
                            widget.trip.name,
                            style: TextStyle(color: Colors.white, fontSize: 24),
                          ),
                        ),
                      ),
                    ),
                  )
              ),
              Container(
                padding: EdgeInsets.only(top: 80),
                height: MediaQuery.of(context).size.height,
                width: double.infinity,
                child: ListView.builder(
                  itemCount: widget.trip.events.length,
                  itemBuilder: buildTripEvents,
                ),
              ),
              new Positioned(
                bottom: 0.0,
                right: 0.0,
                child: new FabCircularMenu(
                  child: Container(
                    width: MediaQuery.of(context).size.width,
                    height: MediaQuery.of(context).size.width,
                  ),
                  ringColor: Theme.of(context).accentColor,
                  fabColor: Theme.of(context).primaryColor,
                  ringWidth: 80,
                  fabOpenIcon: Icon(Icons.add, color: Theme.of(context).accentColor,),
                  fabCloseIcon: Icon(Icons.close, color: Theme.of(context).accentColor,),
                  options: <Widget>[
                    IconButton(icon: Icon(Icons.airplanemode_active), onPressed: () {print("new airplane");}, iconSize: 32.0, color: Colors.white),
                    IconButton(icon: Icon(Icons.directions_walk), onPressed: () {print("new directions_walk");}, iconSize: 32.0, color: Colors.white),
                    IconButton(icon: Icon(Icons.directions_boat), onPressed: () {print("new directions_boat");}, iconSize: 32.0, color: Colors.white),
                    IconButton(icon: Icon(Icons.place), onPressed: () {print("new place");}, iconSize: 32.0, color: Colors.white),
                    IconButton(icon: Icon(Icons.note_add), onPressed: () {print("new note_add");}, iconSize: 32.0, color: Colors.white),
                    IconButton(icon: Icon(Icons.hotel), onPressed: () {print("new hotel");}, iconSize: 32.0, color: Colors.white),
                    IconButton(icon: Icon(Icons.train), onPressed: () {print("new train");}, iconSize: 32.0, color: Colors.white),
                    IconButton(icon: Icon(Icons.restaurant), onPressed: () {print("new restaurant");}, iconSize: 32.0, color: Colors.white),
                  ],
                ),
              )

            ],

          ),
        ),
      ),
    );
  }


  Widget flip(double angle, Widget icon) {
    return Transform.rotate(angle: angle, child: icon,);
  }

  Widget buildIcon(String type) {
    switch (type) {
      case "plane_start":
        return flip(pi/4, Icon(Icons.airplanemode_active, color: Theme.of(context).primaryColor, size: 25,));
      case "plane_end":
        return flip(3*pi/4, Icon(Icons.airplanemode_active, color: Theme.of(context).primaryColor, size: 25,));
      case "boat_start":
      case "boat_end":
        return Icon(Icons.directions_boat, color: Theme.of(context).primaryColor, size: 25,);
      case "camping_start":
      case "camping_end":
        return Icon(Icons.hotel, color: Theme.of(context).primaryColor, size: 25,);
      case "hotel_start":
      case "hotel_end":
        return Icon(Icons.home, color: Theme.of(context).primaryColor, size: 25,);
    }
  }

  Border card_borders = new Border(
    top: BorderSide(
        color: Colors.black12,
        width: 1.0
    ),
    left:  BorderSide(
        color: Colors.black12,
        width: 1.0
    ),
    right:  BorderSide(
        color: Colors.black12,
        width: 1.0
    ),
  );



  Widget buildTripEvents(BuildContext ctxt, int index) {

    Widget day = SizedBox.shrink();
    if (index == 0 || widget.trip.events[index].date.difference(widget.trip.events[index-1].date) > Duration(days: 1)) {
      day = Container(
          width: double.infinity,
          height: 50,
          decoration: BoxDecoration(
            color: Colors.white,
          ),
          margin: EdgeInsets.symmetric(horizontal: 20),
          child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Container(
                  width: 50,
                  margin: EdgeInsets.only(left: 15, right: 15, top: 15),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 13),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: <Widget>[
                      Container(
                        width: 2,
                        height: 50,
                        color: Theme.of(context).accentColor,
                        margin: EdgeInsets.only(right: 15),
                      ),
                    ],
                  ),
                ),
                Expanded(
                    child: Center(child: Text(dateToString(widget.trip.events[index].date).toUpperCase(), style: TextStyle(color: Theme.of(context).accentColor, fontSize: 16, fontWeight: FontWeight.bold),))
                )
              ]
          )
      );
    }
    return Column(
        children: <Widget>[
          day,

          GestureDetector(
              onTap: () {
//          Navigator.push(context, MaterialPageRoute(builder: (context) => new TripDetailView(trip: trip,)),);
              },
              child: Container(
                decoration: BoxDecoration(
                    color: Colors.white,
                ),
                width: double.infinity,
                height: 110,
                margin: EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Container(
                      width: 50,
                      height: 110,
                      margin: EdgeInsets.only(left: 15, right: 15, top: 15),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: <Widget>[
                          Text(timeToString(widget.trip.events[index].date),
                              style: TextStyle(
                                  color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: .3)),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: <Widget>[
                        Container(
                          width: 2,
                          height: 8,
                          color: Theme.of(context).accentColor,
                          margin: EdgeInsets.only(right: 15),
                        ),
                        Container(
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(30),
                              color: Theme.of(context).accentColor
                          ),
                          width: 30,
                          height: 30,
//                    color: Colors.red,
                          child: buildIcon(widget.trip.events[index].type),
                        ),
                        Container(
                          width: 2,
                          height: 72,
                          color: Theme.of(context).accentColor,
                          margin: EdgeInsets.only(right: 15),
                        ),
                      ],
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text(
                              widget.trip.events[index].name,
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
                                  Icons.date_range,
                                  color: Theme.of(context).accentColor,
                                  size: 20,
                                ),
                                SizedBox(
                                  width: 5,
                                ),
                                Text(dateToString(widget.trip.events[index].date),
                                    style: TextStyle(
                                        color: Theme.of(context).primaryColor, fontSize: 13, letterSpacing: .3)),
                              ],
                            ),
                            SizedBox(
                              height: 6,
                            ),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              )
          ),
        ]
    );
  }


}