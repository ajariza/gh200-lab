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