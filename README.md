# NutriDayly — React Application

## Índice

- [Qué es NutriDayly](#qué-es-nutridayly)
- [Demo y capturas](#demo-y-capturas)
- [Quick start (instalación y ejecución)](#quick-start-instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Arquitectura (rutas, estado global, hooks)](#arquitectura-rutas-estado-global-hooks)
- [APIs integradas](#apis-integradas)
- [Testing y calidad](#testing-y-calidad)
- [Requisitos del proyecto cumplidos (checklist)](#requisitos-del-proyecto-cumplidos-checklist)
- [Stack tecnológico (según `package.json`)](#stack-tecnológico-según-packagejson)
- [Características principales](#características-principales)
- [Resumen del uso de IA (Gemini) en el desarrollo](#resumen-del-uso-de-ia-gemini-en-el-desarrollo)
- [Complicaciones y resoluciones](#complicaciones-y-resoluciones)
- [Tiempos empleados](#tiempos-empleados)
- [Backlog (futuras mejoras)](#backlog-futuras-mejoras)

## Qué es NutriDayly

En esta quinta semana de bootcamp de IronHacks nos pidieron ejecutar un proyecto en React con requisitos determinados. En este caso, llevé a cabo el proyecto de **NutriDayly**.

NutriDayly es una aplicación web **SPA** construida con React que permite a las personas usuarias:

- explorar bases de datos de alimentos,
- analizar sus propiedades nutricionales,
- gestionar una lista de favoritos,
- construir platos personalizados calculando su composición nutricional (normalizada por 100 g en el perfil del plato).

Su funcionamiento cuenta con tres pasos:

1. **Búsqueda:** devuelve un listado con alimentos que coinciden. Incluye filtrado post-búsqueda por categoría y nutrientes, y permite guardar alimentos.
2. **Guardados:** recoge los alimentos guardados desde búsqueda y también los platos creados en NutriCalc.
3. **NutriCalc:** combina alimentos guardados para crear platos, añadir nombre/imagen, seleccionar filtros de nutrientes que se guardan con el plato y persistir el resultado en guardados.

Tanto la primera como la segunda sección permiten acceder a la pantalla de detalles del alimento, mostrando su composición nutricional y una descripción.

La interfaz está en **inglés** para mantener coherencia con el origen principal de la información: la **USDA** (United States Department of Agriculture).

## Demo y capturas

- **Deploy:** https://daniel-kripta.github.io/project-react-application/

<img src="https://raw.githubusercontent.com/Daniel-kripta/project-react-application/refs/heads/main/src/assets/images/screenshot_page.png">

<img src="https://raw.githubusercontent.com/Daniel-kripta/project-react-application/refs/heads/main/src/assets/images/screenshot_details.png">

> Sugerencia para evaluación: 1 captura de Home, 1 de Search con filtros, 1 de Detail, 1 de Saved + NutriCalc.

## Quick start (instalación y ejecución)

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz (ver sección siguiente).
4. Arranca en desarrollo:

```bash
npm run dev
```

## Variables de entorno

Crea `.env` en la raíz del proyecto (no lo subas a git; debe estar ignorado).

Ejemplo:

```bash
VITE_USDA_API_KEY=tu_clave
VITE_PIXABAY_API_KEY=tu_clave
```

> Nota: el detalle nutricional puede complementarse con Wikipedia según la implementación actual del proyecto.

## Scripts disponibles

Según `package.json`:

```bash
npm run dev      # desarrollo (Vite)
npm run build    # build de producción (+ copia 404 para hosting estático)
npm run preview  # preview del build
npm run lint     # ESLint
npm test         # Vitest (modo watch por defecto)
npm run test -- --run  # Vitest una sola pasada (útil en CI / entrega)
```

## Arquitectura (rutas, estado global, hooks)

### Rutas (alto nivel)

La app está organizada como SPA con React Router. Las rutas concretas pueden variar según tu naming, pero el flujo principal es:

- Home
- Search
- Food detail (dinámico por id)
- Saved items
- NutriCalc
- Not found (404)

### Estado global (Context API)

Se gestiona estado compartido mediante varios contextos (por ejemplo: búsqueda/resultados, favoritos, platos guardados). Esto permite que acciones como “guardar” en Search se reflejen en Saved y alimenten NutriCalc.

### Hooks personalizados

La lógica de fetching y normalización de datos se extrae a hooks para mantener componentes más legibles y reutilizar reglas (por ejemplo, limpieza de nutrientes).

## APIs integradas

- **USDA API:** datos nutricionales.
- **Pixabay API:** imágenes dinámicas para cards/listados.
- **Wikipedia API:** resumen descriptivo en detalle (cuando aplica).

## Testing y calidad

- Tests con **Vitest** + **Testing Library** (componentes y flujos básicos).
- **ESLint** para consistencia y detección temprana de problemas.

## Requisitos del proyecto cumplidos (checklist)

Esta aplicación ha sido desarrollada siguiendo requisitos técnicos del bootcamp. Checklist explícito:

- [x] **Navegación y rutas** con `react-router-dom` (SPA, rutas múltiples, 404)
- [x] **Estado global** con **Context API** (más de un contexto consumido en varios componentes)
- [x] **Hooks personalizados** para encapsular lógica (API / datos)
- [x] **Integración con APIs de terceros** + manejo de estados de carga/error en flujos principales
- [x] **CSS Modules** + variables CSS en global (reset/variables)
- [x] **Persistencia** en `localStorage` para favoritos/platos (cuando aplica)
- [x] **Tests** básicos (Vitest)

## Stack tecnológico (según `package.json`)

- **React** + **Vite**
- **JavaScript (ES6+)**
- **CSS Modules**
- **React Router DOM** (versión instalada en el proyecto)
- **Vitest** + **Testing Library**
- **ESLint**
- **localStorage** (persistencia)

## Características principales

- **Limpieza de datos en origen:** la API USDA tiene estructura variable; se normaliza lo posible antes de pintar UI.
- **Cálculo nutricional en platos:** NutriCalc combina ingredientes y presenta el perfil del plato de forma interpretable (con foco en consistencia de unidades).
- **Persistencia:** favoritos y platos guardados sobreviven al refresco (localStorage).

## Resumen del uso de IA (Gemini) en el desarrollo

Para desarrollar este proyecto hice uso de la IA para generar código en React y en la gestión de integración con APIs. En torno al **75%** del código en esos dos aspectos fue generado guiando a Gemini hacia las distintas necesidades y arquitecturas planificadas para este proyecto. Mi trabajo principal en estos dos campos fue encajar piezas, integrar APIs reales, depurar datos inconsistentes, ajustar UX y asegurar que el resultado fuera coherente de extremo a extremo.

En el resto de campos de trabajo, el desarrollo fue mayoritariamente autónomo, con apoyo puntual cuando fue necesario.

También se usó el apoyo de la IA en la investigación.

Por último, en el debugging, la refactorización y el alineamiento con los objetivos del ejercicio, se contó con el apoyo de Cursor desktop.

## Complicaciones y resoluciones

Las mayores complicaciones surgieron en el tratamiento de los datos obtenidos de la API de la USDA, lo que obligó en algunos casos a obtener nutrientes mediante lógica defensiva (búsquedas, variantes, normalización).

Ejemplos:

- **Energía en kJ vs kcal (y presencia duplicada):** a veces la energía aparece en kJ, otras en kcal, otras con ambas representaciones.
- **Inconsistencias por agregación de fuentes:** la USDA aglutina fuentes distintas; puede haber variaciones en nombres de nutrientes u orden.

**Soluciones:**

- Para nombres inconsistentes: enfoque tipo “red de búsqueda” con variantes para encontrar el nutriente aunque el naming cambie ligeramente.
- Para energía: lógica en hooks que prioriza kcal cuando existe; si solo hay kJ, convierte a kcal (**÷ 4.184**) para unificar la app en kcal.

## Tiempos empleados

El tiempo reflejado en esta sección hace referencia al tiempo efectivo de desarrollo, en los aspectos reflejados en la tabla. Las tareas se dieron de forma simultánea, es por ello que la suma de totales y los porcentajes no son 100%.

**Resumen del proyecto:**

**Tiempo total:** 47h 16m

**Desglose por tarea:**

| Tarea | Tiempo efectivo | Porcentaje | Desviación* |
| :--- | :--- | :--- | :--- |
| **Frontend (total)** | 37h 39m | 80% | +24% |
| CSS | 13h 28m | 28% | +46% |
| API | 9h 36m | 20% | +20% |
| REACT | 5h 15m | 11% | +6% |
| UI | 4h 22m | 9% | +52% |
| Debugging, Refactorización... | 3h 50m | 8% | 0 |
| Investigación | 3h 52m | 8% | +2% |
| HTML | 3h 48m | 8% | +29% |
| Testing & UX | 0h 39m | 1% | -13% |
| **Tiempo total** | **47h 16m** | **100%** | |

*La desviación fue calculada sobre la previsión de tiempo inicial en cada tarea.

**Uso de herramientas:**

| Herramienta | Tiempo de uso | Porcentaje |
| :--- | :--- | :--- |
| VS Codium | 30h 07m | 69% |
| Gemini (IA) | 15h 03m | 35% |
| Chrome (DevTools) | 4h 29m | 10% |

Para el cálculo de los tiempos de desarrollo se hizo uso de KDevMonitor, una app de escritorio de Linux, creada con Gemini y construida a desktop con Tauri (5 horas).

## Backlog (futuras mejoras)

- [ ] **Profundidad en la gestión nutricional:** indicadores de compensación de nutrientes, filtros personalizados guardables, etc.
- [ ] **Interactividad y accesibilidad:** sesión de usuario (cuando haya backend), mejoras de accesibilidad (contraste, tipografía, foco), export/compartir datos, e internacionalización (ES/EN).
- [ ] **Fuentes de información:** valorar estrategias para reducir inconsistencias (capa de normalización más estricta, dataset curado, etc.).
