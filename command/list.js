'use strict'
const config = require('../templates')
const chalk = require('chalk')

module.exports = () => {
	 console.log(chalk.white('\n模板列表：'))
     for(var i in config.tpl){
    console.log(chalk.green(`\n ${i}   ${config.tpl[i].url}`));
    }  
     process.exit()
}