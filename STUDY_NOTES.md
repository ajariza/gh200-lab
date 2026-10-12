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


## R9 - OIDC con Azure

No se ha realizado una conexión real con Azure.

Para una implementación real serían necesarios:

- `permissions: id-token: write`
- `permissions: contents: read`
- Una aplicación registrada en Microsoft Entra ID.
- Una federated credential que confíe en el repositorio/workflow de GitHub.
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

El workflow utilizaría `azure/login` con OIDC para obtener credenciales temporales, evitando almacenar un `AZURE_CLIENT_SECRET` de larga duración.

## R10 - Prevención de Script Injection en GitHub Actions

En GitHub Actions, algunos valores utilizados dentro de un workflow pueden proceder de datos controlados por usuarios, por ejemplo:

- Título de un pull request.
- Cuerpo de un pull request.
- Título o cuerpo de un issue.
- Comentarios.
- Nombre de una rama.
- Mensajes de commit.
- Valores introducidos mediante eventos o formularios.

Estos datos deben considerarse **no confiables**.

### Riesgo de interpolación directa

Un patrón inseguro sería:

```yaml
- name: Mostrar título del pull request
  run: |
    echo "${{ github.event.pull_request.title }}"


## R11 - Pinning por SHA

Action seleccionada para la práctica:

`actions/setup-node@v4`

Actualmente se referencia mediante un tag mayor (`v4`).

El objetivo del siguiente paso será localizar el commit exacto asociado a una versión estable y sustituir la referencia por el SHA completo.    

## R13 - Optimización mediante caché

Se comparan dos ejecuciones del mismo workflow.

Sin caché:

- `actions/setup-node@v4`
- `npm ci`
- Las dependencias deben descargarse normalmente.

Con caché:

- `actions/setup-node@v4`
- `cache: npm`
- `npm ci`
- GitHub puede reutilizar paquetes descargados previamente.

La primera ejecución puede producir un `cache miss`.
Las siguientes pueden producir un `cache hit`.

La caché reduce principalmente el tiempo de descarga de dependencias, pero no elimina la ejecución de `npm ci`.

Regla GH-200:

Cache = optimización de rendimiento.

Artifact = resultado conservado de una ejecución.


### Optimización de matrices con `exclude`

Una matriz genera el producto de todas sus dimensiones.

Ejemplo:

```text
3 sistemas operativos × 2 versiones Node = 6 jobs


## R13 - Retención, coste y optimización

### `retention-days`

Los artifacts no deben conservarse más tiempo del necesario.

Ejemplo:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
    retention-days: 7


## R14 - Información del runner

Las imágenes de GitHub-hosted runners cambian con el tiempo.

Por eso es útil registrar información del entorno:

```yaml
- name: Registrar información del runner
  run: |
    echo "OS: ${{ runner.os }}"
    echo "Arquitectura: ${{ runner.arch }}"
    node --version || true
    npm --version || true
    python --version || python3 --version || true
    java -version || true    

### Cambios en imágenes de runners

Las imágenes de GitHub-hosted runners no son inmutables.

Etiquetas como:

```yaml
ubuntu-latest
windows-latest
macos-latest    

### Fijar versiones de herramientas críticas

No conviene depender únicamente del software preinstalado en los GitHub-hosted runners.

Ejemplo menos reproducible:

```yaml
runs-on: ubuntu-latest

steps:
  - run: node --version
  - run: npm ci