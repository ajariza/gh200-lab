# gh200-lab
[![CD](https://github.com/ajariza/gh200-lab/actions/workflows/cd.yml/badge.svg)](https://github.com/ajariza/gh200-lab/actions/workflows/cd.yml)
Laboratorio personal para GitHub Actions GH-200
## Objetivos de automatización

Durante este laboratorio iremos automatizando progresivamente las siguientes tareas:

- Instalar las dependencias del proyecto.
- Ejecutar las pruebas automáticas.
- Construir la aplicación.
- Empaquetar los artefactos generados.
- Desplegar la aplicación.

### Tareas que no deberían depender de una persona

- Comprobar que el código compila correctamente.
- Ejecutar automáticamente los tests.
- Validar los cambios antes de hacer merge a `main`.
- Generar los artefactos de la aplicación.
- Evitar desplegar una versión si las pruebas fallan...

## Estrategia de publicación en GitHub Container Registry

La imagen del proyecto se publicará en:

`ghcr.io/ajariza/gh200-lab`

Se utilizarán los siguientes tags:

- SHA del commit, para garantizar trazabilidad exacta.
- Versión semántica (`MAJOR.MINOR.PATCH`) cuando se publique una versión estable.

Ejemplos:

- `ghcr.io/ajariza/gh200-lab:3f8a21c`
- `ghcr.io/ajariza/gh200-lab:1.0.0`


## Tipos de artefactos y paquetes

| Tipo | Duración prevista | Consumidor | Ejemplo |
|---|---|---|---|
| Source | Permanente mientras exista en el repositorio | Desarrolladores, CI | `src/`, `package.json` |
| Workflow artifact | Temporal, ligado a ejecuciones y retención configurada | Jobs posteriores, desarrolladores, auditoría puntual | `dist/`, ZIP de build, logs |
| Container package | Persistente y versionado en un registry | Entornos de despliegue, otros equipos, servidores | `ghcr.io/ajariza/gh200-lab:1.0.0` |