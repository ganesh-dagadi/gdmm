#!/usr/bin/env node
const argv = require("yargs/yargs")(process.argv.slice(2))
  .option("command", {
    alias:'-c',
    describe: "Command supported : (install , run , setup)"
  })
  .option("username" , {
    alias : '-u',
    describe:"Your github username"
  })
  .option("repo" , {
    alias: '-r',
    describe : "Github repo name"
  })
  .option("local" , {
    alias: '-l',
    describe : "install or run the application in current directory"
  })
  .demandOption(["command"], "Please specify the command")
  .help().argv;

let command = argv.command
let username = argv.username
let repo_name = argv.repo
let in_local = argv.local

const cmdHandle = require('./commandHandlers')
// const command = 'install'
// const username = 'ganesh-dagadi'
// const repo_name = 'stock_sim_backend'

const url = `https://codeload.github.com/${username}/${repo_name}/zip/main`

switch(command){
  case 'install':
    if(!username || !repo_name){
        console.log("Provide both username and repository name")
        break
    }else{
      let location
      if(in_local){
        location = 'local'
      }else{
        location = 'global'
      }
      cmdHandle.handleInstall(username , repo_name , location)
      break
    }
  case 'run':
      let location
      if(in_local){
        location = 'local'
      }else{
        if(!repo_name){
          console.log("Please provide repository name")
          break
        }
        location = 'global'
      }
      code = cmdHandle.handleRun(location , repo_name)
      break
  case 'setup':
    cmdHandle.handleSetup()
    break;
  default:
    console.log("Command not supported")
    break
}
