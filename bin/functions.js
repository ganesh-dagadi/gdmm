const https = require("https")
const fs = require('fs')
const admZip = require('adm-zip')


exports.modExists = function(path){
    try {
        if(fs.existsSync(path)){
            return true
        }else{
            return false
        }
      } catch (err) {
        throw new Error(err)
      }
} 
exports.downloadCode = function (url , dest){
    return new Promise((resolve , reject)=>{
       https.get(url , function(res){
            if(res.statusCode == 200){
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', function () {
                file.close((err)=>{
                    if(err) reject(err)
                    else resolve("Download complete")
                });  // close() is async, call cb after close completes.
            });
            }else if(res.statusCode == 404){
                reject("No such repository found")
            }else{
                reject("Something went wrong")
            }
       }).on('error' , function(error){
            reject(error)
       })
    })
}
exports.extractArchive = async function(filepath , dest) {
    try {
      const zip = new admZip(filepath);
      const outputDir = dest;
      zip.extractAllTo(outputDir);
  
      console.log(`Extracted to "${outputDir}" successfully`);
    } catch (e) {
      console.log(`Something went wrong. ${e}`);
    }
  }
exports.nth_occurrence = function (string, char, nth) {
    var first_index = string.indexOf(char);
    var length_up_to_first_index = first_index + 1;

    if (nth == 1) {
        return first_index;
    } else {
        var string_after_first_occurrence = string.slice(length_up_to_first_index);
        var next_occurrence = exports.nth_occurrence(string_after_first_occurrence, char, nth - 1);

        if (next_occurrence === -1) {
            return -1;
        } else {
            return length_up_to_first_index + next_occurrence;  
        }
    }
}
exports.deleteDir = function (path){
    return new Promise((resolve , reject)=>{
        fs.rm(path , {recursive : true} , (err)=>{
            if(err) reject(err)
            else resolve()
        })
    })
}

exports.readFile = function(filePath){
    return new Promise((resolve , reject)=>{
        fs.readFile(filePath , (err , data)=>{
            if(err) reject(err)
            else{
                resolve(data.toString())      
            }
        })       
    })
}

const {exec} = require('child_process')

function installPackage(command , name){
    return new Promise((resolve , reject)=>{
        exec(command , (err , stdout , stderr)=>{
            if(err) reject(err)
            else{
                console.log(`Installed ${name}`)
                resolve()
            }
        })
    })
}

exports.installDependencies = async function (dependencies){
    return new Promise((resolve , reject)=>{
        promises = []
        dependencies.forEach(dependency=>{
            switch (dependency.pckg_manager) {
                case 'pip3':                    
                    promises.push(installPackage(`pip3 install -Iv ${dependency.name}==${dependency.version}` , dependency.name))
                    break;
                case 'gdmm':
                    promises.push(installPackage(`gdmm -c install -r ${dependency.name} -u ${dependency.username}` , dependency.name))
                    break
                default:
                    console.log("Package manager not supported")
                    break;
            }
        })
        Promise.all(promises)
        .then(result=>{
            resolve('All dependencies installed')
        }).catch(err=>{
            reject(err)
        }) 
    })
}
