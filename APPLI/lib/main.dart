import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'package:flutter_custom_clippers/flutter_custom_clippers.dart';
import 'src/ui/MyTravels.dart';

final primary = Color(0xff696b9e);
final secondary = Color(0xfff29a94);

void main() => runApp(

    MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Title',
      theme: new ThemeData(
        primaryColor: primary,
        accentColor: secondary,
      ),
      home: MyTrips(),
    )
);
