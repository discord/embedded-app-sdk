# Application Layout Mode

There are three layout modes that an application can be in: focused, picture-in-picture (PIP), or grid mode. Activities can subscribe to the layout mode to determine when to optionally change their layouts to optimize for each layout mode. Old Discord clients only support the `ACTIVITY_PIP_MODE_UPDATE` event, while new Discord clients support both `ACTIVITY_PIP_MODE_UPDATE` and `ACTIVITY_LAYOUT_MODE_UPDATE`. Use `subscribeToLayoutModeUpdatesCompat` and `unsubscribeFromLayoutModeUpdatesCompat` to subscribe to both events with backward compatibility for old Discord clients that only support `ACTIVITY_PIP_MODE_UPDATE`. Here's an example using React:

```javascript
export default function LayoutMode() {
  const handleLayoutModeUpdate = React.useCallback((update: {layout_mode: number}) => {
       ...
  }, []);

  React.useEffect(() => {
    discordSdk.subscribeToLayoutModeUpdatesCompat(handleLayoutModeUpdate);
    return () => {
      discordSdk.unsubscribeFromLayoutModeUpdatesCompat(handleLayoutModeUpdate);
    };
  }, [handleLayoutModeUpdate]);
}
```
