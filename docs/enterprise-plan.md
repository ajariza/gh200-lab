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