# Plan de référencement Repérez

**Objectif :** que des commerçants tombent sur Repérez en cherchant sur Google, fassent le test gratuit, puis demandent un audit.

**À savoir :** un site neuf met en général **3 à 6 mois** à remonter sur Google. Les étapes 1 à 3 sont à faire **tout de suite**, car le temps joue pour toi. En attendant, les visites et Facebook restent les sources de clients les plus rapides.

---

## Étape 1 : le nom de domaine (cette semaine, 20 minutes) ⚠️ prioritaire

Aujourd'hui, le site s'appelle Repérez mais vit sur **encaissez.fr**. Pour Google, c'est un site de relance de factures qui change de sujet : c'est mauvais pour la confiance. Plus on change tôt, moins on perd.

1. Vérifie la marque « Repérez » sur **data.inpi.fr** (recherche gratuite, classes 35 et 42).
2. Achète **reperez.fr** chez OVH, comme encaissez.fr (encore libre le 25/11/2026).
3. Dans **Vercel**, projet du site, *Settings > Domains* :
   - ajoute `reperez.fr` et `www.reperez.fr`, puis suis les instructions DNS (comme pour encaissez.fr) ;
   - mets **reperez.fr en domaine principal** ;
   - règle **encaissez.fr → redirection 308 vers reperez.fr**. Ainsi, rien n'est perdu.
4. Dans *Settings > Environment Variables*, change `NEXT_PUBLIC_SITE_URL` en `https://reperez.fr`, puis **Redeploy**.
5. Dans le code, `lib/brand.ts` : change l'adresse de contact quand contact@reperez.fr existera (redirection e-mail OVH, comme pour Encaissez).

## Étape 2 : déclarer le site à Google et Bing (le même jour, 20 minutes)

- **Google Search Console** (search.google.com/search-console) :
  - ajoute une propriété « Domaine » pour `reperez.fr` (vérification par un enregistrement TXT chez OVH) ;
  - dans *Sitemaps*, envoie `https://reperez.fr/sitemap.xml` ;
  - dans *Inspection de l'URL*, demande l'indexation de l'accueil et de 3 ou 4 pages métiers.
- **Bing Webmaster Tools** (bing.com/webmasters) : choisis « Importer depuis Google Search Console », c'est en un clic. **Important**, car Bing est utilisé par plusieurs assistants IA.

## Étape 3 : activer la mesure d'audience (2 minutes)

Dans Vercel, projet du site, onglet **Analytics**, clique sur **Enable** (gratuit, sans cookies). Le code est déjà prêt. Tu verras chaque jour le nombre de visites, les pages vues et d'où viennent les gens.

## Étape 4 : la présence de Repérez lui-même (dès que l'entreprise est créée)

Il faut appliquer à Repérez ce que tu vends aux commerçants :
- **Google Business Profile** pour Repérez, en « entreprise de services sans adresse visible » (zone : France). Catégorie : « Consultant en marketing » ou « Service de marketing Internet ».
- **Pages Jaunes** (fiche gratuite), **page LinkedIn**, **page Facebook** : mêmes nom, adresse e-mail et site partout.
- **Les Pépites Tech** (annuaire des jeunes entreprises françaises : ton concurrent Happia y est).

## Étape 5 : des liens vers ton site (en continu)

Google fait confiance aux sites dont on parle ailleurs. Par ordre d'efficacité :
1. **Comeup et Malt** : crée une offre « Audit de visibilité ChatGPT et Google pour commerce » (par exemple 29 €) avec un lien vers le site. C'est aussi une **source de clients** : des concurrents y vendent déjà ce type d'audit.
2. **Les groupes Facebook** de commerçants et d'artisans : partage un guide utile (avis négatifs, Google Maps), jamais une pub brute.
3. **Les associations de commerçants et les mairies** : propose le test gratuit à leurs membres. Un lien depuis leur site vaut très cher.
4. **La presse locale** : « Un outil gratuit pour savoir si ChatGPT recommande votre commerce » est un sujet qui intéresse les journaux régionaux.

## Étape 6 : un nouveau guide par semaine (je les écris avec toi)

Il y a déjà 7 guides. Idées pour les suivants, toutes des questions que se posent les commerçants :
- Comment être recommandé par Google Gemini
- Instagram ou Facebook : quel réseau pour un commerce de proximité ?
- Que publier sur sa fiche Google chaque semaine (10 idées)
- Comment demander un avis sans être gênant (modèles de SMS)
- Mon commerce n'apparaît pas sur Google : 7 causes et solutions
- Changer ses horaires partout en même temps
- Faut-il payer Pages Jaunes ?
- Comment savoir d'où viennent ses clients

Et une **page métier de plus chaque semaine** : pharmacie, opticien, fromagerie, caviste, pressing, auto-école, kiné, ostéopathe, menuisier, couvreur…

## Ce qu'on surveille chaque semaine

| Chiffre | Où le voir | Pour savoir quoi |
|---|---|---|
| Visites | Vercel > Analytics | Si le référencement avance |
| Recherches et clics Google | Search Console > Performances | Sur quelles questions on apparaît |
| Tests lancés | Vercel > Analytics (visites des résultats) | Si le test attire |
| Demandes d'audit | E-mail + Supabase `reperez_leads` | Si le site rapporte |

**L'objectif des 3 premiers mois :** 10 demandes d'audit venues du site. En dessous, on change le message ou les pages. Au-dessus, on accélère.
