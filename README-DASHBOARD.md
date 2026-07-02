# Tableau de bord Maintenance KTR — Angular 17

Dashboard en lecture seule généré depuis `plan de maintenance.xlsm`.

## Architecture

- `src/app/models/maintenance.models.ts` : interfaces métier typées.
- `src/app/data/maintenance-data.generated.ts` : instantané généré depuis Excel.
- `src/app/services/maintenance-data.service.ts` : façade de données unique pour les composants.
- `src/app/pages/` : vues standalone, filtres et tableaux.
- `src/app/shared/` : graphiques SVG et utilitaires d'affichage.

Le service constitue la frontière d'accès aux données. Une future API pourra remplacer sa source sans réécrire les composants. Aucun backend, CRUD, authentification ou temps réel n'est implémenté.

## Régénérer les données

Relancer le script d'extraction du classeur afin de reconstruire `maintenance-data.generated.ts`, puis vérifier avec :

```bash
npm run build
npm start
```

## Corrections intégrées

- statuts normalisés : Terminé, Ce mois, Bientôt ;
- plan complet SW1 à SW52 ;
- total des pièces basé sur la quantité ;
- noms de machines, sites et casse normalisés ;
- codes AC8 à AC20 signalés comme non documentés ;
- comptages d'interventions recalculés depuis le registre.
