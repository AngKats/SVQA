/* Sliders --------------------------------------------  */
var clicked;
var clicked2;
var elem = document.querySelector('input[name="range1"]');
var elem2 = document.querySelector('input[name="range2"]');
var target = document.querySelector('.value');;
var target2 = document.querySelector('.value2');;
var rangeValue = function(){
    var newValue = elem.value;
    target.innerHTML = newValue;
    clicked = true;
}
var rangeValue2 = function(){
    var newValue = elem2.value;
    target2.innerHTML = newValue;
    clicked2 = true;
}
elem.addEventListener("input", rangeValue);
elem2.addEventListener("input", rangeValue2);



/* ------------------------------------------ */

//alert(target2)
/* PLAYER HERE */
var spawn = require('child_process').spawn;
var proc;
var cmd = 'ffmpeg/bin/ffplay.exe';
var scoreOrig;
var scoreDist;
var noScore = 0;
var getScores = ["Original video", "Score", "Distorted video", "Score", "Differential score"];
var allScores = [];
var replayClick;
var readExp = fs.readFileSync("../Experiments/Experiment.last",'utf8');
var readFiles = fs.readFileSync("../Experiments/" + readExp + "/" + readExp + '(config)' + ".csv",'utf8');
var FileListwName = readFiles.split('\n');

var DistortedFileNames = FileListwName[2].split(',');
var DistortedTrainingFile = FileListwName[3].split(',');
var OriginalFileNames = FileListwName[4].split(',');
var OriginalTrainingFile = FileListwName[5].split(',');
var videoFormat = FileListwName[6].split(',');
videoFormat.splice(0,1);
DistortedFileNames.splice(0,1);
OriginalFileNames.splice(0,1);
DistortedTrainingFile.splice(0,1);
OriginalTrainingFile.splice(0,1);
var FileNames = DistortedFileNames.concat(OriginalFileNames)
var readUserName = fs.readFileSync("../Experiments/" + readExp + "/user.last", 'utf8');
var presMethod = (readFiles.split('\n'))[1].split(',')[1];
var trialRun = fs.existsSync("../Experiments/" + readExp + "/" + readUserName + "/" + readUserName + ".test");
var fileLength;
var x=0;
var vN;
var getOrigFileNames = [];
var getOrigTrainingFile = [];
var randomVid;
var breakTime = 0;
var firsttime = true;
var scoreVideonum = 0;
/* try { -------------------------------------------------------- COMMENTED FOR DEBUGGING
    fs.unlinkSync("../Experiments/" + readExp + "/user.last")
    //file removed
} catch(err) {
    console.error(err)
} */

for (var i = 0; i < OriginalFileNames.length; i++) {  
    splitOrigFileNames = OriginalFileNames[i].split('_');
    getOrigFileNames.push(splitOrigFileNames[0]);
}

for (var i = 0; i < OriginalTrainingFile.length; i++) {  
    splitOrigTrainingFile = OriginalTrainingFile[i].split('_');
    getOrigTrainingFile.push(splitOrigTrainingFile[0]);
}

var totalVideoTime = 0;
var totalVideoTimeM = 0;
var breakNum;
function getBreakNum(distFileNames){
    for (i=0;i<distFileNames.length;i++){
        totalVideoTime = totalVideoTime + 20 + (4 * parseInt(distFileNames[i].split('_')[5])/parseInt(distFileNames[i].split('_')[2]));
    }
    Math.round(totalVideoTime)
    totalVideoTimeM = parseInt(totalVideoTime/60);
    breakNum = Math.round(totalVideoTimeM/30)-1;
}

if(trialRun){
    document.getElementById("text").textContent = "Training phase is starting now, get ready!";
}

getBreakNum(DistortedFileNames);
shuffle(DistortedFileNames);
setTimeout(function(){
    replayClick = 0;
    play(trialRun, scoreVideonum);}, 2000)
    
    function play(testTrial, scoreVideo){
        if (scoreVideo != 2){
            randomVid = Math.floor(Math.random() * Math.floor(2));
        } 
        vN = x+1;
        console.log(scoreVideo)
        if(testTrial){
            noScore = 1;
            fileLength = DistortedTrainingFile.length;
            DDistortedFileNames = DistortedTrainingFile[x].substring(0, DistortedTrainingFile[x].length - 4);
            getName = (DDistortedFileNames.split('_'))[0];
            var origIndex = getOrigTrainingFile.indexOf(getName);
            console.log(getName)
            console.log(OriginalTrainingFile)
            console.log(origIndex)
            OOriginalFileNames = OriginalTrainingFile[origIndex].substring(0, OriginalTrainingFile[origIndex].length - 4)
            if (randomVid == 0){
                var ppath = '../trainingSequences/' + readExp + '/' + 'Distorted/' + DDistortedFileNames + videoFormat;
                var ppath2 = '../trainingSequences/' + readExp + '/' + 'Original/' + OOriginalFileNames + videoFormat;
                console.log("Distorted : " + DDistortedFileNames + " so " + OOriginalFileNames)
            }
            else{
                var ppath2 = '../trainingSequences/' + readExp + '/' + 'Distorted/' + DDistortedFileNames + videoFormat;
                var ppath = '../trainingSequences/' + readExp + '/' + 'Original/' + OOriginalFileNames + videoFormat;
                console.log("Distorted : " + DDistortedFileNames + " so " + OOriginalFileNames)
            }
        }else{
            noScore = 0;
            fileLength = DistortedFileNames.length;
            DDistortedFileNames = DistortedFileNames[x].substring(0, DistortedFileNames[x].length - 4);
            getName = (DDistortedFileNames.split('_'))[0];
            var origIndex = getOrigFileNames.indexOf(getName);
            OOriginalFileNames = OriginalFileNames[origIndex].substring(0, OriginalFileNames[origIndex].length - 4)
            if (randomVid == 0){
                var ppath = '../converted/' + readExp + '/' + 'DistortedVideos/' + DDistortedFileNames + videoFormat;
                var ppath2 = '../converted/' + readExp + '/' + 'OriginalVideos/' + OOriginalFileNames + videoFormat;
                console.log("Distorted : " + DDistortedFileNames + " so " + OOriginalFileNames)
            }
            else{
                var ppath2 = '../converted/' + readExp + '/' + 'DistortedVideos/' + DDistortedFileNames + videoFormat;
                var ppath = '../converted/' + readExp + '/' + 'OriginalVideos/' + OOriginalFileNames + videoFormat;
                console.log("Distorted : " + DDistortedFileNames + " so " + OOriginalFileNames)
            }
        }
        //rateVideo();
        var args = [
            '-autoexit',
            '-fs', 
            '-i', ppath
        ];
        var args2 = [
            '-autoexit',
            '-fs', 
            '-i', ppath2
        ];
        
        if (replayClick == 1) {
            if(scoreVideo == 1){
                watchVideo1();
                setTimeout(function(){
                    proc = spawn(cmd, args);
                    rateVideo(1);
                    proc.on('exit', function (code) { 
                        proc = null;
                    });
                }, 2000)
            } else if (scoreVideo == 2){
                watchVideo2();
                setTimeout(function(){
                    proc = spawn(cmd, args2);
                    rateVideo(2);
                    proc.on('exit', function (code) { 
                        proc = null;
                    });
                }, 2000)
            }
            
        } else{
            if(scoreVideo == 2){
                //watchVideoPair();
                //setTimeout(function(){
                watchVideo2();
                setTimeout(function(){
                    proc = spawn(cmd, args2);
                    rateVideo(2);
                    proc.on('exit', function (code) { 
                        proc = null;
                    });
                }, 2000)
                //},2000)
            }else{
                watchVideoPair();
                setTimeout(function(){
                    watchVideo1();
                    setTimeout(function() {
                        proc = spawn(cmd, args);
                        setTimeout(function(){
                            watchVideo2();
                        }, 2000)
                        proc.on('exit', function (code) { 
                            proc = null;
                            setTimeout(function(){
                                proc = spawn(cmd, args2);
                                setTimeout(function(){
                                    watchVideo1();
                                }, 2000)
                                proc.on('exit', function (code) { 
                                    proc = null;
                                    setTimeout(function(){
                                        proc = spawn(cmd, args);
                                        rateVideo(1);
                                        proc.on('exit', function (code) { 
                                            proc = null;
                                        });
                                    }, 2000)
                                });
                            }, 2000)
                        });
                    }, 2000)
                },2000)
            }
            
        }
    }
    
    $('#continue').click(function () {
        if(breakNum > 0 && breakTime == Math.floor(fileLength/breakNum)-1 && !trialRun){
            breakTimeF();
            breakTime = 0;
        }else {
            replayClick = 0;
            if(clicked != true){
                swal.fire({
                    text: 'You have not selected a score, please select one to continue!' ,
                    type:'error'
                });
            }else if (clicked == true && clicked2 != true){
                if(firsttime == true){
                    scoreVideonum = 2;
                    firsttime = false;
                    play(trialRun, scoreVideonum)
                }else{
                    swal.fire({
                        text: 'You have not selected a score, please select one to continue!' ,
                        type:'error'
                    });
                }
            }else{
                firsttime = true;
                scoreVideonum = 0;
                setTimeout(function(){
                    if (document.getElementById("myRange1") != null){
                        document.getElementById("myRange1").disabled = false;}
                        $('.value').removeClass('disable');
                        $('#rateT1').removeClass('disable');
                        $('#rate1').removeClass('disable');
                    }, 500)
                    if (x < fileLength-1){
                        if (clicked == true && clicked2 == true){
                            $('#continue').prop('disabled', true);
                            $('#replayB').prop('disabled', true);
                            x = x + 1;
                            breakTime = breakTime+1;
                            //if (x <= DistortedFileNames.length-1){
                            clicked = false;
                            clicked2 = false;
                            if (randomVid == 1){
                                scoreOrig = target.innerHTML;
                                scoreDist = target2.innerHTML;
                                //allScores.push([OOriginalFileNames[0],scoreOrig,DDistortedFileNames[0],scoreDist]);
                                // allScores.push([DDistortedFileNames[0],scoreDist]);
                            } else {
                                scoreDist = target.innerHTML;
                                scoreOrig = target2.innerHTML;
                                //allScores.push([DDistortedFileNames[0],scoreDist,OOriginalFileNames[0],scoreOrig]);
                                // allScores.push([OOriginalFileNames[0],scoreOrig]);
                            }
                            if (noScore == 0){
                                allScores.push([OOriginalFileNames,scoreOrig,DDistortedFileNames,scoreDist, scoreDist-scoreOrig+100]);
                            }
                            setTimeout(function(){
                                document.querySelector('input[name="range1"]').value = 0;
                                document.querySelector('input[name="range2"]').value = 0;
                                target.innerHTML = "";
                                target2.innerHTML = "";
                                enableButton();
                            },2000)
                            play(trialRun, scoreVideonum);//}
                        }else{
                            swal.fire({
                                text: 'You have not selected a score, please select one to continue!' ,
                                type:'error'
                            });}
                        } else if(x == fileLength-1){
                            if (clicked == true && clicked2 == true){
                                if (randomVid == 1){
                                    scoreOrig = target.innerHTML;
                                    scoreDist = target2.innerHTML;
                                    //allScores.push([OOriginalFileNames[0],scoreOrig,DDistortedFileNames[0],scoreDist]);
                                    // allScores.push([DDistortedFileNames[0],scoreDist]);
                                } else {
                                    scoreDist = target.innerHTML;
                                    scoreOrig = target2.innerHTML;
                                    //allScores.push([DDistortedFileNames[0],scoreDist,OOriginalFileNames[0],scoreOrig]);
                                    //allScores.push([OOriginalFileNames[0],scoreOrig]);
                                }
                                if (noScore == 0){
                                    allScores.push([OOriginalFileNames,scoreOrig,DDistortedFileNames,scoreDist, scoreDist-scoreOrig+100]);
                                }
                                $('#replayB').prop('disabled', true);
                                $('#continue').prop('disabled', true);
                                finish();
                                setTimeout(function(){
                                    enableButton();
                                },500)
                                x = x + 1;
                            }
                            else{
                                swal.fire({
                                    text: 'You have not selected a score, please select one to continue!' ,
                                    type:'error'
                                }); 
                            }
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
                }
            })
            
            function enableButton() {
                if($("#replayB").is(":disabled")){
                    $('#replayB').prop('disabled', false);
                }
                if($("#continue").is(":disabled")){
                    $('#continue').prop('disabled', false);     
                }
            }
            
            function watchVideo2(){
                document.getElementById("text").style.visibility = "visible";
                $('#buttons').removeClass('transitionEffect');
                document.getElementById("text").textContent = "Starting video B" ;
                document.getElementById("rating").style.visibility = "hidden";
                document.getElementById("sliders").style.visibility = "hidden";
                document.getElementById("buttons").style.visibility = "hidden";
                //document.getElementById("replay").style.visibility = "hidden";
            }
            
            function watchVideo1(){
                document.getElementById("text").style.visibility = "visible";
                $('#buttons').removeClass('transitionEffect');
                document.getElementById("text").textContent = "Starting video A" ;
                document.getElementById("rating").style.visibility = "hidden";
                document.getElementById("sliders").style.visibility = "hidden";
                document.getElementById("buttons").style.visibility = "hidden";
                // document.getElementById("replay").style.visibility = "hidden";
            }
            
            function watchVideoPair(){
                document.getElementById("text").style.visibility = "visible";
                $('#buttons').removeClass('transitionEffect');
                document.getElementById("text").textContent = "Starting pair of videos " + vN + " of " + fileLength;
                document.getElementById("rating").style.visibility = "hidden";
                document.getElementById("sliders").style.visibility = "hidden";
                document.getElementById("buttons").style.visibility = "hidden";
                //document.getElementById("replay").style.visibility = "hidden";
            }
            
            function rateVideo(videoNum){
                if (x < fileLength){   
                    setTimeout(function(){
                        if(videoNum == 1){
                            //alert("set video num to 1" + scoreVideonum);
                            scoreVideonum = 1;
                            document.getElementById("text").style.visibility = "hidden";
                            //document.getElementById("text").textContent = "Starting pair of videos " + vN + " of " + fileLength; /// ChANGE
                            //   document.getElementById("replay").style.visibility = "visible";
                            document.getElementById("rating").style.visibility = "visible";
                            document.getElementById("sliders").style.visibility = "visible";
                            document.getElementById("buttons").style.visibility = "visible";
                            document.getElementById("myRange2").disabled = true;
                            $('.value2').addClass('disable');
                            $('#rateT2').addClass('disable');
                            $('#rate2').addClass('disable'); 
                        } else {
                            scoreVideonum = 2;
                            document.getElementById("text").style.visibility = "hidden";
                            //document.getElementById("text").textContent = "Starting pair of videos " + vN + " of " + fileLength;
                            // document.getElementById("replay").style.visibility = "visible";
                            document.getElementById("rating").style.visibility = "visible";
                            document.getElementById("sliders").style.visibility = "visible";
                            document.getElementById("buttons").style.visibility = "visible";
                            document.getElementById("myRange1").disabled = true;
                            $('.value').addClass('disable');
                            $('#rateT1').addClass('disable');
                            $('#rate1').addClass('disable');
                            document.getElementById("myRange2").disabled = false;
                            $('.value2').removeClass('disable');
                            $('#rateT2').removeClass('disable');
                            $('#rate2').removeClass('disable'); 
                        }
                    }, 1000);
                }
            }
            
            
            function breakTimeF(){
                $('#continue').prop('disabled', true);
                document.getElementById("rating").style.visibility = "hidden";
                //  document.getElementById("replay").style.visibility = "hidden";
                document.getElementById("sliders").style.visibility = "hidden";
                setTimeout(function(){
                    $('#continue').prop('disabled', false);
                    $('#buttons').addClass('transitionEffect');
                    document.getElementById("text").textContent = "Time for a break!\r\n Press continue when ready to start with the second half!";
                    document.getElementById("text").style.visibility = "visible";
                }, 600)}
                
                function finish(){
                    if (noScore == 0){
                        var unsorted = allScores.slice();
                        unsorted.unshift(getScores);
                        const csvStringu = toCsv(unsorted);
                        fs.writeFileSync("../Experiments/" + readExp + "/" + readUserName + "/" + "score(presOrder).csv", csvStringu, 'utf8');
                        allScores.sort(Comparator);
                        allScores.unshift(getScores)
                        const csvString = toCsv(allScores);
                        fs.writeFileSync("../Experiments/" + readExp + "/" + readUserName + "/" + "score.csv", csvString, 'utf8');
                    }
                    setTimeout(function(){
                        //$("#replay").remove();
                        $("#rating").remove();
                        $("#sliders").remove();
                        $("#continue").css("width", "8%");
                        $("#text").css("margin-top", "19%");
                        document.getElementById("center").className = "text-center";
                        if(!trialRun){
                            document.getElementById("text").textContent = "End of experiment, please press continue to finish!"
                        } else{
                            document.getElementById("text").textContent = "End of training, please press continue to proceed to testing!"    
                        }
                        document.getElementById("text").style.visibility = "visible";
                    }, 200)
                }