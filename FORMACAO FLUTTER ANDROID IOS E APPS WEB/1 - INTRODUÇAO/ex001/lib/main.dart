import 'package:flutter/material.dart';

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            title: Text('Exemplo de AppBar'),
            backgroundColor: Colors.purple,
          ),
          
          floatingActionButton: FloatingActionButton(
            onPressed: () {},
            backgroundColor: Colors.purple,
            child: Icon(Icons.add, size: 30,
            ) 
          ),
        ),
      ),
    );
  }
}