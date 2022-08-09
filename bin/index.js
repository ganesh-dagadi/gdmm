#!/usr/bin/env node
const argv = require("yargs/yargs")(process.argv.slice(2))
  .option("command", {
    alias:'-c',
    describe: "Command supported : (install)"
  })
  .option("username" , {
    alias : '-u',
    describe:"Your github username"
  })
  .option("repo" , {
    alias: '-r',
    describe : "Github repo name"
  })
  .demandOption(["command" , "username" , "repo"], "Please specify the url to install")
  .help().argv;

let command = argv.command
let username = argv.username
let repo_name = argv.repo

const cmdHandle = require('./commandHandlers')
// const command = 'install'
// const username = 'ganesh-dagadi'
// const repo_name = 'stock_sim_backend'

const url = `https://codeload.github.com/${username}/${repo_name}/zip/main`

if(command == 'install'){
    cmdHandle.handleInstall(username , repo_name)
}else{
    console.log("Command not supported")
}
