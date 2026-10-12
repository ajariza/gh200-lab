## P2M2 - Comparativa de tipos de acciones personalizadas

| Tipo de action | `runs.using` | Cuándo usarla | Ventajas | Inconvenientes |
|---|---|---|---|---|
| Composite | `composite` | Para agrupar varios steps/actions/comandos existentes | Simple, reutilizable, fácil de mantener | Menos adecuada para lógica compleja |
| JavaScript | `node20` / `node24` | Para lógica propia, validaciones, llamadas a APIs y manejo de errores | Rápida, multiplataforma, flexible | Hay que gestionar dependencias Node |
| Docker | `docker` | Cuando necesitas un entorno controlado con runtime, binarios o librerías concretas | Entorno reproducible y aislado | Más pesada y más lenta de arrancar |

### Recordatorios

- Una action se define mediante `action.yml`.
- Composite: agrupa steps.
- JavaScript: ejecuta código JS/Node.
- Docker: ejecuta dentro de una imagen/contenedor.
- `core.getInput()` lee inputs.
- `core.setOutput()` publica outputs.
- `core.setFailed()` marca la action como fallida.
- Para máxima seguridad, las actions externas pueden fijarse a un SHA completo.

## R7 - Starter workflows vs reusable workflows vs composite actions

| Característica | Starter workflow | Reusable workflow | Composite action |
|---|---|---|---|
| Qué reutiliza | Plantilla de workflow | Jobs completos | Steps |
| Dónde se usa | Al crear/configurar un workflow nuevo | Dentro de `jobs` | Dentro de `steps` |
| Sintaxis principal | Plantilla copiada al repositorio | `uses:` a nivel de job | `uses:` a nivel de step |
| Puede definir jobs | Sí, como workflow completo | Sí | No |
| Puede definir steps | Sí | Sí | Sí |
| Se actualiza centralmente | No necesariamente; se copia | Sí, si se referencia centralmente | Sí, si se referencia centralmente |
| Caso de uso típico | Dar un punto de partida estándar | Reutilizar CI/CD común | Encapsular una secuencia de pasos |

## R7 - Comparativa de mecanismos de reutilización

| Aspecto | Starter workflow | Reusable workflow | Composite action |
|---|---|---|---|
| Unidad de reutilización | Workflow completo como plantilla inicial | Jobs completos y lógica de workflow | Steps |
| Sintaxis de llamada | No se llama; se copia/genera como punto de partida | `uses:` a nivel de `job` | `uses:` dentro de `steps` |
| Versionado centralizado | No necesariamente, porque la plantilla queda copiada | Sí, mediante referencia `@branch`, `@tag` o `@SHA` | Sí, mediante referencia `@branch`, `@tag` o `@SHA` |
| Puede definir jobs | Sí, como cualquier workflow normal | Sí | No |
| Puede definir steps | Sí | Sí | Sí |
| Recibe inputs | Como workflow normal, por ejemplo `workflow_dispatch` | Sí, mediante `workflow_call.inputs` | Sí, mediante `action.yml` |
| Recibe secrets | Como workflow normal | Sí, mediante `workflow_call.secrets` | No como interfaz `workflow_call`; usa el contexto del workflow llamador |
| Caso de uso | Dar una plantilla estándar para nuevos repositorios | Centralizar CI/CD común entre repositorios | Encapsular una secuencia repetida de pasos |

### Ejemplos reales del laboratorio

#### Starter workflow
No hemos creado uno específico en este laboratorio, pero conceptualmente sería una plantilla inicial que una organización ofrece para que nuevos repositorios creen un workflow estándar.

Ejemplo:
- Plantilla corporativa de CI para proyectos Node.js.

#### Reusable workflow
Ejemplo real del laboratorio:

`.github/workflows/p2m3_3_reusable-ci.yml`

Este workflow se invoca desde otro workflow mediante `uses` a nivel de job.

También hemos creado:

`.github/workflows/r1_reusable-deploy.yml`

que recibe inputs y secrets mediante `workflow_call`.

#### Composite action
Ejemplo real del laboratorio:

`.github/actions/quality-gate/action.yml`

Se utiliza dentro de `steps` y encapsula una secuencia reutilizable de pasos.