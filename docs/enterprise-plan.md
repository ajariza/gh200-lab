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

