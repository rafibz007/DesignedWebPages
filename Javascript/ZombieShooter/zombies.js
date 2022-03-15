const jsonBlob = "https://jsonblob.com/api/jsonBlob/916374925166788608"

async function start() {
    scoreboardManage()
    cursorStart()
    zombies()
}
getPlayerNick()
var score;
var nick;

async function cursorStart() {
    let cursor = document.querySelector('.cursor');
    let game = document.querySelector('.game');

    game.style.cursor = "none";
    cursor.style.display = "flex"
    window.addEventListener('mousemove', track)

}


async function cursorStop() {
    let cursor = document.querySelector('.cursor');
    let game = document.querySelector('.game');

    game.style.cursor = "initial";
    cursor.style.display = "none"
    window.removeEventListener('mousemove', track)

}


function track() {
    let cursor = document.querySelector('.cursor');
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";
}


async function getPlayerNick() {
    const game = document.querySelector('.game')
    let field = document.createElement('div');
    field.classList.add('field')

    let input = document.createElement('input')
    input.type = "text"
    input.placeholder = "ENTER YOUR NICK"

    let button = document.createElement('button')
    button.innerText = "OK"

    let error = document.createElement('div')
    error.innerText = "Enter your nick"

    field.appendChild(input)
    field.appendChild(error)
    field.appendChild(button)

    game.appendChild(field)

    button.addEventListener('click', ()=>{
        let nickPropose = input.value;
        
        // NICK CHECK
        if (nickPropose == "") {
            showErrorMesaage("Enter your nick");
        }
        else if (!/^[a-zA-Z0-9_\-&*^$%# ]*$/.test(nickPropose)) {
            showErrorMesaage("Nick contains illegal chars");
        }
        else if (!/.{2,}/.test(nickPropose)){
            showErrorMesaage("Nick is too short")
        } else if (/.{12,}/.test(nickPropose)) {
            showErrorMesaage("Nick is too long")
        } else {
            document.querySelector('.nick').innerText = nickPropose
            nick = nickPropose;
            field.remove()
            setTimeout(start, 0)
        }
    })


    function showErrorMesaage(message) {
        error.innerText = message;
        error.classList.add("red")
        return;
    }
}

function getTimeString() {
    let date = new Date();
    let day = date.getDate();
    if (day<10) day = "0" + day;
    let month = date.getMonth() + 1;
    if (month<10) month = "0" + month;
    let year = date.getFullYear();
    let hour = date.getHours();
    if (hour<10) hour = "0" + hour;
    let minute = date.getMinutes();
    if (minute<10) minute = "0" + minute;

    return `${day}-${month}-${year} ${hour}:${minute}`
}

async function updateScoreboard() {
    let best = await getPlayersBest();
    let newScore = { "name" : nick, "date" : getTimeString(), "playerscore" : String(score) };
    best.push(newScore);
    best.sort(function (a,b) {
        let compare = parseInt(b['playerscore']) - parseInt(a['playerscore'])
        if (compare == 0) {
            let aDate = a['date'].split(" ")[0].split("-")
            let bDate = b['date'].split(" ")[0].split("-")
            let aTime = a['date'].split(" ")[1].split(":")
            let bTime = b['date'].split(" ")[1].split(":")


            let aNewDate = new Date( parseInt(aDate[2]), parseInt(aDate[1]), parseInt(aDate[0]), parseInt(aTime[0]), parseInt(aTime[1]) )
            let bNewDate = new Date( parseInt(bDate[2]), parseInt(bDate[1]), parseInt(bDate[0]), parseInt(bTime[0]), parseInt(bTime[1]) )

            return aNewDate - bNewDate;
        } else {
            return compare;
        }
    })
    
    if (best.length > 5){
        best.pop()
    }

    let json = JSON.stringify({ "bestscores" : best })

    fetch(jsonBlob, {
        method : 'PUT',
        body : json,
        headers : {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        }
    })
}

async function getPlayersBest() {
        let bestscores;
        await fetch(jsonBlob)
            .then(response => response.json())
            .then(data => {
                bestscores = data['bestscores'];
            })
        return bestscores;
    }


async function scoreboardManage() {
    const game = document.querySelector('.game')
    

    async function openScoreboard() {
        cursorStop()


        let data = getPlayersBest();
        let currentName = document.querySelector('.nick').innerText

        // SCOREBOARD BACKGROUND
        let bg = document.createElement('div')
        bg.classList.add('scoreboard-bg');

        // SCOREBOARD
        let scoreboard = document.createElement('div')
        scoreboard.classList.add('scoreboard')

        game.appendChild(bg)
        game.appendChild(scoreboard)

        // CLOSE BUTTON
        let closeButton = document.createElement('div')
        closeButton.classList.add('close-btn')
        closeButton.addEventListener('click', closeScoreboard)
        scoreboard.appendChild(closeButton)

        // RECORDS
        let jsonBest = await getPlayersBest();
        let i=1
        for (data of jsonBest){
            const name = data['name'];
            const date = data['date'];
            const playerscore = data['playerscore']

            // RECORD
            let record = document.createElement('div')
            record.classList.add('record')
            if (name == currentName) {
                record.classList.add('your')
            }

            // POSITION
            let pos = document.createElement('div')
            pos.classList.add('pos')
            pos.innerText = i + "."

            // RECORD NAME
            let recordName = document.createElement('div')
            recordName.classList.add('name')
            recordName.innerText = name

            // RECORD DATE
            let recordDate = document.createElement('div')
            recordDate.classList.add('date')
            recordDate.innerText = date

            // RECORD PLAYERSCORE
            let recordScore = document.createElement('div')
            recordScore.classList.add('playerscore')
            recordScore.innerText = playerscore

            record.appendChild(pos);
            record.appendChild(recordName);
            record.appendChild(recordDate);
            record.appendChild(recordScore);

            scoreboard.appendChild(record)

            i += 1
        }
    }

    function closeScoreboard() {
        cursorStart()
        let bg = document.querySelector('.scoreboard-bg')
        let scoreboard = document.querySelector('.scoreboard')
        
            bg.remove();
            scoreboard.remove();
    }

    let scoreboardButton = document.querySelector('.show-scoreboard')
    scoreboardButton.addEventListener('click', openScoreboard)
}

async function zombies() {
    let board = document.querySelector('.game');
    let body = document.querySelector('body');
    let liveDisplay = document.querySelector(".lives");
    let scoreDisplay = document.querySelector('.score');
    let endButtons = document.querySelector('.end-buttons');
    let restartButton = document.querySelector('.restart');

    let lives = 3;
    score = 0;
    let gameRunning = true;

    const zombieBaseWidth = 200;
    const zombieBaseHeight = 312;
    const pointsBase = 12;
    const timeouts = new Set();

    updateLives()
    updateScore()

    var spawning;
    function restart() {
        lives = 3;
        score = 0;
        updateLives(lives);
        updateScore(score);

        spawning = setInterval(spawnZombie, 300);
        endButtons.style.display = "none";
        
        let gameover = document.querySelector('.gameover');
        if (gameover != null)
            gameover.remove();
        
        // MISSING A SHOT
        board.addEventListener('click', subPoints)

        gameRunning = true;
    }

    restart();
    restartButton.addEventListener('click', restart);
    restartButton.addEventListener('click', (event)=>{ event.stopPropagation() })



    function subPoints(){
        addPoints(-pointsBase/2);
        
    }


    function spawnZombie() {
        // RANDOMLY DECIDE IF ZOMBIE WOULD SPAWN
        if (Math.random()>0.5)
            return;

        let times = [1.5, 3, 4, 5, 6];
        let timeIdx = Math.floor(Math.random() * 5)
        
        let maxH = Math.floor(board.offsetHeight/2);
        let h = Math.floor(Math.random() * maxH);

        let s = Math.floor(Math.random()*100)/100 + 0.5;

        addZombie(times[timeIdx], h, s);
    }


    // time [s] - amount of time that zombie will run to the other side
    // bottom [px] - distance from bottom to spawn the zombie on
    // size [] - from 0.5 to 1.5; rescale zombie deafult size by this value
    function addZombie(time, bottom, size) {
        let zombieWidth = zombieBaseWidth*size;
        let zombieHeight = zombieBaseHeight*size;
        
        let screenWidth = board.offsetWidth;
        let distance = screenWidth + zombieWidth;

        let points = pointsBase;

        // CREATING ZOMBIE
        let zombie = document.createElement('div');
        zombie.classList.add('zombie');
        zombie.style.width = zombieWidth + "px";
        zombie.style.height = zombieHeight + "px";
        zombie.style.backgroundSize = "auto " + zombieHeight + "px";

        // SETTING POSOTION AND MOVING ATTRIBUTES
        zombie.style.bottom = bottom + "px";
        zombie.style.right = -zombieWidth + "px";

        zombie.style.transition = "right " + time + "s linear";
        board.appendChild(zombie);

        // MAKE ZOMBIE RUNNING
        setTimeout(()=>{
            zombie.classList.add('move')
        }, 500)

        // MAKE THAT WHEN ZOMBIE PASS IT WILL REMOVE YOUR LIFE AND DISAPPEAR
        let running = setTimeout(()=>{
            zombiePassed();
            zombie.remove();
            timeouts.delete(running);
        }, Math.ceil((time+0.5)*1000));
        timeouts.add(running);

        // ANIMATE
        let allFramesWidth = zombieWidth*10; //px
        let position = 0; //px
        let interval = zombieWidth; //px
        let animation = setInterval(() => {
        
            zombie.style.backgroundPosition = position + "px 0px";
            position = (position-interval)%allFramesWidth;

        }, 10*time);



        // KILLING ZOMBIES WHEN HIT
        zombie.addEventListener('click', zombieHit);
        zombie.addEventListener('click', (event)=>{
            event.stopPropagation();
        })

        function zombieHit(){
            clearTimeout(running);
            clearInterval(animation);
            zombie.remove();
            addPoints(points);
            timeouts.delete(running);

        }

    }

    function zombiePassed() {
        lives =  Math.max(0, lives-1);
        updateLives(lives);
        checkLives();
    }


    function addPoints(points){
        score += points;
        updateScore(score);
    }

    function updateScore(value) {
        scoreDisplay.innerText = "Score: " + value
    }

    function updateLives(value) {
        liveDisplay.innerText = "Lives: " + value;
    }

    function checkLives(){
        if (lives > 0 && gameRunning)
            return;
        gameOver();
    }



    async function gameOver(){
        if (!gameRunning)
            return;
        gameRunning = false;

        board.removeEventListener('click', subPoints);
        document.querySelectorAll('.zombie').forEach(element => {
            element.remove()
        });

        timeouts.forEach(element=>{
            clearTimeout(element);
        })
        timeouts.clear();

        let gameover = document.createElement('div');
        gameover.innerText = "GAME OVER";
        gameover.classList.add('gameover')
        board.appendChild(gameover);

        clearInterval(spawning);
        endButtons.style.display = "unset"

        await updateScoreboard();

    }
}