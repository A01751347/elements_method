# Mapeo Front → Backend → Base de datos (SHO / DMO3)

> Rastreo completo: **componente/gráfica del front → método del servicio Angular → endpoint del backend → entidades EF → view / tabla / stored procedure real en la base de datos.**
>
> Generado a partir de:
>
> - Front: `SHO/src/app/Services/App_Services.ts` y `SHO/src/app/home/home.component.ts`
> - Backend: `SHO_API_DMO3/My ITTP Web API/Controllers/AdministrationController.cs`
> - Mapeo EF→BD: `SHO_API_DMO3/My ITTP Web API/Models/DmoArchiveContext.cs`

---

## 1. Arquitectura general

El front consume **3 backends distintos** (configurados en `environment.*.ts`):

| Variable    | Backend                                                                                         | Uso                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `webapi`  | **DMO3 API** (`SHO_API_DMO3`) → `https://localhost:7266/`                            | Casi todo el dashboard (producción, paros, eUPS, logsheets, riesgo, PO)    |
| `webapi2` | **SafetyQualityPortal API** (`https://nchl-pr-safetyqualityapi-app.azurewebsites.net/`) | Reportes FHF y CCC (Amigo Ayudando Amigo / Colaborador Cuidando Consumidor) |
| `webapi3` | **NAMS Innovation Hub** (`https://nams-in-innovationhub-wca.azurewebsites.net/`)        | Envío de sugerencias (NPS)                                                 |

### Base de datos (webapi / DMO3 API)

- **Servidor:** `CLSFNL1036.nestle.com,40030`
- **Base:** `DMO_ARCHIVE`
- **Esquemas:**
  - `DW` → **vistas** (la mayoría) y algunas tablas de reporting.
  - `Archive/Safety` → **tablas** del registro de riesgos (GenHeader, GenEmployee, etc.).
  - Stored procedures en esquema `DW`.
- **Autenticación:** Windows / Integrated Security (usuario de Windows del proceso).

> Nota: `Logsheets` usa además los contextos `DmoArchiveContext2/3/4` (originalmente DMO_Cereal / DMO_Coffee / DMO_CMB). En DMO3 los 4 apuntan a `DMO_ARCHIVE`.

---

## 2. Tabla maestra: Gráfica / Componente → BD

| #  | Gráfica / Componente (dashboard)                                | Variable front                   | Método servicio          | Endpoint                                                 | View / Tabla / SP final                                                                                                      |
| -- | ---------------------------------------------------------------- | -------------------------------- | ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1  | **Producción** (línea)                                   | `data`                         | `getShiftCounter`       | `GetCounters/{shift}/{line}`                           | `DW.FactLineProductionCounters`                                                                                            |
| 2  | **Paros No Planeados (min)**                               | `data2`                        | `getFactEventsCounters` | `GetFactEventsCounters/{line}/{shift}`                 | `DW.FactEvent` (filtra `EventCategoryKey=4`, `IsBottleneckEvent=1`)                                                    |
| 3  | **eUPS**                                                   | `data4`                        | `getEupsKpi`            | `GetEupsKpi/{line}/{shift}`                            | `DW.PerformanceIndicatorsByLine` + `DW.DimIndicator` + `DW.FactLineIndicatorTarget` + `DW.FactIndicatorTarget`       |
| 4  | **Adherencia % Paros Planeados**                           | `data3`                        | `getFactEventsGrouped`  | `GetFactEventsGrouped/{line}/{shift}`                  | `DW.FactEvent` + `DW.DimEventReason` + `DW.DimIndicator` + `DW.FactLineIndicatorTarget` + `DW.FactIndicatorTarget` |
| 5  | **Estado de Turno – Seguridad**                           | `shiftRiskInfo`                | `getShiftRisk`          | `GetShiftRiskPrediction/{line}/{start}/{end}`          | `Archive/Safety.GenHeader` + `GenEmployee` + `GenAreaShift` + `GenRiskScore` + `DW.DimEquipment`                   |
| 6  | **Estado de Turno – IL03 / PCC / GMP / LIL / Centerline** | `logsheetsIL03/PCC/GMP/LIL/CL` | `getLogsheets`          | `Logsheets/{PO}/{start}/{end}`                         | **SP `DW.Report_GetLogsheetDetails`** + `DW.DimParameterDefinitionExt`                                             |
| 7  | **Reportes FHF** (Amigo Ayudando Amigo)                    | `fhfreports`                   | `getFHFReports`         | *(webapi2)* `SurveyAppExt/GetSHOObservationsFHF/...` | **Backend distinto** (SafetyQualityPortal)                                                                             |
| 8  | **Reportes CCC** (Colaborador Cuidando Consumidor)         | `cccreports`                   | `getCCCReports`         | *(webapi2)* `SurveyAppExt/GetSHOObservationsCCC/...` | **Backend distinto** (SafetyQualityPortal)                                                                             |
| 9  | **Tabla PO del turno / Adherencia PO**                     | `poByLine`                     | `getPOActualShift`      | `GetPOActualShift/{line}/{shift}`                      | `DW.FactPOConfirmation`                                                                                                    |
| 10 | **Scheduler / Actividades**                                | `activities`                   | `getActivities`         | `GetSchedulerInfo/{equipmentkey}`                      | `DW.DimActivitySchedulerHistory` + `DW.DimActivityType` + `DW.DimEquipment`                                            |
| 11 | **Velocidad esperada (estándares)**                       | —                               | `getExpectedVelocity`   | `GetExpectedVelocity/{prodkey}`                        | `DW.DimProductionRequest`                                                                                                  |
| 12 | **Contadores por PO**                                      | —                               | `getPOCounter`          | `GetCountersPO/{prodkey}`                              | `DW.FactLineProductionCounters`                                                                                            |
| 13 | **Modal histórico de logsheet**                           | —                               | `getHistLogsheet`       | `GetHistSpecLogsheet`                                  | `DW.HistoricalLogsheet7days`                                                                                               |

### Filtros / selección (no son gráficas)

| Componente                 | Método            | Endpoint                        | BD                                                  |
| -------------------------- | ------------------ | ------------------------------- | --------------------------------------------------- |
| Dropdown de fechas         | `getDates`       | `GetDates`                    | `DW.DimShiftSchedule`                             |
| Dropdown de turnos         | `getShifts`      | `GetShift` (sin parámetro)   | `DW.DimShiftSchedule`                             |
| Dropdown de líneas        | `getLines`       | `GetEquipments`               | `DW.DimEquipment`                                 |
| Turno actual por línea    | `getActualShift` | `GetActualShift/{line}`       | `DW.FactPOConfirmation` + `DW.DimShiftSchedule` |
| Turno por key              | `getShift`       | `GetShift/{shiftkey}`         | `DW.DimShiftSchedule`                             |
| Info de turno (histórico) | `getShiftInfo`   | `GetShiftInfo/{shift}/{date}` | `DW.DimShiftSchedule`                             |

---

## 3. Detalle por endpoint del backend (DMO3 API)

Todos en `AdministrationController.cs` (esquema de ruta `/Administration/{action}/...`).

### `Logsheets/{PO}/{startdate}/{endate}`

- **SP:** `EXECUTE DW.Report_GetLogsheetDetails @PO` (se ejecuta en contexto 2, luego 3, luego 4 hasta obtener filas).
- **Join:** `DW.DimParameterDefinitionExt` (para `ParameterCategory`, `Weighting`).
- **Alimenta:** tarjetas de Estado de Turno (IL03=QMS, PCC=PCC/CCP/PPRO/OPPR, GMP=BASIC, LIL=Cleaning/Lubrication, Centerline).

### `GetActualShift/{LineKey}`

- **Entidades:** `DW.FactPOConfirmation` (última PO), `DW.DimShiftSchedule`.

### `GetShift/{shiftkey}` y `GetShift` (sin parámetro)

- **Entidad:** `DW.DimShiftSchedule`.

### `GetPOActualShift/{Linekey}/{shiftKey}`, `GetPOLast7Days/{Linekey}`, `GetPOLast7DaysforStds/{Linekey}`

- **Entidad:** `DW.FactPOConfirmation`.

### `GetEquipments`

- **Entidad:** `DW.DimEquipment` (filtra `NodeType='Line'`).

### `GetCounters/{shiftKey}/{linekey}` y `GetCountersPO/{prodKey}`

- **Entidad:** `DW.FactLineProductionCounters`.

### `GetFactEventsCounters/{lineKey}/{shiftKey}`

- **Entidad:** `DW.FactEvent` (filtra `IsBottleneckEvent=1`, `IsDeleted=0`; agrupa por categoría y hora).

### `GetFactEvents/{lineKey}/{shiftKey}`

- **Entidades:** `DW.FactEvent` + `DW.DimEventReason` (descripción del paro).

### `GetFactEventsGrouped/{lineKey}/{shiftKey}`

- **Entidades:** `DW.FactEvent` + `DW.DimEventReason` (agrupado por razón, % adherencia).
- **Banda min/max:** `DW.DimIndicator` (resuelve `compliance_to_planned_stoppages`, key 15) → `DW.FactLineIndicatorTarget` (por línea) → fallback `DW.FactIndicatorTarget` (fábrica).

### `GetExpectedVelocity/{prodkey}`

- **Entidad:** `DW.DimProductionRequest`.

### `GetShiftRiskPrediction/{lineKey}/{startdate}/{endate}`

- **Entidades:** `Archive/Safety.GenHeader` + `GenEmployee` + `GenAreaShift` + `GenRiskScore`, join con `DW.DimEquipment` (jerarquía de equipos hijos).

### `GetDates`, `GetShiftInfo/{shift}/{date}`

- **Entidad:** `DW.DimShiftSchedule`.

### `GetSchedulerInfo/{equipmentkey}`

- **Entidades:** `DW.DimActivitySchedulerHistory` + `DW.DimActivityType` + `DW.DimEquipment`.

### `GetHistSpecLogsheet` (query params `parameterName`, `groupName`)

- **Entidad:** `DW.HistoricalLogsheet7days` (vía `db.Set<HistoricalLogsheet7day>()` en varios contextos).

### `GetEupsKpi/{lineKey}/{shiftKey}`

- **Actual:** `DW.PerformanceIndicatorsByLine` (`Σ estimated_unplanned / Σ runtime`).
- **Banda min/max:** `DW.DimIndicator` (`unplanned_stoppages_percent`, key 7) → `DW.FactLineIndicatorTarget` → fallback `DW.FactIndicatorTarget`.

---

## 4. Referencia: entidad EF → objeto real en BD

| Entidad EF (DbSet)                | Objeto en BD                               | Tipo             | Esquema            |
| --------------------------------- | ------------------------------------------ | ---------------- | ------------------ |
| `FactLineProductionCounters`    | `FactLineProductionCounters`             | Vista            | `DW`             |
| `FactEvents`                    | `FactEvent`                              | Vista            | `DW`             |
| `DimEventReasons`               | `DimEventReason`                         | Vista            | `DW`             |
| `FactPoconfirmations`           | `FactPOConfirmation`                     | Vista            | `DW`             |
| `DimShiftSchedules`             | `DimShiftSchedule`                       | Vista            | `DW`             |
| `DimEquipments`                 | `DimEquipment`                           | Vista            | `DW`             |
| `DimProductionRequests`         | `DimProductionRequest`                   | Vista            | `DW`             |
| `DimParameterDefinitionExts`    | `DimParameterDefinitionExt`              | Vista            | `DW`             |
| `DimIndicators`                 | `DimIndicator`                           | Vista            | `DW`             |
| `FactLineIndicatorTargets`      | `FactLineIndicatorTarget`                | Vista            | `DW`             |
| `FactIndicatorTargets`          | `FactIndicatorTarget`                    | Vista            | `DW`             |
| `PerformanceIndicatorsByLines`  | `PerformanceIndicatorsByLine`            | Tabla            | `DW`             |
| `DimActivitySchedulerHistories` | `DimActivitySchedulerHistory`            | Vista            | `DW`             |
| `DimActivityTypes`              | `DimActivityType`                        | Vista            | `DW`             |
| `HistoricalLogsheet7day`        | `HistoricalLogsheet7days`                | Vista            | `DW`             |
| `GenHeaders`                    | `GenHeader`                              | Tabla            | `Archive/Safety` |
| `GenEmployees`                  | `GenEmployee`                            | Tabla            | `Archive/Safety` |
| `GenAreaShifts`                 | `GenAreaShift`                           | Tabla            | `Archive/Safety` |
| `GenRiskScores`                 | `GenRiskScore`                           | Tabla            | `Archive/Safety` |
| `Logsheets` (context2/3/4)      | **SP `Report_GetLogsheetDetails`** | Stored Procedure | `DW`             |

---

## 5. Indicadores clave (DW.DimIndicator) usados por las gráficas

| Key | IndicatorId                         | Fórmula                                       | Usado en                                                                               |
| --- | ----------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| 6   | `planned_stoppages_percent`       | `100*[planned_duration]/[occupied_time]`     | (no usado directo; escala 0–10)                                                       |
| 7   | `unplanned_stoppages_percent`     | `100*[unplanned_duration]/[runtime]`         | **Banda eUPS** (gráfica 3)                                                      |
| 15  | `compliance_to_planned_stoppages` | `100*[planned_duration]/[expected_duration]` | **Banda Adherencia Paros Planeados** (gráfica 4) — *sin target cargado aún* |
| 16  | `compliance_to_nominal_speed`     | `100*(...)/[nominal_speed]`                  | (referencia de banda)                                                                  |
| 22  | `eup_percent`                     | `100*[eups]/[runtime]`                       | métrica eUPS estimada                                                                 |

> **Targets por 3 niveles:** `DW.FactLineIndicatorTarget` (por línea) → `DW.FactIndicatorTarget` (fábrica) → `DW.FactDefaultIndicatorTarget` (default). Hoy solo el indicador **7 (eUPS)** tiene targets por línea cargados; el **15** está vacío.

---

## 6. Diagrama de flujo (resumen)

```
[home.component.ts]  --forkJoin-->  [App_Services.ts]  --HTTP-->  [DMO3 API]  --EF-->  [DMO_ARCHIVE]
   │                                                                                         │
   ├─ data   (Producción)        → getShiftCounter        → GetCounters            → DW.FactLineProductionCounters
   ├─ data2  (Paros No Plan.)    → getFactEventsCounters  → GetFactEventsCounters  → DW.FactEvent
   ├─ data3  (Adherencia P.P.)   → getFactEventsGrouped   → GetFactEventsGrouped   → DW.FactEvent + DimEventReason + DimIndicator + Fact(Line)IndicatorTarget
   ├─ data4  (eUPS)              → getEupsKpi             → GetEupsKpi             → DW.PerformanceIndicatorsByLine + DimIndicator + Fact(Line)IndicatorTarget
   ├─ Seguridad                  → getShiftRisk           → GetShiftRiskPrediction → Archive/Safety.Gen* + DW.DimEquipment
   ├─ IL03/PCC/GMP/LIL/Center.   → getLogsheets           → Logsheets             → SP DW.Report_GetLogsheetDetails + DimParameterDefinitionExt
   ├─ Tabla PO                   → getPOActualShift       → GetPOActualShift       → DW.FactPOConfirmation
   ├─ Scheduler                  → getActivities          → GetSchedulerInfo       → DW.DimActivitySchedulerHistory + DimActivityType + DimEquipment
   ├─ FHF  ───(webapi2)──────────→ getFHFReports          → SurveyAppExt/...FHF    → [SafetyQualityPortal API]
   └─ CCC  ───(webapi2)──────────→ getCCCReports          → SurveyAppExt/...CCC    → [SafetyQualityPortal API]
```
