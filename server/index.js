const express = require('express');
const path = require('node:path');
const service = require('./workbook.service');

const app = express();
const port = Number(process.env.PORT || 3000);

function endpoint(handler) {
  return (_request, response, next) => {
    try {
      const { workbook, file } = service.loadWorkbook();
      response.set('Cache-Control', 'no-store');
      response.json(handler(workbook, file));
    } catch (error) { next(error); }
  };
}

app.get('/api/accueil', endpoint(service.getAccueil));
app.get('/api/kpi', endpoint(service.getKpi));
app.get('/api/actions', endpoint(service.getActions));
app.get('/api/suivi-maintenance', endpoint(service.getSuivi));
app.get('/api/plan-hebdomadaire', endpoint(service.getPlan));
app.get('/api/interventions', endpoint(service.getInterventions));
app.get('/api/nombre-interventions', endpoint(service.getCounts));
app.get('/api/fabrique-innovation', endpoint(service.getFactory));
app.get('/api/chaines-responsabilite', endpoint(service.getResponsibility));
app.get('/api/pieces-rechange', endpoint(service.getParts));
app.get('/api/dashboard-summary', endpoint(service.getSummary));

const browserBuild = path.join(__dirname, '..', 'dist', 'jardin-maintenance', 'browser');
app.use(express.static(browserBuild));
app.get('*', (request, response, next) => request.path.startsWith('/api/') ? next() : response.sendFile(path.join(browserBuild, 'index.html')));

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.statusCode || 500).json({ error: error.message || 'Unable to read workbook' });
});

app.listen(port, '127.0.0.1', () => console.log(`Maintenance API listening on http://127.0.0.1:${port}`));
