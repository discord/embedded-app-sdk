# Thermal States

Activities may want to respond to thermal state changes using recommendations from https://developer.apple.com/library/archive/documentation/Performance/Conceptual/power_efficiency_guidelines_osx/RespondToThermalStateChanges.html to improve the user experience.

Discord's embedded-app-sdk provides an abstraction over [Apple's thermal state APIs](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/power_efficiency_guidelines_osx/RespondToThermalStateChanges.html]) and [Android's thermal state APIs](https://source.android.com/docs/core/power/thermal-mitigation#thermal-api).

Here's how Discord's abstraction maps to Apple's thermal states and Android's thermal states.

```javascript
enum ThermalState {
  NOMINAL = 0, // maps to "nominal" on iOS and "none" on Android
  FAIR = 1, // maps to "fair" on iOS and "light" / "moderate" on Android
  SERIOUS = 2, // maps to "serious" on iOS and "severe" on Android
  CRITICAL = 3, // maps to "critical" on iOS and "critical" / "emergency" / "shutdown" on Android
}
```

Activities can subscribe to thermal states like this:

```javascript
const handleThermalStateUpdate = (update: {thermal_state: number}) => {
  switch (thermalState) {
      case Common.ThermalStateTypeObject.NOMINAL:
        ...
      case Common.ThermalStateTypeObject.FAIR:
        ...
      case Common.ThermalStateTypeObject.SERIOUS:
        ...
      case Common.ThermalStateTypeObject.CRITICAL:
        ...
      default:
        ...
    }
}

discordSdk.subscribe('THERMAL_STATE_UPDATE', handleThermalStateUpdate);
```

Discord will publish the current thermal state upon event subscription, and it'll also publish any thermal state changes that happen afterward. Note that on Android devices, the thermal state updates will only be available on Android 10 and higher.
