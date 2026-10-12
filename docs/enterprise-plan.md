# P2M3 - Plan empresarial de GitHub Actions

## Objetivo

Definir una estrategia empresarial para administrar GitHub Actions de forma segura, reutilizable y escalable.

## Políticas

Definen qué acciones y workflows están permitidos dentro de la organización y bajo qué condiciones pueden ejecutarse.

**Riesgo sin gobierno central:** cada repositorio podría utilizar actions externas distintas, incluso no revisadas o inseguras.

**Medida de control:** definir políticas de organización o empresa que restrinjan qué actions pueden utilizarse y establecer un proceso de revisión para nuevas dependencias.

## Runners

Definen dónde se ejecutan los jobs y qué tipo de runners se utilizarán: GitHub-hosted, larger runners o self-hosted.

**Riesgo sin gobierno central:** los runners self-hosted podrían quedar mal mantenidos, desactualizados o expuestos a repositorios que no deberían utilizarlos.

**Medida de control:** administrar runners y runner groups de forma centralizada, aplicar labels y limitar qué repositorios pueden utilizar cada grupo.

## Componentes reutilizables

Permiten centralizar lógica común mediante reusable workflows y acciones compartidas, evitando duplicar YAML entre repositorios.

**Riesgo sin gobierno central:** cada equipo podría copiar y modificar sus propios workflows, provocando duplicidad, inconsistencias y más mantenimiento.

**Medida de control:** centralizar lógica común en reusable workflows y actions compartidas, versionarlas y reutilizarlas desde los distintos repositorios.

## Secretos

Definen cómo y dónde se almacenan credenciales y datos sensibles, utilizando el alcance adecuado: repositorio, organización o environment.

**Riesgo sin gobierno central:** los secretos podrían almacenarse con un alcance incorrecto, duplicarse innecesariamente o quedar accesibles desde workflows que no deberían utilizarlos.

**Medida de control:** utilizar repository secrets, organization secrets y environment secrets según su alcance, aplicando mínimo privilegio y protecciones de environment.

## GitHub Enterprise Cloud vs GitHub Enterprise Server

| Aspecto | GitHub Enterprise Cloud | GitHub Enterprise Server |
|---|---|---|
| Alojamiento | Infraestructura gestionada por GitHub | Infraestructura gestionada por la empresa |
| Actualizaciones | GitHub actualiza la plataforma | La empresa planifica e instala las actualizaciones |
| Conectividad | Normalmente requiere conectividad con GitHub.com y servicios asociados | Puede desplegarse en redes privadas o restringidas |
| Runners | Puede usar GitHub-hosted y self-hosted runners | Suele depender principalmente de self-hosted runners |
| Marketplace | Acceso sencillo, condicionado por las políticas de la organización | El acceso puede estar limitado por conectividad, proxy o políticas internas |
| Administración | Menor carga operativa para la empresa | Mayor responsabilidad de administración |
| Control | Menor control sobre la infraestructura subyacente | Mayor control sobre plataforma, red e infraestructura |

### Escenario: empresa aislada de Internet

Una organización trabaja en una red cerrada o con conectividad muy restringida hacia Internet.

En este escenario, GitHub Enterprise Server puede ser una opción adecuada porque permite mantener la plataforma dentro de la infraestructura de la propia empresa.

Aspectos a considerar:

- Los runners serán normalmente self-hosted.
- El acceso a GitHub Marketplace puede estar limitado o no disponible directamente.
- Las actions externas pueden requerir descarga previa, replicación interna o una política específica.
- Las actualizaciones de GHES deben planificarse y realizarse por la propia organización.
- La empresa asume la seguridad, mantenimiento y disponibilidad de la infraestructura.
- La conectividad hacia servicios externos utilizados por los workflows debe revisarse de forma explícita.

### Escenario: organización que prioriza menor carga operativa

Una organización quiere reducir al máximo las tareas de administración de la plataforma GitHub y centrarse en el desarrollo y los procesos DevOps.

En este escenario, GitHub Enterprise Cloud puede ser una opción adecuada porque GitHub gestiona la infraestructura y las actualizaciones de la plataforma.

Aspectos a considerar:

- Menor esfuerzo de mantenimiento de la plataforma.
- Actualizaciones gestionadas por GitHub.
- Acceso más sencillo a GitHub-hosted runners.
- Integración más directa con GitHub Marketplace y servicios de GitHub.
- Menor necesidad de administrar infraestructura propia.
- Dependencia de la conectividad con los servicios de GitHub.
- Menor control sobre la infraestructura subyacente.

### Criterios para elegir entre GitHub Enterprise Cloud y GHES

No existe una opción mejor en todos los casos.

GitHub Enterprise Cloud puede ser más adecuado cuando:

- Se quiere minimizar la carga operativa.
- No existen restricciones fuertes de conectividad.
- Se desea aprovechar fácilmente GitHub-hosted runners y servicios de GitHub.
- Se prioriza rapidez de adopción y menor mantenimiento de infraestructura.

GitHub Enterprise Server puede ser más adecuado cuando:

- Existen requisitos de aislamiento de red.
- La empresa necesita mayor control sobre la infraestructura.
- Existen restricciones regulatorias o internas sobre dónde reside la plataforma.
- Se necesita integrar GitHub con redes o servicios internos no accesibles desde Internet.
- La organización puede asumir la administración, parcheado, actualizaciones y disponibilidad de la plataforma.

La elección debe basarse en requisitos de seguridad, conectividad, operación, cumplimiento y control de infraestructura.

### Reusable workflow vs Composite Action

Una composite action reutiliza principalmente una secuencia de steps.

Ejemplo:
- `quality-gate`
- Puede incluir `setup-node`, `npm ci`, `npm test`, `npm run build`
- Se invoca dentro de `steps` con `uses`

Un reusable workflow reutiliza jobs completos.

Ejemplo:
- `p2m3_3_reusable-ci.yml`
- Define uno o varios jobs completos
- Puede definir runners, permissions, environments, matrices, inputs, secrets y outputs
- Se invoca con `uses` a nivel de job

Resumen:

| Característica | Composite Action | Reusable Workflow |
|---|---|---|
| Reutiliza | Steps | Jobs/workflows completos |
| Se invoca en | `steps` | `jobs` |
| Usa `workflow_call` | No | Sí |
| Puede definir `runs-on` | No | Sí |
| Puede definir varios jobs | No | Sí |
| Ideal para | Lógica de steps reutilizable | CI/CD reutilizable entre repositorios |

### Política de uso de GitHub Actions

La organización permitirá únicamente:

- Actions oficiales publicadas por GitHub, por ejemplo:
  - `actions/checkout`
  - `actions/setup-node`
  - `actions/cache`

- Actions desarrolladas y mantenidas por la organización interna:
  - `mi-organizacion/*`

No se permitirá el uso libre de actions de terceros sin revisión previa.

Para incorporar una nueva action externa deberá realizarse una revisión de:

- Propietario de la action.
- Reputación y mantenimiento del repositorio.
- Permisos requeridos.
- Código ejecutado.
- Dependencias utilizadas.
- Versión consumida.
- Posibilidad de fijar la referencia a un SHA completo.

## Niveles de política para GitHub Actions

### Desarrollo abierto

Entorno orientado a pruebas, aprendizaje y desarrollo rápido.

Características:
- Mayor libertad para utilizar actions externas.
- Se permite experimentar con nuevas actions.
- Revisión menos estricta.
- No deben utilizarse credenciales sensibles de producción.
- El riesgo asumido es mayor.

### Producción controlada

Entorno destinado a procesos CI/CD que afectan a sistemas productivos.

Características:
- Solo se permiten actions aprobadas.
- Se revisan permisos y dependencias.
- Preferencia por actions oficiales o internas.
- Las referencias externas deben usar versiones controladas y, cuando proceda, SHA completo.
- Se aplica mínimo privilegio a `GITHUB_TOKEN` y secretos.

### Entorno altamente restringido

Entorno con requisitos elevados de seguridad, cumplimiento o aislamiento.

Características:
- Preferencia por actions internas.
- Las actions externas deben estar explícitamente autorizadas.
- Pinning mediante SHA completo.
- Uso limitado de Internet y servicios externos.
- Runners controlados y aislados.
- Revisión obligatoria antes de introducir nuevas dependencias.

### Actions permitidas por nivel

| Nivel | Actions permitidas |
|---|---|
| Desarrollo abierto | GitHub oficiales, internas y terceros para pruebas |
| Producción controlada | GitHub oficiales, internas y terceros previamente aprobadas |
| Altamente restringido | Preferentemente internas; externas solo mediante allowlist y aprobación expresa |

### Regla de revisión para nuevas Actions

Antes de incorporar una nueva action externa a un workflow se deberá realizar una revisión previa.

La revisión debe comprobar:

- Quién mantiene la action.
- Si el repositorio está activo y actualizado.
- Qué permisos necesita.
- Qué código y dependencias ejecuta.
- Si solicita acceso a secretos.
- Qué versión se va a consumir.
- Si puede fijarse mediante SHA completo.
- Si existe una alternativa oficial de GitHub o una action interna.
- Si la action está incluida en la allowlist de la organización.

En entornos de producción o altamente restringidos, la incorporación de una nueva action deberá ser aprobada antes de su uso.

### Inventario de dependencias de GitHub Actions

| Referencia | Clasificación |
|---|---|
| `actions/checkout@v4` | GitHub |
| `actions/checkout@v7` | GitHub |
| `actions/setup-node@v4` | GitHub |
| `actions/setup-node@v7` | GitHub |
| `actions/upload-artifact@v4` | GitHub |
| `actions/download-artifact@v5` | GitHub |
| `actions/github-script@v7` | GitHub |
| `docker/login-action@v3` | Proveedor reconocido |
| `./.github/actions/test-project` | Local Action |
| `./.github/actions/quality-gate` | Local Composite Action |
| `./.github/actions/hello-js` | Local JavaScript Action |
| `./.github/workflows/p2m3_3_reusable-ci.yml` | Local Reusable Workflow |


### Estrategia de reutilización para 20 repositorios

Para una organización con 20 repositorios centralizaría en reusable workflows los procesos comunes de CI/CD.

Elementos a centralizar:

- Configuración estándar de Node.js.
- Instalación de dependencias.
- Ejecución de tests.
- Build.
- Generación de versión.
- Publicación de artifacts.
- Reglas comunes de seguridad.
- Permisos mínimos de GITHUB_TOKEN.
- Integración con entornos de staging y producción.
- Validaciones comunes antes del merge.

Los repositorios consumidores deberían limitarse a:

- Llamar al reusable workflow.
- Pasar inputs específicos.
- Mapear únicamente los secrets necesarios.
- Añadir lógica propia solo cuando sea específica del proyecto.


### Cuándo utilizar self-hosted runners

Elegiría self-hosted runners cuando los workflows necesiten capacidades que no encajan bien con los runners administrados por GitHub.

Casos principales:

- Acceso a recursos de red interna.
- Conexión a bases de datos o servicios no expuestos a Internet.
- Uso de software propietario o herramientas internas.
- Necesidad de hardware específico.
- Requisitos especiales de rendimiento.
- Restricciones de seguridad o aislamiento.
- Necesidad de controlar versiones exactas del software instalado.
- Escenarios donde el coste de ejecución sea más predecible con infraestructura propia.

A cambio, la organización asume responsabilidades adicionales:

- Instalación y actualización del runner.
- Parches del sistema operativo.
- Seguridad del host.
- Limpieza de datos entre ejecuciones.
- Monitorización.
- Disponibilidad.
- Escalado.

### Diseño de un self-hosted runner de laboratorio

Se plantea un runner autohospedado Linux destinado únicamente a prácticas de GitHub Actions.

Características propuestas:

- Sistema operativo: Ubuntu Server 24.04 LTS.
- Arquitectura: x64.
- CPU: 2 vCPU.
- Memoria: 4 GB RAM.
- Disco: 20 GB.
- Conectividad saliente a GitHub.
- Sin exposición directa de servicios al exterior.
- Uso exclusivo para workflows de laboratorio.
- Cuenta de servicio dedicada para ejecutar el runner.

El runner se registraría desde:

GitHub > Settings > Actions > Runners > New self-hosted runner

Durante el registro se utilizaría un token temporal proporcionado por GitHub, que no debe almacenarse ni compartirse.

Después del registro, el runner quedaría disponible con etiquetas como:

- self-hosted
- linux
- x64
- gh200-lab

Los workflows podrían seleccionarlo con:

```yaml
runs-on: [self-hosted, linux, gh200-lab]

### Proceso de alta de un self-hosted runner

Ruta de configuración:

GitHub
→ Settings
→ Actions
→ Runners
→ New self-hosted runner

Pasos generales:

1. Seleccionar el sistema operativo y la arquitectura del runner.
2. Descargar el paquete del runner en la máquina que lo alojará.
3. Descomprimirlo en una carpeta dedicada.
4. Ejecutar el comando de configuración proporcionado por GitHub.
5. Introducir la URL del repositorio u organización y el token temporal de registro.
6. Asignar nombre y labels al runner.
7. Iniciar el runner.
8. Comprobar en GitHub que aparece con estado Online.

El token de registro es temporal y no debe almacenarse en documentación, scripts compartidos ni repositorios.


### Labels del self-hosted runner

El runner de laboratorio utilizaría las siguientes etiquetas:

- self-hosted
- linux
- gh200-lab

Estas labels permiten seleccionar runners por características.

Ejemplo:

```yaml
runs-on: [self-hosted, linux, gh200-lab]


### Comportamiento cuando el self-hosted runner está desconectado

Si un workflow requiere:

```yaml
runs-on: [self-hosted, linux, gh200-lab]


### Mantenimiento y protección del self-hosted runner

Al finalizar una práctica, el runner debería retirarse si ya no va a utilizarse, o mantenerse bajo un procedimiento de actualización y seguridad.

Medidas recomendadas:

- Mantener actualizado el sistema operativo.
- Aplicar parches de seguridad.
- Mantener actualizada la aplicación GitHub Actions Runner.
- Ejecutar el runner con una cuenta dedicada y con privilegios mínimos.
- Restringir qué repositorios pueden utilizarlo mediante runner groups.
- Usar labels para separar capacidades y tipos de runner.
- Evitar almacenar secretos o credenciales persistentes en el host.
- Limpiar workspace, temporales y artefactos entre ejecuciones.
- No permitir que repositorios no confiables ejecuten código en runners sensibles.
- Monitorizar uso, estado y disponibilidad.
- Retirar el runner cuando deje de ser necesario.


### Estrategia para variables, secrets y OIDC

| Tipo de dato | Mecanismo recomendado | Ejemplo |
|---|---|---|
| Configuración no sensible | `vars` | URL de API, nombre de entorno, versión |
| Credencial sensible común al repositorio | Repository secret | API key, token externo |
| Credencial sensible específica de un entorno | Environment secret | clave de staging o producción |
| Credencial compartida entre varios repositorios | Organization secret | token corporativo común |
| Autenticación cloud temporal | OIDC | acceso a Azure, AWS o GCP sin secreto estático |

Criterios:

- Usar `vars` cuando el dato no sea sensible.
- Usar repository secrets cuando la credencial pertenezca al repositorio completo.
- Usar environment secrets cuando la credencial dependa del entorno.
- Usar organization secrets cuando varias aplicaciones necesiten compartir una credencial.
- Preferir OIDC para autenticación cloud cuando el proveedor lo permita, evitando credenciales estáticas de larga duración.


### Estrategia de CI reutilizable para 20 repositorios

La organización dispone de 20 repositorios de aplicaciones con una estructura CI similar:

- checkout del código
- configuración de Node.js
- instalación de dependencias
- ejecución de tests
- build
- publicación de resultados

Para evitar duplicar la misma lógica en todos los repositorios, se propone centralizar la CI en un reusable workflow corporativo.

Ejemplo:

.github/workflows/p2m3_3_reusable-ci.yml

El reusable workflow utilizaría:

```yaml
on:
  workflow_call:


### Diseño de runner groups

Se definen dos grupos de runners self-hosted con distintos niveles de confianza y uso.

#### Runner group: general-ci

Uso:
- Compilación.
- Tests.
- Análisis estático.
- Tareas de CI generales.

Características:
- Sin acceso a recursos sensibles de producción.
- Puede ser utilizado por la mayoría de repositorios de desarrollo.
- Permisos de red limitados.
- Software estándar de desarrollo.
- Preferiblemente runners efímeros o con limpieza estricta entre jobs.

#### Runner group: trusted-production

Uso:
- Despliegues a producción.
- Operaciones que requieren acceso a infraestructura interna sensible.
- Tareas con credenciales de producción.

Características:
- Acceso restringido únicamente a repositorios autorizados.
- Red segmentada y controlada.
- Mantenimiento y parcheo reforzado.
- Ejecución con privilegios mínimos.
- Monitorización y auditoría.
- No debe aceptar workflows procedentes de repositorios no confiables.


### Asignación de repositorios a runner groups

#### general-ci

Podrían utilizar este grupo:

- Repositorios de desarrollo.
- Librerías internas.
- Aplicaciones sin acceso a producción.
- Proyectos que solo necesiten compilar, probar o analizar código.
- Repositorios con workflows de CI estándar.

Ejemplo:

- app-web
- api-clientes
- libreria-comun
- servicio-notificaciones
- gh200-lab

#### trusted-production

Solo podrían utilizar este grupo repositorios expresamente autorizados:

- Repositorios que realizan despliegues a producción.
- Repositorios que necesitan acceso a redes internas sensibles.
- Repositorios que consumen credenciales de producción.
- Repositorios con workflows revisados y controlados.

Ejemplo:

- app-produccion
- backend-produccion
- infraestructura-produccion

No se permitiría acceso general a este runner group.

### Estrategia de secrets por ámbito

#### Organization secrets

Se utilizarían para credenciales comunes a varios repositorios.

Ejemplos:

- Token corporativo para un servicio compartido.
- Credencial común de un sistema de análisis.
- Token para un registry utilizado por varios proyectos.

El acceso debería limitarse únicamente a los repositorios que realmente lo necesiten.

#### Repository secrets

Se utilizarían para credenciales propias de una aplicación o repositorio concreto.

Ejemplos:

- API key exclusiva de una aplicación.
- Token de integración de un proyecto.
- Credencial técnica utilizada únicamente por ese repositorio.

No deberían almacenarse aquí credenciales de producción si pueden limitarse mejor mediante un environment.

#### Environment secrets

Se utilizarían para credenciales específicas de un entorno.

Ejemplos:

Environment staging:
- API_KEY
- DB_PASSWORD
- DEPLOY_TOKEN

Environment production:
- API_KEY
- DB_PASSWORD
- DEPLOY_TOKEN

El workflow puede utilizar el mismo nombre de secret, pero GitHub proporciona el valor correspondiente al environment utilizado.

Los secrets de producción deberían combinarse con reglas de protección del environment, como aprobación previa cuando corresponda.

### Objetivos empresariales pendientes o poco practicados

Tras revisar la guía oficial GH-200 2026, quedan algunos objetivos que se han visto solo de forma conceptual o documental.

#### Pendientes de práctica más profunda

- Aplicar IP allow lists y configuración de red para runners.
- Supervisar runners a escala y diagnosticar problemas de disponibilidad o rendimiento.
- Consultar en detalle las release notes de imágenes de GitHub-hosted runners.
- Trabajar con toolcache y software preinstalado en runners.
- Instalar software adicional en runners de forma controlada.
- Administrar secrets y variables mediante REST API.
- Gestionar componentes reutilizables a nivel de organización real.
- Aplicar políticas de Actions a nivel de organización o enterprise real.

#### Practicado parcialmente

- Runner groups.
- Self-hosted runners.
- Restricción de repositorios que pueden usar determinados runners.
- Organization secrets.
- Environment protections.
- Policies de allow/deny de Actions.

#### Practicado de forma suficiente en el laboratorio

- Reusable workflows.
- workflow_call.
- Inputs y secrets en workflows reutilizables.
- Repository secrets.
- Environment secrets.
- Variables.
- Principio de mínimo privilegio.
- Pinning de actions por SHA.
- Uso de GitHub-hosted runners.
- Labels de runners.


## Resumen de gobierno de GitHub Actions

### Arquitectura de runners

La organización utilizará:

- GitHub-hosted runners para CI estándar.
- Self-hosted runners cuando se necesite acceso a red interna, software específico o mayor control.
- Runner groups para separar usos generales y producción.
- Labels para describir capacidades de los runners.
- Medidas de parcheo, limpieza y aislamiento para runners self-hosted.

### Política de Actions

Se aplicará una política de uso basada en:

- Permitir actions oficiales de GitHub y proveedores aprobados.
- Revisar nuevas dependencias de Actions antes de incorporarlas.
- Utilizar pinning por SHA cuando se requiera mayor inmutabilidad.
- Aplicar mínimo privilegio en `permissions`.
- Evitar actions no confiables en workflows con acceso sensible.

### Reusable workflows

La CI común se centralizará mediante reusable workflows.

Estos workflows podrán recibir:

- inputs
- secrets
- parámetros de configuración

Los repositorios consumidores mantendrán callers pequeños y solo definirán las particularidades de cada proyecto.

### Estrategia de secrets

Los datos se almacenarán según su ámbito:

- `vars`: configuración no sensible.
- Repository secrets: credenciales propias de un repositorio.
- Organization secrets: credenciales compartidas entre varios repositorios.
- Environment secrets: credenciales específicas de staging, production u otros entornos.
- OIDC: autenticación cloud temporal cuando sea posible.

Los secrets no deberán aparecer en logs y los workflows deberán utilizar únicamente los permisos necesarios.


## Checklist de revisión para nuevos workflows

Antes de aprobar un nuevo workflow de GitHub Actions, comprobar:

### Trigger y ejecución
- [ ] El evento `on` es el adecuado.
- [ ] Los filtros de ramas y rutas no son demasiado amplios.
- [ ] No existen ejecuciones innecesarias.
- [ ] `workflow_dispatch` se usa cuando tiene sentido.

### Permisos
- [ ] `permissions` aplica mínimo privilegio.
- [ ] No se concede `write` si solo se necesita `read`.
- [ ] `GITHUB_TOKEN` tiene únicamente los permisos necesarios.

### Actions externas
- [ ] Las actions utilizadas están permitidas por la política de la organización.
- [ ] Se han revisado las dependencias externas.
- [ ] Las actions críticas están fijadas por SHA cuando procede.
- [ ] No se introducen actions de proveedores no confiables.

### Runners
- [ ] Se utiliza el tipo de runner adecuado.
- [ ] Los self-hosted runners están correctamente aislados.
- [ ] Las labels seleccionan las capacidades necesarias.
- [ ] Los runner groups restringen el acceso cuando procede.
- [ ] Los runners sensibles no son accesibles desde repositorios no confiables.

### Secrets y variables
- [ ] Los datos no sensibles utilizan `vars`.
- [ ] Las credenciales utilizan `secrets`.
- [ ] Las credenciales específicas de un entorno utilizan environment secrets.
- [ ] Los secrets no se imprimen en logs.
- [ ] Los secrets se pasan explícitamente a reusable workflows cuando es necesario.
- [ ] Se utiliza OIDC en lugar de credenciales cloud estáticas cuando es posible.

### Reutilización
- [ ] Se ha comprobado si la lógica ya existe en un reusable workflow.
- [ ] No se duplica CI/CD común innecesariamente.
- [ ] Los inputs y outputs están claramente definidos.
- [ ] Los secrets requeridos están documentados.

### Seguridad y mantenimiento
- [ ] No hay credenciales escritas directamente en el YAML.
- [ ] Los datos procedentes de usuarios, issues o PR se consideran entrada no confiable.
- [ ] Los jobs sensibles usan environments y protecciones cuando corresponde.
- [ ] El workflow es comprensible y mantenible.
- [ ] Los steps tienen nombres descriptivos.



## Estado final del documento

Este documento define la estrategia de gobierno de GitHub Actions para la organización.

Incluye:

- Política de uso de Actions.
- Criterios para actions externas y pinning por SHA.
- Estrategia de reusable workflows.
- Arquitectura de GitHub-hosted y self-hosted runners.
- Uso de labels y runner groups.
- Separación entre runners generales y de producción.
- Estrategia de variables y secrets por ámbito.
- Uso de environment protections.
- Principio de mínimo privilegio.
- Uso de OIDC cuando sea apropiado.
- Checklist de revisión para nuevos workflows.

Las decisiones deben revisarse cuando cambien:

- las políticas de GitHub,
- la infraestructura de runners,
- los requisitos de seguridad,
- los repositorios autorizados,
- o los mecanismos de autenticación utilizados.