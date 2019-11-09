import 'package:flutter/material.dart';
import 'package:planificateur_voyage/src/Utils/Date.dart';
import 'package:flutter_cupertino_date_picker/flutter_cupertino_date_picker.dart';
import 'package:planificateur_voyage/src/blocs/triplist_bloc.dart';
import 'package:toast/toast.dart';



class NewTrip extends StatefulWidget {
  NewTrip({Key key}) : super(key: key);
  _NewTripState createState() => _NewTripState();
}

const String MIN_DATETIME = '2010-05-12';
const String MAX_DATETIME = '2021-11-25';
const String INIT_DATETIME = '2019-05-17';


class _NewTripState extends State<NewTrip> {

  DateTimePickerLocale _locale = DateTimePickerLocale.fr;
  List<DateTimePickerLocale> _locales = DateTimePickerLocale.values;
  String _format = 'dd-MMMM-yyyy';
  TextEditingController _formatCtrl = TextEditingController();

  DateTime _startDateTime;
  DateTime _endDateTime;

  final _titleTextController = TextEditingController();
  final _descriptionTextController = TextEditingController();

  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _formatCtrl.text = _format;
    _startDateTime = DateTime.parse(INIT_DATETIME);
    _endDateTime = DateTime.parse(INIT_DATETIME);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    _formatCtrl.dispose();
    _titleTextController.dispose();
    _descriptionTextController.dispose();
    super.dispose();
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
                        child: Text("Créer un voyage", style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),),
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
                            hintText: "Mon voyage en Grèce"
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 40.0),
                        child: Text("DESCRIPTION", style: TextStyle(fontSize: 18),),
                      ),
                      TextFormField(
                        controller: _descriptionTextController,
                        validator: (value) {
                          if (value.isEmpty || value.length <= 3) {
                            return 'La description doit faire plus de 3 caracteres';
                          }
                          return null;
                        },
                        decoration: InputDecoration(
                            hintText: "Un super voyage de deux semaine !"
                        ),
                      ),
                      Column(
                        children: <Widget>[
                          Container(
                            margin: const EdgeInsets.only(top: 40.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Container(
                                  child: Text("DATE DE DEBUT", style: TextStyle(fontSize: 18)),
                                ),
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
                                      style: Theme.of(context).textTheme.title,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      Column(
                        children: <Widget>[
                          Container(
                            margin: const EdgeInsets.only(top: 40.0),
                            padding: const EdgeInsets.only(bottom: 100.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                Container(
                                  child: Text("DATE DE FIN", style: TextStyle(fontSize: 18)),
                                ),
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
                                      style: Theme.of(context).textTheme.title,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
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
                    if (_formKey.currentState.validate()) {
                      bool success = await trip_bloc.createTrip(
                          _titleTextController.text,
                          _descriptionTextController.text, _startDateTime,
                          _endDateTime);
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
                        child: Text("Créer le voyage", style: TextStyle(color: Colors.white, fontSize: 16),)
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
      minDateTime: DateTime.parse(MIN_DATETIME),
      maxDateTime: DateTime.parse(MAX_DATETIME),
      initialDateTime: _startDateTime,
      dateFormat: _format,
      locale: _locale,
      onChange: (dateTime, List<int> index) {
        setState(() {
          _startDateTime = dateTime;
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
        showTitle: true,
//        confirm: Text('Fermer', style: TextStyle(color: Colors.red)),
//        cancel: Text('Valider', style: TextStyle(color: Colors.cyan)),
      ),
      minDateTime: DateTime.parse(MIN_DATETIME),
      maxDateTime: DateTime.parse(MAX_DATETIME),
      initialDateTime: _endDateTime,
      dateFormat: _format,
      locale: _locale,
      onChange: (dateTime, List<int> index) {
        setState(() {
          _endDateTime = dateTime;
        });
      },
      onConfirm: (dateTime, List<int> index) {
        setState(() {
          _endDateTime = dateTime;
        });
      },
    );
  }
}