import fs from 'fs'

export function handleLog(outputFilePath, logText) {
  if(!outputFilePath)
    return console.log(logText)
  
  fs.appendFile(outputFilePath, `${logText}\n`, 'utf-8', error => {
    return error ? console.error(error) : console.log(logText)
  })
}
