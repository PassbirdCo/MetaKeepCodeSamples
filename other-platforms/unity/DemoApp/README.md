# MetaKeep Unity Integration

This is a sample project that demonstrates how to use MetaKeep in Unity.

_Note that the MetaKeep Unity SDK is still under development and is not yet ready for production use._

For more information, please visit official MetaKeep documentation at https://docs.metakeep.xyz.

## Running the demo app

1. Clone this repository.
2. Open the `DemoApp` folder in Unity.
3. Choose scene `Assets/VegetationSpawner/_Demo/VegetationSpawnerExample.unity`.
4. Make sure the platform is set to `iOS` in `File > Build Settings...`.
5. Then click `File > Build And Run` to build and run the app on your iOS simulator.
6. XCode sometimes tries to run the app in `x86_64` simulator on `Apple Silicon` Macs. If this happens, enable the `Rosetta` option for simulator in XCode at `Product > Destination > Destination Architectures > Show Both`.
7. Now you should be able to run `x86_64` iOS simulator on `Apple Silicon` Macs and the app should run in the simulator.
