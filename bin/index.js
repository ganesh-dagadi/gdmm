#!/usr/bin/env node
const admZip = require('adm-zip')
const path = require('path')
const fs = require('fs')
const https = require('https')
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

const path = require('path')

const url = `https://codeload.github.com/${username}/${repo_name}/zip/main`

const functions = require('./functions')

async function handleInstall(url){
    try{
        const res = await functions.downloadCode(url , './temp.zip')
        console.log(res)
        console.log("Beginning to unzip downloaded files")
        curr_dir =  path.dirname(__filename)
        index = functions.nth_occurrence(curr_dir , String.fromCharCode(92) , 3)
        target_dir = `${curr_dir.substring(0 , index)}\\gdmm\\modules`
        functions.extractArchive('./temp.zip' , target_dir)
         // rename the dir
        currentPath = target_dir +"\\" + repo_name + '-main'
        newPath = target_dir + "\\"+ repo_name
        fs.renameSync(currentPath , newPath)
        console.log("The module has been installed successfully")
    }catch(err){
        console.log(err)
    }
}
if(command == 'install'){
    handleInstall(url)
}else{
    console.log("Command not supported")
}
