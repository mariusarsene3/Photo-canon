# Encaissez

SaaS de relance automatique des factures impayées pour artisans et TPE.

## Installation

1. Crée un projet sur [supabase.com](https://supabase.com) (région Europe).
2. Dans Supabase > **SQL Editor**, colle le contenu de `supabase/schema.sql` et clique sur **Run**.
3. Copie `.env.example` vers `.env.local` et remplis les clés (Supabase > Project Settings > API).
4. Lance l'app :

```bash
npm install
npm run dev        # http://localhost:3000
```

## Mise en ligne (Vercel)

1. Sur vercel.com : **Add New → Project**, importer le dépôt, **Root Directory = `relances`**.
2. Ajouter les variables d'environnement (voir tableau plus bas), dont `CRON_SECRET` : Vercel l'envoie automatiquement au cron.
3. Le cron défini dans `vercel.json` appelle `/api/cron` chaque jour vers 8 h (heure de Paris).
4. Dans Supabase > Authentication > URL Configuration, mettre l'adresse Vercel dans **Site URL**.

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
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Projet Supabase (publiques) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé secrète, utilisée seulement par le cron |
| `CRON_SECRET` | Obligatoire : protège `/api/cron` (`Authorization: Bearer …`) |

## Feuille de route

- [x] MVP : factures, scénario de relance, tableau de bord
- [x] Comptes utilisateurs (multi-clients) — Supabase Auth
- [x] Base Postgres (Supabase) avec sécurité par utilisateur (RLS)
- [ ] Abonnement Stripe (essai gratuit 14 j)
- [ ] Import CSV / connexion aux logiciels de facturation
- [ ] Page d'accueil commerciale
- [ ] Mise en ligne (Vercel + cron quotidien)
