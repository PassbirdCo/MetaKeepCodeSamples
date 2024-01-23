import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:metakeep_flutter_sdk/metakeep_flutter_sdk.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MetaKeep Flutter SDK Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'MetaKeep Flutter SDK Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  // int _counter = 0;

  // Store the MetaKeep SDK app ID.
  String? _appId;

  // Holds the MetaKeep SDK instance.
  Metakeep? _sdk;

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // TRY THIS: Try changing the color here to a specific color (to
        // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
        // change color while the other colors stay the same.
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, it sizes itself to fit its
          // children horizontally, and tries to be as tall as its parent.
          //
          // Column has various properties to control how it sizes itself and
          // how it positions its children. Here we use mainAxisAlignment to
          // center the children vertically; the main axis here is the vertical
          // axis because Columns are vertical (the cross axis would be
          // horizontal).
          //
          // TRY THIS: Invoke "debug painting" (choose the "Toggle Debug Paint"
          // action in the IDE, or press "p" in the console), to see the
          // wireframe for each widget.
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // Text field for the MetaKeep SDK app ID.
            TextField(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'MetaKeep App ID',
                hintText: 'Enter MetaKeep App ID',
              ),
              onChanged: (text) {
                setState(() {
                  _appId = text;
                });
              },
            ),
            // Initialize the MetaKeep SDK button.
            ElevatedButton(
              onPressed: () {
                setState(() {
                  if (_appId == null || _appId!.isEmpty) {
                    showAlertDialog("Error", "App ID cannot be empty");
                    return;
                  }

                  _sdk = Metakeep(_appId!);

                  // You can provide an existing user here e.g.
                  // _sdk!.setUser({"email": "user_email@email.com"});
                });
              },
              child: const Text('Initialize MetaKeep SDK'),
            ),

            // MetaKeep SDK action buttons e.g. sign message, sign transaction.
            // These buttons should be disabled until the MetaKeep SDK is initialized.
            ElevatedButton(
              onPressed: () async => handleAction(() => _sdk!.getWallet()),
              child: const Text('Get Wallet'),
            ),
            ElevatedButton(
              onPressed: () async => handleAction(() => _sdk!.signMessage(
                  "Hello World", "sign sample message from Flutter")),
              child: const Text('Sign Message'),
            ),
            ElevatedButton(
              onPressed: () async => handleAction(() => _sdk!.signTransaction({
                    "type": 2,
                    "to": "0x97706df14a769e28ec897dac5ba7bcfa5aa9c444",
                    "value": "0x2710",
                    "nonce": "0x1",
                    "data": "0x0123456789",
                    "chainId": "0x13881",
                    "gas": "0x17",
                    "maxFeePerGas": "0x3e8",
                    "maxPriorityFeePerGas": "0x3e7"
                  }, "sign sample transaction from Flutter")),
              child: const Text('Sign Transaction'),
            ),
            ElevatedButton(
              onPressed: () async => handleAction(() => _sdk!.signTypedData({
                    "types": {
                      "EIP712Domain": [
                        {"name": "name", "type": "string"},
                        {"name": "version", "type": "string"},
                        {"name": "chainId", "type": "uint256"},
                        {"name": "verifyingContract", "type": "address"}
                      ],
                      "MetaTransaction": [
                        {"name": "nonce", "type": "uint256"},
                        {"name": "from", "type": "address"},
                        {"name": "functionSignature", "type": "bytes"}
                      ]
                    },
                    "primaryType": "MetaTransaction",
                    "domain": {
                      "name": "Ether Mail",
                      "version": "1",
                      "chainId": 1,
                      "verifyingContract":
                          "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
                    },
                    "message": {
                      "nonce": 200,
                      "from": "0x97706Df14A769E28EC897dAc5Ba7bCfa5AA9C444",
                      "functionSignature": "0xd1a1beb40000"
                    }
                  }, "sign sample transaction from Flutter")),
              child: const Text('Sign Typed Data'),
            ),
            ElevatedButton(
              onPressed: () async => handleAction(() => _sdk!.getConsent(
                    // Replace this with a valid consent token.
                    "Sample Invalid Token",
                  )),
              child: const Text('Get Consent'),
            )
          ],
        ),
      ),
    );
  }

  handleAction(
    actionFn,
  ) async {
    if (_sdk == null) {
      showAlertDialog("Error", "MetaKeep SDK is not initialized");
      return false;
    }

    try {
      var result = await actionFn();
      // Result should be a parsed JSON map.
      showAlertDialog(
          "Result", const JsonEncoder.withIndent(' ').convert(result));
    } on PlatformException catch (e) {
      // Exception details should be error JSON returned by the native platform
      // with `status` field containing the error status code.
      showAlertDialog(
          "Error", const JsonEncoder.withIndent(' ').convert(e.details));
    }
  }

  showAlertDialog(String title, String content) => showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(content),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Close'),
            ),
          ],
        );
      });
}
