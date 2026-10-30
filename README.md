# Kodicka – 15 Puzzle

Responzívna webová hra s číselnými dielikmi 1 až 15 na ploche 4 × 4.

## Lokálne spustenie

Spusť `python -m http.server 8000` v koreňovom priečinku a otvor `http://localhost:8000`.

## Ovládanie

- Klikni na číslo susediace s prázdnym políčkom.
- Šípky na klávesnici posúvajú prázdne miesto.
- **Nová hra** vytvorí nové náhodné, vždy riešiteľné rozloženie.
- **Reštartovať** vráti aktuálne rozloženie na začiatok.

Čas sa spustí prvým ťahom a zastaví sa po vyriešení.

## Testy

Vyžaduje Node.js 18 alebo novší. Spusť `npm test`.

Testy kontrolujú susednosť políčok, platnosť ťahov, zachovanie pôvodného stavu a riešiteľnosť náhodných rozložení.

## GitHub Pages

Po zlúčení do `main` môžeš publikovať hru cez **Settings → Pages → Build and deployment → Deploy from a branch** a vybrať `main` s priečinkom `/(root)`. Stránka sa následne bude zobrazovať na adrese `https://javorkahub.github.io/kodicka/`.

## Súbory

- `index.html` – štruktúra hry
- `styles.css` – responzívny dizajn
- `src/game.js` – herná logika
- `src/app.js` – ovládanie a vykreslenie
- `tests/game.test.js` – automatické testy
