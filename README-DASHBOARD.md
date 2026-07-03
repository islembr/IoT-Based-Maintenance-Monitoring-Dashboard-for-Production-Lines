# Tableau de bord Maintenance KTR — Angular 17

Dashboard en lecture seule alimenté dynamiquement par `plan de maintenance.xlsm`.

## Architecture

- `src/app/models/maintenance.models.ts` : interfaces métier typées.
- `server/` : API Express et lecture du classeur avec `xlsx` à chaque requête.
- `src/app/services/maintenance-data.service.ts` : façade HTTP unique pour les composants.
- `src/app/pages/` : vues standalone, filtres et tableaux.
- `src/app/shared/` : graphiques SVG et utilitaires d'affichage.

Le backend est strictement en lecture seule : aucun CRUD, base de données, authentification ou temps réel n'est implémenté.

## Lancer l'application

Placer le classeur dans `data/` ou définir `EXCEL_PATH`, puis lancer :

```bash
npm install
npm run dev
```

## Corrections intégrées

- statuts normalisés : Terminé, Ce mois, Bientôt ;
- plan complet SW1 à SW52 ;
- total des pièces basé sur la quantité ;
- noms de machines, sites et casse normalisés ;
- codes AC8 à AC20 signalés comme non documentés ;
- comptages d'interventions recalculés depuis le registre.
