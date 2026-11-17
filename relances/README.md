# Relances

SaaS de relance automatique des factures impayées pour artisans et TPE.

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:3000
```

Node 22 ou plus est requis (la base SQLite utilise `node:sqlite`, intégré à Node).

## Fonctionnement

- On ajoute ses factures : numéro, client, e-mail, montant, échéance.
- Les relances partent automatiquement à J+1 (rappel amical), J+7 (relance ferme) et J+15 (dernier avis).
- Chaque étape n'est envoyée qu'une seule fois. Une facture marquée « payée » n'est plus relancée.
- `GET /api/cron` envoie les relances dues. Il faut l'appeler une fois par jour.

## Variables d'environnement (`.env.local`)

| Variable | Rôle |
|---|---|
| `RESEND_API_KEY` | Clé [Resend](https://resend.com) pour envoyer les e-mails. Sans elle, les e-mails s'affichent dans la console. |
| `EMAIL_FROM` | Expéditeur, ex. `Relances <factures@mondomaine.fr>` |
| `CRON_SECRET` | Protège `/api/cron` (`Authorization: Bearer …`) |

## Feuille de route

- [x] MVP : factures, scénario de relance, tableau de bord
- [ ] Comptes utilisateurs (multi-clients) — Supabase Auth
- [ ] Base Postgres (Supabase) au lieu de SQLite
- [ ] Abonnement Stripe (essai gratuit 14 j)
- [ ] Import CSV / connexion aux logiciels de facturation
- [ ] Page d'accueil commerciale
- [ ] Mise en ligne (Vercel + cron quotidien)
