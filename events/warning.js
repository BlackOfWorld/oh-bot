const chalk = require('chalk');
module.exports = (client, warn) => {
  console.log(chalk.bgYellow(`Warning has been issued: ${warn}`));
};