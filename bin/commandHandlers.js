const fs = require('fs')
const path= require('path')
const functions = require('./functions')

exports.handleInstall = async function (username , repo_name){
    try{
        const url = `https://codeload.github.com/${username}/${repo_name}/zip/main`
        let curr_dir =  path.dirname(__filename)
        let index = functions.nth_occurrence(curr_dir , String.fromCharCode(92) , 3)
        let target_dir = `${curr_dir.substring(0 , index)}\\gdmm\\modules\\${repo_name}`
        if(functions.modExists(target_dir)){
            console.log("The module is already installed")
            return
        }
        const res = await functions.downloadCode(url , './temp.zip')
        console.log(res)
        console.log("Beginning to unzip downloaded files")
        target_dir = `${curr_dir.substring(0 , index)}\\gdmm\\modules`
        functions.extractArchive('./temp.zip' , target_dir)
         // rename the dir
        let currentPath = target_dir +"\\" + repo_name + '-main'
        let newPath = target_dir + "\\"+ repo_name
        fs.renameSync(currentPath , newPath)
        await functions.deleteDir('./temp.zip')
        let data  = await functions.readFile(newPath+'\\setup.json')
        data = JSON.parse(data)
        console.log("Installing dependencies will take some time. Do not kill The terminal !!!")
        const instRes = await functions.installDependencies(data.dependencies , data.pckg_manager)
        console.log(instRes)
        console.log("Module installed successfully")
    }catch(err){
        console.log(err)
    }
}
