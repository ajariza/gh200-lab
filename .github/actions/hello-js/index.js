const core = require('@actions/core');

try {
  const name = core.getInput('name');

  if (!name) {
    core.setFailed('El input name es obligatorio');
    return;
  }

  const greeting = `Hola ${name}`;

  core.info(greeting);

  core.setOutput('greeting', greeting);
} catch (error) {
  core.setFailed(error.message);
}