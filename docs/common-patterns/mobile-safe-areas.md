# Safe Areas

As an example, you can define your safe area insets as below in CSS:

```
:root {
  --sait: var(--discord-safe-area-inset-top, env(safe-area-inset-top));
  --saib: var(--discord-safe-area-inset-bottom, env(safe-area-inset-bottom));
  --sail: var(--discord-safe-area-inset-left, env(safe-area-inset-left));
  --sair: var(--discord-safe-area-inset-right, env(safe-area-inset-right));
}
```

This prefers the `--discord-safe-area-inset-*` variable and will fallback to the env values for iOS + any local dev testing that is done outside of Discord.

You can then reference these values:

```
body {
  padding-left: var(--sail);
  padding-right: var(--sair);
  padding-top: var(--sait);
  padding-bottom: var(--saib);
}
```
