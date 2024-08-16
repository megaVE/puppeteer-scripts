export function configureCleanUp(cleanUpFunction) {
  process.on('exit', async () => {
    await cleanUpFunction()
    process.exit(0)
  })
  
  process.on('SIGTERM', async () => {
    await cleanUpFunction()
    process.exit(0)
  })
  
  process.on('uncaughtException', async () => {
    await cleanUpFunction()
    process.exit(1)
  })
}
