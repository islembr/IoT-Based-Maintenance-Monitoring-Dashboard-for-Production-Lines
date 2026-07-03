# IoT-Based Maintenance Monitoring Dashboard for Production Lines

A responsive Angular 17 + Express dashboard that reads the maintenance workbook at runtime and exposes it as a clean, read-only web interface for KTR production lines.

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
- `server/` — Express API and runtime `xlsx` workbook parser
- `src/app/services/maintenance-data.service.ts` — Angular `HttpClient` API facade
- `src/app/pages/` — standalone Angular dashboard pages
- `src/app/shared/` — reusable charts and display utilities

Every API request reopens the workbook. The dashboard Refresh button calls all endpoints again, so saved Excel changes appear without rebuilding Angular.

## Development

Place `plan de maintenance.xlsm` in `data/` (the workbook is intentionally ignored by Git), then run:

```bash
npm install
npm run dev
```

Open `http://localhost:4200`.

To keep the workbook elsewhere, set `EXCEL_PATH` before starting the server:

```powershell
$env:EXCEL_PATH='D:\Downloads\plan de maintenance.xlsm'
npm run dev
```

## Production build

```bash
npm run build
```

## Source data

The Express API reads `plan de maintenance.xlsm` at request time. Save changes in Excel, then select **Actualiser Excel** in the dashboard.
