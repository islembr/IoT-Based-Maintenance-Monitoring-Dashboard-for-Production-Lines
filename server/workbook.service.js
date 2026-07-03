const fs = require('node:fs');
const path = require('node:path');
const XLSX = require('xlsx');

const DEFAULT_WORKBOOK = path.join(__dirname, '..', 'data', 'plan de maintenance.xlsm');

function workbookPath() {
  return path.resolve(process.env.EXCEL_PATH || DEFAULT_WORKBOOK);
}

function loadWorkbook() {
  const file = workbookPath();
  if (!fs.existsSync(file)) {
    const error = new Error(`Workbook not found: ${file}`);
    error.statusCode = 503;
    throw error;
  }
  return { workbook: XLSX.readFile(file, { cellDates: true, cellStyles: true, cellFormula: true }), file };
}

function sheet(workbook, name) {
  const ws = workbook.Sheets[name];
  if (!ws) throw new Error(`Worksheet not found: ${name}`);
  return ws;
}

function value(ws, address) { return ws[address]?.v ?? null; }
function text(value) { return typeof value === 'string' ? value.trim() : value; }
function pad(value) { return String(value ?? '').trim().padStart(3, '0'); }

function machineName(value) {
  let name = String(value ?? '').trim().replace(/\s+/g, ' ').replace(/carrouseul/ig, 'Carrousel');
  let match = name.match(/^KTR\s+(\d+)$/i);
  if (match) return `KTR ${pad(Number(match[1]))}`;
  match = name.match(/^MODAL\s+(\d+)$/i);
  if (match) return `MODAL ${pad(Number(match[1]))}`;
  match = name.match(/^KTR\s+Carrousel\s+(\d+)$/i);
  if (match) return `KTR Carrousel ${pad(Number(match[1]))}`;
  return name;
}

function normalizeSite(value) {
  const site = String(value ?? '').trim().replace(/\s+/g, ' ');
  return ({ soliman: 'Soliman', ksarhlel: 'Ksar Hellal', kh: 'KH', 'md 2': 'MD 2', 'md 3': 'MD 3' })[site.toLowerCase()] || site;
}

function normalizeLocation(value) {
  const location = String(value ?? '').trim().replace(/\s+/g, ' ');
  return ({ g50: 'G50', autark: 'AUTARK', 'amg 253 salle wv': 'AMG 253 salle WV' })[location.toLowerCase()] || location || null;
}

function isoDate(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }
  if (typeof value === 'number') {
    const d = XLSX.SSF.parse_date_code(value);
    return d ? `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}` : '';
  }
  return String(value).slice(0, 10);
}

function maintenanceStatus(value) {
  const status = String(value ?? '').toLowerCase();
  if (status.includes('fait')) return 'Terminé';
  if (status.includes('prévue') || status.includes('ce mois')) return 'Ce mois';
  return 'Bientôt';
}

function cellColor(cell) {
  const color = cell?.s?.fgColor;
  if (color?.rgb) return `#${color.rgb.slice(-6)}`;
  if (color?.theme === 0) return '#000000';
  return '#FFFFFF';
}

function getSuivi(workbook) {
  const ws = sheet(workbook, 'Suivi de maintenance ');
  const tracking = [];
  const annualPlan = [];
  for (let row = 3; row <= 23; row++) {
    const machine = value(ws, `O${row}`);
    if (machine) tracking.push({ machine: machineName(machine), annualDate: isoDate(value(ws, `P${row}`)), status: maintenanceStatus(value(ws, `Q${row}`)) });
    const planMachine = value(ws, `A${row}`);
    if (planMachine) annualPlan.push({ machine: machineName(planMachine), colors: Array.from({ length: 12 }, (_, index) => cellColor(ws[XLSX.utils.encode_cell({ r: row - 1, c: index + 1 })])) });
  }
  const labels = ['Terminé', 'Ce mois', 'Bientôt'];
  return { tracking, annualPlan, statusCounts: labels.map(label => ({ label, value: tracking.filter(item => item.status === label).length })) };
}

function getActions(workbook) {
  const ws = sheet(workbook, 'Action de maintenance');
  const preventiveActions = [];
  for (let row = 2; row <= 22; row++) {
    const code = text(value(ws, `A${row}`));
    if (code) preventiveActions.push({ code, description: text(value(ws, `B${row}`)), periodicity: text(value(ws, `C${row}`)) });
  }
  const correctiveActions = [];
  for (let row = 2; row <= 21; row++) {
    const code = text(value(ws, `G${row}`));
    if (code) {
      const description = text(value(ws, `H${row}`));
      correctiveActions.push({ code, description: description || 'Description non renseignée dans le classeur', documented: Boolean(description) });
    }
  }
  return { preventiveActions, correctiveActions };
}

function getAccueil(workbook) {
  const ws = sheet(workbook, 'Accueil');
  const homeTasks = [];
  for (let row = 16; row <= 36; row++) {
    const machine = value(ws, `K${row}`);
    if (machine) homeTasks.push({ machine: machineName(machine), tasks: text(value(ws, `L${row}`)) || '—' });
  }
  return { homeTasks, selectedMachine: machineName(value(ws, 'K11')), currentWeek: text(value(ws, 'K14')) };
}

function getKpi(workbook) {
  const ws = sheet(workbook, 'KPI_par chaine ');
  const kpis = [];
  for (let row = 5; row <= 24; row++) {
    const machine = value(ws, `A${row}`);
    if (machine) kpis.push({ machine: machineName(machine), failures: Number(value(ws, `B${row}`) || 0), downtimeHours: Number(value(ws, `C${row}`) || 0), theoreticalHours: Number(value(ws, `D${row}`) || 0), operatingHours: Number(value(ws, `E${row}`) || 0), mttrHours: Number(value(ws, `F${row}`) || 0), mtbfHours: Number(value(ws, `G${row}`) || 0), availability: Number(value(ws, `H${row}`) || 0) });
  }
  return { kpis, kpiParameters: [{ label: 'Jours/semaine', value: 5, unit: 'j' }, { label: 'Heures/jour', value: 16, unit: 'h' }, { label: 'Semaines/mois', value: 4.33, unit: 'sem.' }, { label: 'Temps théorique/an', value: 3897, unit: 'h' }] };
}

function getPlan(workbook) {
  const ws = sheet(workbook, 'Plan hebdomadaire');
  const weeks = Array.from({ length: 52 }, (_, index) => `SW${index + 1}`);
  const weeklyPlan = [];
  for (let row = 3; row <= 23; row++) {
    const machine = value(ws, `A${row}`);
    if (!machine) continue;
    const tasks = Array.from({ length: 52 }, (_, index) => {
      const task = text(value(ws, XLSX.utils.encode_cell({ r: row - 1, c: index + 1 })));
      return task === 'A,7' ? 'A7' : task;
    });
    weeklyPlan.push({ machine: machineName(machine), tasks });
  }
  const weeklyStatus = Array.from({ length: 52 }, (_, index) => value(ws, XLSX.utils.encode_cell({ r: 23, c: index + 1 })));
  return { weeks, weeklyPlan, weeklyStatus };
}

function getInterventions(workbook) {
  const ws = sheet(workbook, "Insertion d'intervention");
  const interventions = [];
  for (let row = 2; row <= 107; row++) {
    const machine = value(ws, `A${row}`);
    if (!machine) continue;
    const date = isoDate(value(ws, `D${row}`));
    const durationMinutes = Number(value(ws, `F${row}`) || 0);
    interventions.push({ machine: machineName(machine), code: text(value(ws, `B${row}`)) || null, description: text(value(ws, `C${row}`)) || '', date, month: text(value(ws, `E${row}`)) || date.slice(0, 7), durationMinutes, durationHours: Number(value(ws, `G${row}`) ?? durationMinutes / 60) });
  }
  return { interventions };
}

function getFactory(workbook) {
  const ws = sheet(workbook, 'fabrique par service innovation');
  const factoryMachines = [];
  for (let row = 4; row <= 54; row++) {
    const typeValue = value(ws, `A${row}`);
    if (!typeValue) continue;
    const type = String(typeValue).trim().toUpperCase();
    const number = pad(value(ws, `B${row}`));
    factoryMachines.push({ machine: machineName(`${type} ${number}`), type, number, constructionYear: Number(value(ws, `C${row}`)), location: normalizeLocation(value(ws, `D${row}`)), site: normalizeSite(value(ws, `E${row}`)) });
  }
  return { factoryMachines };
}

function getResponsibility(workbook) {
  const ws = sheet(workbook, 'chaine sous notre responsabilte');
  const responsibilityMachines = [];
  for (let row = 4; row <= 26; row++) {
    const raw = value(ws, `A${row}`);
    if (!raw) continue;
    const type = String(raw).trim().replace(/\s+/g, ' ').replace(/\s*x\s*/ig, ' × ').replace(/carrouseul/ig, 'Carrousel').toUpperCase();
    const number = pad(value(ws, `B${row}`));
    const prefix = type.includes('CARROUSEL') ? 'KTR Carrousel' : type === 'MODAL' ? 'MODAL' : 'KTR';
    responsibilityMachines.push({ machine: machineName(`${prefix} ${number}`), type, number, constructionYear: Number(value(ws, `C${row}`)), location: normalizeLocation(value(ws, `D${row}`)), site: normalizeSite(value(ws, `E${row}`)) });
  }
  return { responsibilityMachines };
}

function getParts(workbook) {
  const ws = sheet(workbook, 'Pieces de rechange');
  const spareParts = [];
  for (let row = 3; row <= 28; row++) {
    const name = text(value(ws, `B${row}`));
    if (name) spareParts.push({ name, reference: text(value(ws, `C${row}`)) || null, quantity: Number(value(ws, `D${row}`) || 0), replacementDate: isoDate(value(ws, `E${row}`)) || null });
  }
  return { spareParts, totalQuantity: spareParts.reduce((sum, item) => sum + item.quantity, 0) };
}

function getCounts(workbook) {
  const { interventions } = getInterventions(workbook);
  const { tracking } = getSuivi(workbook);
  const { correctiveActions } = getActions(workbook);
  return {
    byMachine: tracking.map(item => ({ label: item.machine, value: interventions.filter(row => row.machine === item.machine).length })),
    byCode: correctiveActions.map(item => ({ label: item.code, value: interventions.filter(row => row.code === item.code).length })),
  };
}

function getSummary(workbook, file) {
  const { tracking, statusCounts } = getSuivi(workbook);
  const { interventions } = getInterventions(workbook);
  const { spareParts } = getParts(workbook);
  return { workbook: path.basename(file), updatedAt: fs.statSync(file).mtime.toISOString(), trackedLines: tracking.length, interventions: interventions.length, spareParts: spareParts.length, statuses: statusCounts };
}

module.exports = { loadWorkbook, getAccueil, getKpi, getActions, getSuivi, getPlan, getInterventions, getCounts, getFactory, getResponsibility, getParts, getSummary };
