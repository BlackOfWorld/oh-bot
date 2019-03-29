const chalk = require('chalk');
module.exports = (client, error) => {
  console.log(chalk.bgRed(`Error has been throwed: ${error.message} at ${error.fileName}:${error.lineNumber}`));
};