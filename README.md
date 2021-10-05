# Mockatrice

... is a CLI designed to transfer printing preferences from Moxfield to Cockatrice. The Moxfield API is not designed for public use and is prone to breaking changes. As such, relying on this tool is not recommended.

Installation:
```
deno install --allow-net --allow-read --allow-write --unstable https://deno.land/x/mockatrice/mockatrice.ts
```

Usage:
```
mockatrice -d [Deck ID]
```
Pulls selected printings from `https://moxfield.com/decks/[Deck ID]` and outputs them to `./img/[Deck ID]/*.png`.

```
mockatrice -d [Deck ID] -p [Output folder]
```
Pulls selected printings from `https://moxfield.com/decks/[Deck ID]` and outputs them to `[Output folder]/[Deck ID]/*.png`.