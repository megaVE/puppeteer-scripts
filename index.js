// import { runFinder } from "./src/finder.js"
import { runReserver } from "./src/reserver.js"

const args = process.argv.slice(2)
const [script] = args

async function runScript(scriptFunction) {
  console.log(`${script} script starting...`)
  await scriptFunction()
  console.log(`${script} script finished.`)
}

switch(script) {
  case "finder":
    // await runScript(runFinder)
    break
  
  case "reserver":
    await runScript(runReserver)
    break

  default:
    console.error(`Invalid script entered: ${script}.`)
}
