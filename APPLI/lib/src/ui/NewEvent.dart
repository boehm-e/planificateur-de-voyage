import 'package:direct_select/direct_select.dart';
import 'package:flutter/material.dart';
import 'package:planificateur_voyage/src/Utils/Date.dart';
import 'package:flutter_cupertino_date_picker/flutter_cupertino_date_picker.dart';
import 'package:planificateur_voyage/src/Widgets/SearchPlace/SearchPlaceTextField.dart';
import 'package:planificateur_voyage/src/blocs/triplist_bloc.dart';
import 'package:planificateur_voyage/src/models/triplist_model.dart';
import 'package:toast/toast.dart';



class NewEvent extends StatefulWidget {
  final Trip trip;
  NewEvent({Key key, this.trip}) : super(key: key);
  _NewEventState createState() => _NewEventState();
}

const String MIN_DATETIME = '2010-05-12 00:00:00';
const String MAX_DATETIME = '2021-11-25 23:59:59';
const String INIT_DATETIME = '2019-05-17 08:30';


class _NewEventState extends State<NewEvent> {

  DateTimePickerLocale _locale = DateTimePickerLocale.fr;
  List<DateTimePickerLocale> _locales = DateTimePickerLocale.values;
  String _format_date = 'dd-MMMM-yyyy';
  String _format_time = 'HH:mm';
  TextEditingController _formatCtrl = TextEditingController();

  DateTime _startDateTime;
  DateTime _endDateTime;

  bool hasEnd = false;

  final _titleTextController = TextEditingController();

  final _formKey = GlobalKey<FormState>();




  @override
  void initState() {
    super.initState();
    _formatCtrl.text = _format_date;
    _startDateTime = DateTime.parse(INIT_DATETIME);
    _endDateTime = DateTime.parse(INIT_DATETIME);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    _formatCtrl.dispose();
    _titleTextController.dispose();
    super.dispose();
  }

  SearchPlaceTextField _searchPlaceTextFieldStart = new SearchPlaceTextField(
    key: Key("sptStart"),
    decoration: InputDecoration(
        hintText: "Rome"
    ),
  );

  SearchPlaceTextField _searchPlaceTextFieldEnd = new SearchPlaceTextField(
    key: Key("sptdEnd"),
    decoration: InputDecoration(
        hintText: "Rio de janeiro"
    ),
  );


  // direct select
  final elements1 = [
    {"title": "MARCHE", "icon": Icons.directions_walk},
    {"title": "BATEAU", "icon": Icons.directions_boat},
    {"title": "ARRET", "icon": Icons.place},
    {"title": "NOTE", "icon": Icons.note_add},
    {"title": "HOTEL", "icon": Icons.hotel},
    {"title": "TRAIN", "icon": Icons.train},
    {"title": "RESTAURANT", "icon": Icons.restaurant}
  ];
  int selectedIndex1 = 0;
  List<Widget> _buildItems1() {
    return elements1
        .map((val) => MySelectionItem(title: val["title"], icon: val["icon"],)).toList();
  }


  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        leading: IconButton(
          onPressed: (){
            Navigator.pop(context);
          },
          icon: Icon(Icons.arrow_back, color: Color(0xff828294),),
        ),
        elevation: 0.0,
      ),
      body: Form(
        key: _formKey,
        child: Container(
          child: Stack(
            children: <Widget>[
              SingleChildScrollView(
                child: Container(
                  margin: const EdgeInsets.only(left: 40.0, right: 40.0, bottom: 40.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Padding(
                        padding: const EdgeInsets.only(top: 40.0),
                        child: Text("Ajouter une étape", style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 40.0),
                        child: Text("TITRE", style: TextStyle(fontSize: 18),),
                      ),
                      TextFormField(
                        controller: _titleTextController,
                        validator: (value) {
                          if (value.isEmpty || value.length <= 3) {
                            return 'Le titre doit faire plus de 3 caracteres';
                          }
                          return null;
                        },
                        decoration: InputDecoration(
                            hintText: "Titre de l'étape"
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 40.0, bottom: 20),
                        child: Text("TYPE", style: TextStyle(fontSize: 18),),
                      ),

                      DirectSelect(
                          itemExtent: 48.0,
                          selectedIndex: selectedIndex1,
//                          child: MySelectionItem(
//                            isForList: false,
//                            title: elements1[selectedIndex1]["title"],
//                          ),
                          child: Container(
                            padding: EdgeInsets.only(top: 16, left: 16, bottom: 16),
                            decoration: BoxDecoration(
                              border: Border.all(
                                width: 1, //                   <--- border width here
                              ),
                            ),
                            width: MediaQuery.of(context).size.width,
                            alignment: Alignment.center,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: <Widget>[
                                Container(width: 50, child: Icon(elements1[selectedIndex1]["icon"])),
                                Container(width: 150 ,child: Text(elements1[selectedIndex1]["title"], style: TextStyle(fontWeight: FontWeight.w600, fontSize: 18),)),
                                Icon(Icons.keyboard_arrow_down)
                              ],
                            ),
                          ),
                          onSelectedItemChanged: (index) {
                            setState(() {
                              selectedIndex1 = index;
                            });
                          },
                          items: _buildItems1()
                      ),

                      Column(
                        children: <Widget>[
                          Container(
                            margin: const EdgeInsets.only(top: 40.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Container(
                                  child: Text("DEPART", style: TextStyle(fontSize: 18)),
                                ),
                                Row(
                                  children: <Widget>[
                                    InkWell(
                                      onTap: () {
                                        _showStartDatePicker();
                                      },
                                      child: Container(
                                        padding: EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          border: Border.all(
                                            width: 1, //                   <--- border width here
                                          ),
                                        ),
                                        margin: const EdgeInsets.only(top: 20.0),
                                        child: Text(
                                          dateToString(_startDateTime, weekday: false),
                                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                                        ),
                                      ),
                                    ),
                                    InkWell(
                                      onTap: () {
                                        _showStartTimePicker();
                                      },
                                      child: Container(
                                        padding: EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          border: Border.all(
                                            width: 1, //                   <--- border width here
                                          ),
                                        ),
                                        margin: const EdgeInsets.only(top: 20.0, left:10),
                                        child: Text(
                                          timeToString(_startDateTime),
                                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Padding(
                                  padding: const EdgeInsets.only(top: 20.0),
                                  child: Text("LIEU", style: TextStyle(fontSize: 18),),
                                ),
                                _searchPlaceTextFieldStart,

                              ],
                            ),
                          ),
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 40.0),
                        child: Row(
                          children: <Widget>[
                            Text("ARRIVEE", style: TextStyle(fontSize: 18),),

                            Switch(
                              value: hasEnd,
                              onChanged: (value) {
                                setState(() {
                                  hasEnd = value;
                                });
                              },
                              activeTrackColor: Theme.of(context).primaryColor,
                              activeColor: Theme.of(context).accentColor,
                            ),
                          ],
                        ),
                      ),
                      AbsorbPointer(
                        absorbing: !hasEnd,
                        child: new Opacity(
                          opacity: hasEnd ? 1 : 0.3,
                          child: Column(
                            children: <Widget>[
                              Container(
                                padding: const EdgeInsets.only(bottom: 100.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: <Widget>[
                                    Row(
                                      children: <Widget>[
                                        InkWell(
                                          onTap: () {
                                            _showEndDatePicker();
                                          },
                                          child: Container(
                                            padding: EdgeInsets.all(16),
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                width: 1, //                   <--- border width here
                                              ),
                                            ),
                                            margin: const EdgeInsets.only(top: 20.0),
                                            child: Text(
                                              dateToString(_endDateTime, weekday: false),
                                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                                            ),
                                          ),
                                        ),
                                        InkWell(
                                          onTap: () {
                                            _showEndTimePicker();
                                          },
                                          child: Container(
                                            padding: EdgeInsets.all(16),
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                width: 1, //                   <--- border width here
                                              ),
                                            ),
                                            margin: const EdgeInsets.only(top: 20.0, left:10),
                                            child: Text(
                                              timeToString(_endDateTime),
                                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.only(top: 20.0),
                                      child: Text("LIEU", style: TextStyle(fontSize: 18),),
                                    ),
                                    _searchPlaceTextFieldEnd,
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
//              Container(
//                width: double.infinity,
//                height: 60,
//                color: Colors.blue,
//              )
                    ],
                  ),
                ),
              ),
              Positioned(
                bottom: 0,
                left: 0,
                child: InkWell(
                  onTap: () async {
                    if (_formKey.currentState.validate() && _searchPlaceTextFieldStart.getLocation() != null) {
                      bool success = await trip_bloc.createEvent(
                        widget.trip.id,
                        elements1[selectedIndex1]["title"],
                        _titleTextController.text,
                        _startDateTime,
                        hasEnd ? _endDateTime : null,
                        _searchPlaceTextFieldStart.getLocation(),
                        hasEnd ? _searchPlaceTextFieldEnd.getLocation() : null,
                      );
                      if (success) {
                        Navigator.pop(context);
                      } else {
                        Toast.show("Erreur lors de la création du voyage.", context, duration: Toast.LENGTH_LONG, gravity: Toast.BOTTOM);
                      }
                    } else {
                      Toast.show("Veuillez verifier les informations.", context, duration: Toast.LENGTH_LONG, gravity: Toast.BOTTOM);
                    }
                  },
                  child: Container(
                    width: MediaQuery.of(context).size.width,
                    height: 80,
                    color: Color(0xff3374ff),
                    child: Center(
                        child: Text("Ajouter l'étape", style: TextStyle(color: Colors.white, fontSize: 16),)
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),

    );
  }
  void _showStartDatePicker() {
    DatePicker.showDatePicker(
      context,
      pickerTheme: DateTimePickerTheme(
        title: Container(padding: EdgeInsets.all(8), width: double.infinity, color: Colors.white ,child: Center(child: Text("Date du debut", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),))),
        titleHeight: 32,
      ),
      minDateTime: DateTime.parse(MIN_DATETIME),
      maxDateTime: DateTime.parse(MAX_DATETIME),
      initialDateTime: _startDateTime,
      dateFormat: _format_date,
      pickerMode: DateTimePickerMode.date,
      locale: _locale,
      onChange: (dateTime, List<int> index) {
        setState(() {
          int prevHour = _startDateTime.hour;
          int prevMin = _startDateTime.minute;
          _startDateTime = dateTime.add(Duration(hours: prevHour, minutes: prevMin));
        });
      },
      onConfirm: (dateTime, List<int> index) {
        print('------------------------');
        setState(() {
          _startDateTime = dateTime;
        });
      },
    );
  }

  void _showStartTimePicker() {
    DatePicker.showDatePicker(
      context,
      pickerTheme: DateTimePickerTheme(
        title: Container(padding: EdgeInsets.all(8), width: double.infinity, color: Colors.white ,child: Center(child: Text("Heure du debut", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),))),
        titleHeight: 32,
      ),
      minDateTime: DateTime.parse(MIN_DATETIME),
      maxDateTime: DateTime.parse(MAX_DATETIME),
      initialDateTime: _startDateTime,
      dateFormat: _format_time,
      pickerMode: DateTimePickerMode.time,
      locale: _locale,
      onChange: (dateTime, List<int> index) {
        setState(() {
          _startDateTime = new DateTime(_startDateTime.year, _startDateTime.month, _startDateTime.day, dateTime.hour, dateTime.minute,);
        });
      },
      onConfirm: (dateTime, List<int> index) {
        print('------------------------');
        setState(() {
          _startDateTime = dateTime;
        });
      },
    );
  }

  void _showEndDatePicker() {
    DatePicker.showDatePicker(
      context,
      pickerTheme: DateTimePickerTheme(
        title: Container(padding: EdgeInsets.all(8), width: double.infinity, color: Colors.white ,child: Center(child: Text("Date de fin", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),))),
        titleHeight: 32,
      ),
      minDateTime: DateTime.parse(MIN_DATETIME),
      maxDateTime: DateTime.parse(MAX_DATETIME),
      initialDateTime: _endDateTime,
      dateFormat: _format_date,
      locale: _locale,
      onChange: (dateTime, List<int> index) {
        setState(() {
          int prevHour = _endDateTime.hour;
          int prevMin = _endDateTime.minute;
          _endDateTime = dateTime.add(Duration(hours: prevHour, minutes: prevMin));
        });
      },
      onConfirm: (dateTime, List<int> index) {
        setState(() {
          _endDateTime = dateTime;
        });
      },
    );
  }

  void _showEndTimePicker() {
    DatePicker.showDatePicker(
      context,
      pickerTheme: DateTimePickerTheme(
        title: Container(padding: EdgeInsets.all(8), width: double.infinity, color: Colors.white ,child: Center(child: Text("Heure du finz", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),))),
        titleHeight: 32,
      ),
      minDateTime: DateTime.parse(MIN_DATETIME),
      maxDateTime: DateTime.parse(MAX_DATETIME),
      initialDateTime: _endDateTime,
      dateFormat: _format_time,
      pickerMode: DateTimePickerMode.time,
      locale: _locale,
      onChange: (dateTime, List<int> index) {
        setState(() {
          _endDateTime = new DateTime(_endDateTime.year, _endDateTime.month, _endDateTime.day, dateTime.hour, dateTime.minute,);
        });
      },
      onConfirm: (dateTime, List<int> index) {
        print('------------------------');
        setState(() {
          _endDateTime = dateTime;
        });
      },
    );
  }
}



//You can use any Widget
class MySelectionItem extends StatelessWidget {
  final String title;
  final IconData icon;
  final bool isForList;

  const MySelectionItem({Key key, this.title, this.isForList = true, this.icon})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48.0,
      child: isForList
          ? Padding(
        child: _buildItem(context),
        padding: EdgeInsets.all(0.0),
      )
          : Container(
        decoration: BoxDecoration(
          border: Border.all(
            width: 1, //                   <--- border width here
          ),
        ),
        child: Stack(
          children: <Widget>[
            _buildItem(context),
            Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: Align(
                alignment: Alignment.centerRight,
                child: Icon(Icons.keyboard_arrow_down),
              ),
            )
          ],
        ),
      ),
    );
  }

  _buildItem(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      alignment: Alignment.center,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: <Widget>[
          Container(width: 50, child: Icon(icon)),
          Container(width: 200 ,child: Text(title, style: TextStyle(fontWeight: FontWeight.w600, fontSize: 18),)),
        ],
      ),
    );
  }
}