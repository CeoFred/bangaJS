const chalk = require('chalk');
const ejs = require("ejs")
const path = require("path")
const FM = require("./../utils/file-manager")
const TextFormatter = require("./../utils/text-formatter")
const help = require("./help")
const ARGS = process.ARGS

const types = ["controller", "model", "route", "service"]
const alias = {
     a: "asset",
     asset: "asset",
     c: "controller",
     controller: "controller",
     m: "model",
     model: "model",
     r: "route",
     route: "route",
     s: "service",
     service: "service"
}


async function createFile() {
     //TODO: check for invalid file name

     const { $type, $name } = ARGS
     const templatePath = path.join(__dirname, `./../templates/${$type}.ejs`)
     const data = await ejs.renderFile(templatePath, ARGS, {})

     const newFile = await FM.create(null, data)

     //Log to the console on successful file creation
     console.log(`${chalk.green("CREATE")}: ${chalk.bold($name)} ${chalk.bold($type)} - ${chalk.underline(newFile.full)}`)
}

async function createAsset() {
     for (const type of types) {
          ARGS.$type = type
          await createFile()
     }
}

module.exports = async (type, name) => {
     try {
          // Check if name and type
          if (!ARGS._[1] && !name) throw new Error(`banga: "<type>" is required`)
          if (!ARGS._[2] && !type) throw new Error(`banga: "<name>" is required`)

          type = type ? alias[type] : alias[ARGS._[1]]
          name = name ? TextFormatter(name) : TextFormatter(ARGS._[2])

          if (!alias[type]) {
               throw new Error(`banga: '${ARGS._[1]}' is not a recognised type or alias`)
          }

          ARGS.$type = type
          ARGS.$name = name

          if (type == "asset") {
               await createAsset()
          } else {
               await createFile()
          }
     } catch (error) {
          console.log(error)
          help()
     }
}