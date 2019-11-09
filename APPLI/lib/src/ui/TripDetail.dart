import 'dart:ffi';
import 'package:flutter/material.dart';
import 'package:planificateur_voyage/src/ui/NewEvent.dart';
import 'package:sticky_header_list/sticky_header_list.dart';
import 'dart:math';
import '../Utils/Date.dart';
import '../Widgets/FabCircularMenu.dart';
import 'package:planificateur_voyage/src/models/triplist_model.dart';


class TripDetailView extends StatefulWidget {
  final Trip trip;
  TripDetailView({Key key, @required this.trip}) : super(key: key);
  _TripDetailViewState createState() => _TripDetailViewState();
}

class _TripDetailViewState extends State<TripDetailView> {

  List<StickyListRow> _rows = new List<StickyListRow>();


  Future<Void> build_list() async {
    print("==========================");
    print(widget.trip);
    List<StickyListRow> rows = new List<StickyListRow>();

    for(int i=0; i<widget.trip.events.length; i++) {
      Event event = widget.trip.events[i];
      if (i==0 || event.start_date.difference(widget.trip.events[i-1].start_date) > Duration(days: 0)) {
        rows.add(new HeaderRow(child: build_header(dateToString(widget.trip.events[i].start_date))),);
      }
      rows.add(new RegularRow(child: buildTripEvents(event)));
    }
    setState(() {
      _rows = rows;
    });
    print(_rows);
  }

  @override
  void initState() {
    build_list();
    super.initState();
    WidgetsBinding.instance
        .addPostFrameCallback((_) => build_list());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xfff0f0f0),
      appBar: AppBar(
        backgroundColor: Theme.of(context).primaryColor,
        centerTitle: true,
        title: Text(
          widget.trip.name,
          style: TextStyle(color: Colors.white, fontSize: 24),
        ),
        leading: IconButton(
          onPressed: (){
            Navigator.pop(context);
          },
          icon: Icon(Icons.arrow_back,),
        ),
        elevation: 0.0,
      ),

      body: SingleChildScrollView(
        child: Stack(
          children: <Widget>[
            Container(
                padding: EdgeInsets.only(top: 20,),
                height: MediaQuery.of(context).size.height - 80,
                width: double.infinity,
                child: new StickyList(
                  children: _rows,
                )
            ),
            new Positioned(
                bottom: 16,
                right: 16,
                child: new FloatingActionButton(
                    child: Icon(Icons.add, color: Theme.of(context).primaryColor,),
                    onPressed: () {
                      Navigator.push(context, new MaterialPageRoute(builder: (context) => NewEvent(trip: widget.trip,)));
                    }
                )
            )

          ],

        ),
      ),
    );
  }


  Widget buildIcon(String type) {
    switch (type) {
      case "MARCHE":
        return Icon(Icons.directions_walk, color: Theme.of(context).primaryColor, size: 25,);
      case "BATEAU":
        return Icon(Icons.directions_boat, color: Theme.of(context).primaryColor, size: 25,);
      case "ARRET":
        return Icon(Icons.location_on, color: Theme.of(context).primaryColor, size: 25,);
      case "NOTE":
        return Icon(Icons.event_note, color: Theme.of(context).primaryColor, size: 25,);
      case "RESTAURANT":
        return Icon(Icons.restaurant, color: Theme.of(context).primaryColor, size: 25,);
      case "TRAIN":
        return Icon(Icons.train, color: Theme.of(context).primaryColor, size: 25,);
      case "HOTEL":
        return Icon(Icons.hotel, color: Theme.of(context).primaryColor, size: 25,);
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


  Widget build_header(String dateStr) {
    return Container(
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
                padding: const EdgeInsets.only(left: 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: <Widget>[
                    Container(
                      width: 2,
                      height: 50,
                      color: Theme.of(context).accentColor,
                      margin: EdgeInsets.only(left: 13),
                    ),
                  ],
                ),
              ),
              Expanded(
                  child: Container(
                      decoration: BoxDecoration(
                          color: Colors.white,
                          border: new Border(
                              bottom: BorderSide(
                                  color: Theme.of(context).accentColor,
                                  width: 2
                              )
                          )
                      ),
                      child: Center(child: Text(dateStr.toUpperCase(), style: TextStyle(color: Theme.of(context).accentColor, fontSize: 14, fontWeight: FontWeight.bold),)))
              )
            ]
        )
    );
  }


  Widget buildTripEvents(Event event) {

    return Column(
        children: <Widget>[
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
                          Text(timeToString(event.start_date),
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
                          child: buildIcon(event.type),
                        ),
                        Container(
                          width: 2,
                          height: 110.0-30-8,
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
                              event.name,
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
                                  Icons.edit,
                                  color: Theme.of(context).accentColor,
                                  size: 20,
                                ),
                                SizedBox(
                                  width: 5,
                                ),
                                Text("editer",
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