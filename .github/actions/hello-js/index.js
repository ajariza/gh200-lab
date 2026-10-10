const core = require('@actions/core');

try {
  const name = core.getInput('name');

  const greeting = `Hola ${name}`, bienvenido a GH-200;

  console.log(greeting);

  core.setOutput('greeting', greeting);
} catch (error) {
  core.setFailed(error.message);
}