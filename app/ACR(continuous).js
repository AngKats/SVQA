//---DONE TEST-------------------------------------------------------

/* Sliders --------------------------------------------  */
var clicked;
var elem = document.querySelector('input[name="range1"]');
//var text = document.querySelector("#gooce1");
var target = document.querySelector('.value');
var score;
var rangeValue = function(){
    var newValue = elem.value;
    score = newValue;
    target.innerHTML = newValue;
    clicked = true;
}
elem.addEventListener("input", rangeValue);


var spawn = require('child_process').spawn;
var proc;
var cmd = 'mpv/mpv';
//var cmd = 'ffmpeg/bin/ffplay.exe';
var readExp = fs.readFileSync("../Experiments/Experiment.last",'utf8');
var readFiles = fs.readFileSync("../Experiments/" + readExp + "/" + readExp + '(config)' + ".csv",'utf8');
var readUserName = fs.readFileSync("../Experiments/" + readExp + "/user.last", 'utf8');
var presMethod = (readFiles.split('\n'))[1].split(',')[1];
var trialRun = fs.existsSync("../Experiments/" + readExp + "/" + readUserName + "/" + readUserName + ".test");
var fileLength;
var breakTime=0;

//alert(trialRun);
/* try { -------------------------------------------------------- COMMENTED FOR DEBUGGING
    fs.unlinkSync("../Experiments/" + readExp + "/user.last")
    //file removed
} catch(err) {
    console.error(err)
} */

var FileListwName = readFiles.split('\n');
var FileNames = FileListwName[2].split(',');
var TrainingFileNames = FileListwName[3].split(',');
var videoFormat = FileListwName[4].split(',');
videoFormat.splice(0,1);
FileNames.splice(0,1);
TrainingFileNames.splice(0,1);
var x=0;
var vN;
var allScores = ["Video name", "Score"];
var getScores = [];
var noScore = 0;
var totalVideoTime = 0;
var totalVideoTimeM = 0;
var breakNum;

function getBreakNum(){
    for (i=0;i<FileNames.length;i++){
        totalVideoTime = totalVideoTime + 5 + parseInt(FileNames[i].split('_')[5])/parseInt(FileNames[i].split('_')[2]);
    }
    Math.round(totalVideoTime)
    totalVideoTimeM = parseInt(totalVideoTime/60);
    breakNum = Math.round(totalVideoTimeM/30);
}

if(trialRun){
    document.getElementById("text").textContent = "Training phase is starting now, get ready!";
}

getBreakNum();
shuffle(FileNames);
setTimeout(function(){play(trialRun);}, 2000)

function play(testTrial){
    vN = x+1;
    if(testTrial){
        FFileNames = TrainingFileNames[x].substring(0, TrainingFileNames[x].length - 4)
        fileLength = TrainingFileNames.length;
        var ppath = '../trainingSequences/' + FFileNames + videoFormat
        noScore = 1;
        
    }else{
        noScore = 0;
        FFileNames = FileNames[x].substring(0, FileNames[x].length - 4)
        fileLength = FileNames.length;
        var ppath = '../converted/' + FFileNames + videoFormat
    }
    setTimeout(function(){
        rateVideo();
    },2500)
    var args = [
        '-fs',
        '--ontop',
        '--osc=no',
        '--no-input-default-bindings',
        '--framedrop=no',
        '--priority=realtime',
        ppath
    ]; 
    
    /* var args = [
        '-autoexit',
        '-fs', 
        '-i', ppath
    ]; */
    
    watchVideo();
    setTimeout(function(){
        proc = spawn(cmd, args);
        proc.on('exit', function (code) { 
            proc = null;
            $('input[name="range1"]').focus();
        });
    }, 2000)
}

$('#continue').click(function () {
    if(breakNum > 0 && breakTime == Math.floor(fileLength/breakNum)-1 && !trialRun && x < (fileLength-2) ){
        breakTimeF();
        breakTime = 0;
    } else { 
        if (x < fileLength-1){
            if (clicked == true){
                if (noScore == 0){
                    getScores.push([FFileNames,score]);}
                    $('#continue').prop('disabled', true);
                    x = x + 1;
                    breakTime = breakTime + 1;
                    clicked = false;
                    setTimeout(function(){
                        document.querySelector('input[name="range1"]').value = 50;
                        target.innerHTML = "";
                        enableButton();
                    },2000)
                    play(trialRun);
                }else{
                    swal.fire({
                        text: 'You have not selected a score, please select one to continue!' ,
                        type:'error'
                    });}
                } else if(x == fileLength-1){
                    if(clicked == true){
                        if (noScore == 0){
                            getScores.push([FFileNames,score])}
                            $('#continue').prop('disabled', true);
                            finish();
                            setTimeout(function(){
                                enableButton();
                                $("#continue").focus();
                            },250)
                            x = x + 1;
                        } else{
                            swal.fire({
                                text: 'You have not selected a score, please select one to continue!' ,
                                type:'error'
                            });}
                        } else {
                            if(!trialRun){
                                mainW.mainWindow();
                                win.close();
                            } else {
                                try{
                                    fs.unlinkSync("../Experiments/" + readExp + "/" + readUserName + "/" + readUserName + ".test")
                                    //file removed
                                } catch(err) {
                                    console.error(err)
                                }
                                
                                swal.fire({
                                    title: 'Well done, you finished with the training. Are you ready for the testing phase?',
                                    text: "If you click cancel your personal information will be deleted!",
                                    type: 'info',
                                    showCancelButton: true,
                                    allowOutsideClick: false,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Start!'
                                }).then((result) => {
                                    if (result.value) {
                                        swal.fire({
                                            title: 'Starting the testing phase, get ready!',
                                            type: 'info',
                                            showCancelButton: false,
                                            confirmButtonColor: '#3085d6',
                                            allowOutsideClick: false,
                                            onClose: startRealPres,
                                            confirmButtonText: 'OK!'
                                        })
                                    } else{
                                        // UNLINK PERSONAL INFORMATION!
                                        mainW.mainWindow();
                                        win.close();
                                    }
                                })
                                
                                function startRealPres(){
                                    mainW.presWindow(presMethod);
                                    win.close();
                                }
                            }
                        }
                    }
                })
                
                function enableButton() {
                    if($("#continue").is(":disabled")){
                        $('#continue').prop('disabled', false);     
                    }
                }
                
                function rateVideo(){
                    if (x < fileLength){   
                        setTimeout(function(){
                            document.getElementById("text").style.visibility = "visible";
                            document.getElementById("text").textContent = "Please rate video " + vN + " of " + fileLength;
                            document.getElementById("slider").style.visibility = "visible";
                            document.getElementById("buttons").style.visibility = "visible";
                        }, 1000);
                    }
                }
                
                function watchVideo(){
                    document.getElementById("text").style.visibility = "visible";
                    document.getElementById("text").textContent = "Starting video " + vN;
                    document.getElementById("slider").style.visibility = "hidden";
                    document.getElementById("buttons").style.visibility = "hidden";
                }
                
                function breakTimeF(){
                    setTimeout(function(){
                        document.getElementById("slider").style.visibility = "hidden"
                        document.getElementById("text").textContent = "Time for a break!\r\n Press continue when ready to start with the second half!"
                        document.getElementById("text").style.visibility = "visible";
                    }, 200)
                }
                
                function finish(){
                    if (noScore == 0){
                        var unsorted = getScores.slice();
                        unsorted.unshift(allScores);
                        const csvStringu = toCsv(unsorted);
                        fs.writeFileSync("../Experiments/" + readExp + "/" + readUserName + "/"  + "score(presentationOrder).csv", csvStringu, 'utf8');
                        getScores.sort();
                        getScores.unshift(allScores);
                        const csvString = toCsv(getScores);
                        fs.writeFileSync("../Experiments/" + readExp + "/" + readUserName + "/" + "score.csv", csvString, 'utf8');
                    }
                    setTimeout(function(){
                        $("#slider").remove();
                        if(!trialRun){
                            document.getElementById("text").textContent = "End of experiment, please press continue to finish!"
                        } else{
                            document.getElementById("text").textContent = "End of training, please press continue to proceed to testing!"
                        }
                        document.getElementById("text").style.visibility = "visible";
                    }, 200)
                }

                $('#myRange1').keyup(function(event){
                    if (event.keyCode === 13) {
                        //event.preventDefault();
                        $("#continue").click();
                    }
                })