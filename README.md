[TOC]

## 自制脚手架cil工具
**目录结构**
=================
```
  |__ bin
    |__ cil
  |__ command
    |__ add.js
    |__ delete.js
    |__ init.js
    |__ list.js
  |__ node_modules
  |__ package.json
  |__ templates.json
```

#### 初始化 
npm init -y && npm install --save -d  chalk co co-prompt commander
#### 入口文件
mkdir bin&&cd bin&&touch cil
```
#!/usr/bin/env node --harmony
'use strict'
 // 定义脚手架的文件路径
process.env.NODE_PATH = __dirname + '/../node_modules/'

const program = require('commander')

 // 定义当前版本
program
    .version(require('../package').version )

// 定义使用方法
program
    .usage('<command>')
program
    .command('add')
    .description('添加新的模板')
  .alias('a')
  .action(() => {
    require('../command/add')()
  })

program
    .command('list')
    .description('模板列表')
    .alias('l')
    .action(() => {
        require('../command/list')()
    })

program
    .command('init')
    .description('创建新项目')
  .alias('i')
  .action(() => {
    require('../command/init')()
  })

program
    .command('delete')
    .description('删除一个模板')
    .alias('d')
    .action(() => {
        require('../command/delete')()
    })

program.parse(process.argv)
if(!program.args.length){
  program.help()
}

```

node运行这个文件: node bin/cil


#### 处理用户输入
mkdir command && touch command/add.js command/delete.js command/list.js command/init.js templates.json

**templates.json**
```json
{"tpl":{}}
```

**添加模板**touch command/add.js
```js
'use strict'
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')
const fs = require('fs')

module.exports = () => {
 co(function *() {

   // 分步接收用户输入的参数
   let tplName = yield prompt('模板名: ')
   let gitUrl = yield prompt('Git https link: ')
   let branch = yield prompt('分支: ')
    
   // 避免重复添加
   if (!config.tpl[tplName]) {
     config.tpl[tplName] = {}
     config.tpl[tplName]['url'] = gitUrl.replace(/[\u0000-\u0019]/g, '') // 过滤unicode字符
     config.tpl[tplName]['branch'] = branch
   } else {
     console.log(chalk.red('模板已存在!'))
     process.exit()
   }
   
   // 把模板信息写入templates.json
   fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config), 'utf-8', (err) => {
     if (err) console.log(err)
     console.log(chalk.green('模板已添加!\n'))
     console.log(chalk.grey('模板列表: \n'))
     console.log(config)
     console.log('\n')
     process.exit()
    })
 })
}
```
**删除模板** touch command/delete.js
```js
'use strict'
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')
const fs = require('fs')

module.exports = () => {
    co(function *() {
        // 接收用户输入的参数
        let tplName = yield prompt('模板名: ')

        // 删除对应的模板
        if (config.tpl[tplName]) {
            config.tpl[tplName] = undefined
        } else {
            console.log(chalk.red('× 模板不存在!'))
            process.exit()
        }
        
        // 写入template.json
        fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config),     'utf-8', (err) => {
            if (err) console.log(err)
            console.log(chalk.green('模板已删除!'))
            console.log(chalk.grey('模板列表: \n'))
            console.log(config)
            console.log('\n')
            process.exit()
        })
    })
}
```
**罗列模板**  touch command/list.js
```js
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
```
**构建项目** touch command/init.js
```js
'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')

module.exports = () => {
    console.log(chalk.white('\n模板列表：'))
     for(var i in config.tpl){
    console.log(chalk.green(`\n ${i}   ${config.tpl[i].url}`));
    }
 co(function *() {
    // 处理用户输入
      let tplName = yield prompt('输入模板名: ')
      let projectName = yield prompt('输入项目名: ')
      let gitUrl
      let branch

    if (!config.tpl[tplName]) {
        console.log(chalk.red('\n × 模板不存在!'))
        process.exit()
    }
    gitUrl = config.tpl[tplName].url
    branch = config.tpl[tplName].branch

    // git命令，远程拉取项目并自定义项目名
    let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`

    console.log(chalk.white('\n 开始创建...'))

    exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        process.exit()
      }
      console.log(chalk.green('\n √ 创建完成!'))
      console.log(`\n cd ${projectName} && npm install \n`)
      process.exit()
    })
  })
}
```

#### 全局使用  
package.json
```json
"bin": {
    "cil": "bin/cil"
  },
```
**本地调试：**`npm link`  
**使用：**

```js
# 添加模板
cil add
# 模板列表
cil list
# 创建项目
cil init
# 删除模板
cil delete
```

#### 其他：
[是时候来用 Slush 构建你自己的脚手架了](https://zhuanlan.zhihu.com/p/25516863){:target="_blank"}





#
#
#### 浏览器自动刷新
<meta http-equiv="refresh" content="1">