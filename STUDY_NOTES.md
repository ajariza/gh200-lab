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