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

const url = `https://codeload.github.com/${username}/${repo_name}/zip/main`

function download(url, dest, cb) {
    console.log("Download started")
    const file = fs.createWriteStream(dest);
    const request = https.get(url, function (response) {
        console.log(response.statusCode)
        if(response.statusCode == 404){
            error = Error("Repo not found")
            return cb(error)
        }
        if(response.statusCode !== 200){
            error = Error("Something went wrong")
            return cb(error)
        }
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb('Download complete'));  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};

function nth_occurrence (string, char, nth) {
    var first_index = string.indexOf(char);
    var length_up_to_first_index = first_index + 1;

    if (nth == 1) {
        return first_index;
    } else {
        var string_after_first_occurrence = string.slice(length_up_to_first_index);
        var next_occurrence = nth_occurrence(string_after_first_occurrence, char, nth - 1);

        if (next_occurrence === -1) {
            return -1;
        } else {
            return length_up_to_first_index + next_occurrence;  
        }
    }
}

async function extractArchive(filepath , dest) {
  try {
    const zip = new admZip(filepath);
    const outputDir = dest;
    zip.extractAllTo(outputDir);

    console.log(`Extracted to "${outputDir}" successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

if(command == 'install'){
    dest = './temp.zip'
    download(url , dest , function(res , err){
        if(err){
            console.log(err.message)
        }else{
            console.log(res)
            console.log("Unzipping")
            curr_dir =  path.dirname(__filename)
            index = nth_occurrence(curr_dir , String.fromCharCode(92) , 3)
            target_dir = `${curr_dir.substring(0 , index)}\\gdmm\\modules`
            extractArchive('./temp.zip' , target_dir)
            // rename the dir
            currentPath = target_dir +"\\" + repo_name + '-main'
            newPath = target_dir + "\\"+ repo_name
            fs.renameSync(currentPath , newPath)
            console.log("The module has been installed successfully")
        }
    })
}else{
    console.log("Invalid command")
}