# Mockatrice

... is a CLI designed to transfer printing preferences from Moxfield to Cockatrice.

Installation:

```
deno install --allow-net --allow-read --allow-write https://deno.land/x/mockatrice/mockatrice.ts
```

Usage:

```
mockatrice
```

Displays help and options.

```
mockatrice [id]
```

Pulls selected printings from `https://moxfield.com/decks/[id]` and outputs them to `./img/`.
