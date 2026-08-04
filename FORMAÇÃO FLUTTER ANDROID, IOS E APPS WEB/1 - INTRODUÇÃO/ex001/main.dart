@override
    state<MyApp> createState() => _MyAppState();
    
    class _MyAppState extends State<MyApp> {
        @override
        Widget build(BuildContext context) {
            return MaterialApp(
            debugShowCheckedModeBanner: false,
            home: SafeArea(
                child: Scalffold(
                    AppBar(
                        backgroundColor: Colors.purple,
                    )
                )
            )
        );
    }
}