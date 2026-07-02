# IoT-Based Maintenance Monitoring Dashboard for Production Lines

A responsive Angular 17 dashboard that transforms the maintenance planning workbook into a clean, read-only web interface for KTR production lines.

## Current scope

- Annual maintenance tracking with **Terminé**, **Ce mois**, and **Bientôt** statuses
- Complete weekly plan from **SW1 to SW52**
- KPI reporting by production line
- Preventive and corrective maintenance reference tables
- Corrective-intervention history and statistics
- Equipment responsibility and innovation-service inventories
- Spare-parts inventory with quantity totals
- Search, filters, responsive tables, and SVG charts

The application is intentionally read-only. It does not yet include a backend, database, authentication, MQTT, IoT connectivity, CRUD operations, or real-time updates.

## Architecture

- `src/app/models/` — typed domain interfaces
- `src/app/data/maintenance-data.generated.ts` — generated Excel snapshot
- `src/app/services/maintenance-data.service.ts` — read-only data-access boundary
- `src/app/pages/` — standalone Angular dashboard pages
- `src/app/shared/` — reusable charts and display utilities

The service boundary is designed so the generated data source can later be replaced by an API without rewriting the dashboard components.

## Development

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Production build

```bash
npm run build
```

## Source data

The dashboard data was extracted from `plan de maintenance.xlsm`. To refresh the dashboard after workbook changes, regenerate `maintenance-data.generated.ts` and rebuild the application.
