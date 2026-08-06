import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Meu portfólio',
      home: PaginaInicial(),
    );
  }
}

class PaginaInicial extends StatelessWidget {
  const PaginaInicial({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.purple,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: const [
              BarraDeNavegacao(),
              Apresentacao(),
              SobreMim(),
              Experiencia(),
            ],
          ),
        ),
      ),
    );
  }
}