const fs = require('fs')
const path= require('path')
const process = require('process')
const {spawn} = require('child_process')
const functions = require('./functions')


exports.handleInstall = async function (username , repo_name ,location){
    try{
        const url = `https://codeload.github.com/${username}/${repo_name}/zip/main`
        let curr_dir =  process.cwd()
        let index = functions.nth_occurrence(curr_dir , String.fromCharCode(92) , 3)
        let target_dir
        if(location == 'global'){
            target_dir = `${curr_dir.substring(0 , index)}\\gdmm\\modules\\${repo_name}`
        }else{
            target_dir = `${curr_dir}\\${repo_name}`
        }
       
        if(functions.modExists(target_dir)){
            console.log("The module is already installed")
            return
        }
        const res = await functions.downloadCode(url , './temp.zip')
        console.log(res)
        console.log("Beginning to unzip downloaded files")
        if(location == 'global'){
            target_dir = `${curr_dir.substring(0 , index)}\\gdmm\\modules`
        }else{
            target_dir = curr_dir
        }
        functions.extractArchive('./temp.zip' , target_dir)
         // rename the dir
        let currentPath = target_dir +"\\" + repo_name + '-main'
        let newPath = target_dir + "\\"+ repo_name
        fs.renameSync(currentPath , newPath)
        await functions.deleteDir('./temp.zip')
        let data  = await functions.readFile(newPath+'\\setup.json')
        data = JSON.parse(data)
        console.log("Installing dependencies will take some time. Do not kill The terminal !!!")
        const instRes = await functions.installDependencies(data.dependencies)
        console.log(instRes)
        console.log("Module installed successfully")
    }catch(err){
        console.log(err)
    }
}

exports.handleRun = async function(location , repo_name){
    let curr_dir =  process.cwd()
    let index = functions.nth_occurrence(curr_dir , String.fromCharCode(92) , 3)
    let target_dir
    if(location == 'global'){
        target_dir = `${curr_dir.substring(0 , index)}\\gdmm\\modules\\${repo_name}`
    }else{
        target_dir = curr_dir
    }
    process.chdir(target_dir)
    let data  = await functions.readFile(target_dir+'\\setup.json')
    data = JSON.parse(data)
    
    run = data.run

    if(run == undefined){
        console.log("This module does not support run")
        return 
    }
    run.indexOf(' ')
    let command = run.substring( 0 ,run.indexOf(' '))
    let arguments = [`${run.substring(run.indexOf(' ') + 1)}`]

    const call = spawn(command , arguments)
    call.stdout.on('data' , (data)=>{
        console.log(data.toString())
    })
    call.stdout.on('error' , (err)=>{
        console.log("An error occured" , err)
    })
    call.on('close' , (code)=>{
        console.log(`The program exited with code : ${code}`)
    })
}


exports.handleSetup = async function(){
    let curr_dir =  process.cwd()
    let data  = await functions.readFile(curr_dir+'\\setup.json')
    data = JSON.parse(data)  
    const setup = data.install
    let arguments = await functions.getUserInput(setup)
    let command = data.install.run.substring( 0 ,data.install.run.indexOf(' '))
    arguments.unshift(data.install.run.substring(data.install.run.indexOf(' ') + 1))
    const call = spawn(command , arguments)
    call.stdout.on('data' , (data)=>{
        console.log(data.toString())
    })
    call.stdout.on('error' , (err)=>{
        console.log("An error occured" , err)
    })
    call.on('close' , (code)=>{
        console.log(`The program exited with code : ${code}`)
    })
}   