## Project: REACT APLICATION
# NutriDayly

En esta quinta semana de bootcamp de IronHacks nos pidieron ejecutar un proyecto en React con requisitos determinados. En este caso, llevé a cabo el proyecto de NutriDayly.

NutriDayly es una aplicación web SPA construida con React que permite a las personas usuarias explorar bases de datos de alimentos, analizar sus propiedades nutricionales, gestionar una lista de favoritos y construir platos personalizados calculando su valor nutricional exacto.

Su funcionamiento cuenta con tres pasos. El primero de todos es un sistema de búsqueda de alimentos, que devuelve un listado con aquellos que coinciden. En esta sección se implementó una función de filtrado post-búsqueda, que permite seleccionar por nutrientes o categoría. En esta sección se posibilita el guardado de los alimentos, pasando al segundo paso.

La sección de guardados recoge todo aquellos alimentos que la persona usuaria ha guardado previamente en la sección de búsqueda. En esta sección también se guardan los platos combinados en la sección NutriCalc.

El tercer paso, la sección NutriCalc, permite combinar los alimentos guardados para hacer platos completos y obtener un listado detallado de la composición nutricional. La persona usuaria puede añadir un nombre y una imagen, además de seleccionar los filtros que se guardarán con el plato. UNa vez guardado, se envía a la sección de guardados para posteriores consultas.

Tanto la la primera como la segunda sección permiten el acceso a la pantalla de detalles del alimento, mostrando su composicioón nutricional y una descripción.

Esta aplicación web se realizó en idioma inglés ya que se quería guardar coherencia con el origen de la fuente de información, es decir, la USDA (el Departamento de Agricultura de los EEUU).

## Requisitos del Proyecto Cumplidos

Esta aplicación ha sido desarrollada siguiendo los requisitos técnicos:

- **Navegación y Rutas:** Implementación de 5 rutas dinámicas con `react-router-dom`
- **Estado Global (Context API):** Gestión de datos compartidos a través de múltiples Contextos.
- **Hooks Personalizados:** Toda la lógica de API se ha extraído en hooks para un código limpio,
- **Integración de APIs de Terceros:**
  - **USDA API:** Para datos nutricionales científicos.
  - **Pixabay API:** Para imágenes dinámicas de alimentos.
  - **Wikipedia API:** Para resúmenes descriptivos de los alimentos.
- **Diseño Responsivo:** UI adaptada a móvil, tablet y desktop mediante **CSS Modules** y variables CSS.

## Stack Tecnológico

- **React 18** (Vite)
- **JavaScript (ES6+)**
- **CSS Modules**
- **React Router v6**
- **LocalStorage API** (Persistencia de datos)

## Características Principales

- **Limpieza de datos en origen:** La base de datos proveniente de la API de la USDA tiene una estructura algo caótica y variante.
- **Cálculo por porción:** La calculadora permite alternar entre ver los nutrientes totales del plato o verlos normalizados por cada 100g de masa.
- **Persistencia:** Todos tus favoritos y platos guardados se mantienen después de cerrar el navegador.


## Resumen del uso de IA (Gemini) en el desarrollo
Para desarrollar este proyecto hice uso de la IA para generar códigos para React y en la gestión de la API. En torno al 75% del código en esos dos aspectos fueron generados guiando a Gemini hacia las distintas necesidades y arquitecturas planificadas para este proyecto. Mi trabajo principal fue, por lo tanto, hacer encajar las piezas y desarrollar la idea principal. Se requirió apoyo puntual en otros aspectos, como CSS, en los que el desarrollo si fue autónomo.


## Complicaciones y Resoluciones
La mayores complicaciones surgieron en el tratamiento de los datos obtenidos de la API de la USDA. Esto obligó en algunos casos a obtener nutrientes mediante pruebas lógicas, declaración de variables y algunos métodos.

Por ejemplo, surgió un problema en como la API registraba los datos de energía, a veces con KJ, otras con Kcal, otras con ambas. Otro ejemplo, esta API aglutina varias fuentes de información, lo cual provoca que algunos alimentos muestren inconsistencias en el nombre de sus nutrientes o otros casos en los que cambian el orden en que se muestran.

Para solucionar esta incosistencia en los nombres se creó una función extractora con un array de variantes ("red de búsqueda") que garantiza encontrar el dato sin importar cómo lo nombre la API. AL respecto de la incosistencia en la forma en que se muestra la energía se implementó un filtro en los Hooks que detecta si existe el dato en kcal. Si solo existe en kJ, realiza la conversión matemática automática (dividiendo por 4.184) para normalizar toda la app a kcal.


## Tiempos Empleados

El tiempo reflejado en esta sección hace referencia al tiempo efectivo de desarrollo. 

**Resumen del Proyecto:**
- **Tiempo Total:** 43h 26m

**Desglose por Tarea:**
| Tarea | Tiempo Efectivo | Porcentaje | Desviación |
| :--- | :--- | :--- | :--- |
| **Frontend (Total)** | 37h 39m | 87% | +24% |
| CSS | 13h 28m | 31% | +46% |
| API | 9h 36m | 22% | +20% |
| REACT | 5h 15m | 12% | +6% |
| UI | 4h 22m | 10% | +52% |
| Investigación | 3h 52m | 9% | +2% |
| HTML | 3h 48m | 9% | +29% |
| Testing & UX | 0h 39m | 1% | -13% |
| **Tiempo Total** | **43h 26m** | **100%** | |

**Desviación de la previsión por Tipo de Tarea**

Frontend +24%, 
API +20%, 
Investigación +2%, 
CSS +46%, 
UI +52%, 
HTML +29%, 
Testing UI, UX, Reach -13%, 
REACT +6%

**Uso de Herramientas:**
| Herramienta | Tiempo de Uso | Porcentaje |
| :--- | :--- | :--- |
| VS Codium | 30h 07m | 69% |
| Gemini (IA) | 15h 03m | 35% |
| Chrome (DevTools) | 4h 29m | 10% |

## Backlog (Futuras Mejoras)

Las mejoras futuras a mi criterio son:

- [ ] **Profundidad en la gestión de los datos nutricionales:** Se prevé seguir mejorando estos aspectos para que la aplicación sea un veradero apoyo a la gestión de la nutrición. Ejemplos de ello son: indicadores de compensación de nutrientes, gestión de filtros personalizados guardables. T

- [ ] **Interactividad y accesibilidad:** Implementación de sesión de personas usuarias (posiblemente cuando aprendamos el backend) y mayor interacción con redes sociales. Además, ofrecer facilidades para la reutilización de la información, es decir, un sistema de extracción. Implementar también, funciones de accesibilidad en cuanto al contraste, el tamaño de la letra y demás aspectos. Por último, implementar la selección de idiomas para habilitarla en español.

- [ ] **Mejorar las fuentes de información:** Aunque la API de USDA es la mas completa, con unos 800.000 registros, no deja de ser una API que aglutina distintas fuentes y que presentan ciertas inconsistencias. A valorar, construir una nueva base de datos no dan profunda pero mas estable.