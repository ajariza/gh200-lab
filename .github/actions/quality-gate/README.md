# Quality Gate

Acción personalizada de GitHub para validar la calidad básica del proyecto.

## Propósito

La action realiza las siguientes operaciones:

1. Configura la versión de Node.js indicada.
2. Instala las dependencias con `npm ci`.
3. Ejecuta las pruebas con `npm test`.
4. Ejecuta el build con `npm run build`.
5. Devuelve el resultado `status=passed` si todas las operaciones finalizan correctamente.

## Inputs

### `node-version`

Versión de Node.js que se utilizará.

Ejemplo:

```yaml
node-version: '22'