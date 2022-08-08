const https = require("https")
const fs = require('fs')
const admZip = require('adm-zip')
function downloadCode(url , dest){
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
exports.downloadCode = downloadCode
exports.extractArchive = extractArchive
exports.nth_occurrence = nth_occurrence