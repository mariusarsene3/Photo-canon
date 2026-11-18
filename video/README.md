# Vidéos promotionnelles Encaissez

Vidéos en motion design générées par le code avec [Remotion](https://www.remotion.dev).

- `src/Promo.tsx` : vidéo verticale de 20 s (TikTok, Reels, Shorts), 1080×1920
- `out/encaissez-promo-vertical.mp4` : rendu vertical (`npm run render`)
- `out/encaissez-promo-horizontal.mp4` : rendu horizontal 1920×1080 pour le site et YouTube (`npm run render:wide`)
- Version web allégée (1280 px, sans son) : `relances/public/encaissez-demo.mp4`

## Refaire le rendu
```bash
npm install
npm run studio   # aperçu interactif dans le navigateur
npm run render   # génère out/encaissez-promo-vertical.mp4
```

Licence Remotion : gratuite pour les particuliers et les entreprises de 3 personnes maximum.
