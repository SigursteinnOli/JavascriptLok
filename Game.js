

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

var Storage = window.localStorage;

//Storage.clear()
if(Storage.length == 0){ // Fyrsta skipti sem er startað. Setur upp stigakerfið
    Storage.setItem('1st',"");
    Storage.setItem('2nd',"");
    Storage.setItem('3rd',"");
    Storage.setItem('4th',"");
    Storage.setItem('5th',"");
}



let Background = new Image();
Background.src = "Sprites/Background.png"

let ZombieSS = new Image();
ZombieSS.src = "Sprites/Zombie.png"

let PlayerSS = new Image();
PlayerSS.src = "Sprites/Character.png"
PlayerSS.onload = function(){
    window.requestAnimationFrame(GameLoop);
}


var GameState = 1;

var PlayerName = ""
var PlayerHealth = 3;
var PlayerX = 0;
var PlayerY = 0;
var MovementSpeed = 10;
var scale = 1;
var PHeight = 200;
var PWith = 131;
var scaledH = PHeight*scale;
var scaledW = PWith*scale;
var invinsableFrames = 100;
var invinsableCount = 0; 

const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;
var currentDirection = FACING_DOWN;
var frameLimit = 10;//Fyrir animation
let frameCount = 0; 
var animationframe = 0;// Hvar í spritesheet'inu hann er

var bulletCooldown = 0; 
var bulletSpeed = 40;
var bullets = [];

var Zombies = [];
var ZombieSpeed = 2;
var ZombieSpawnRate = 90;
var spCount = 0; // spawn rate counter 

var killCounter = 0;

var AllSet = false // svo highScore taflan raði sjálfum sér ekki í hverju loop

var myDiv = document.getElementById("myDiv")
var Name = document.getElementById("name")
var StartBtn = document.getElementById("StartButton")
var RestartBtn = document.getElementById("RestartButton")
var ContinueBtn = document.getElementById("ContinueButton")
var HelpBtn = document.getElementById("HelpButton")
var HelpText = document.getElementById("help")

var ScoreList = document.getElementById("ScoreList")
ScoreList.style.display = "block"

Name.style.display = "block"
RestartBtn.style.display = "block"
HelpBtn.style.display = "block"
ContinueBtn.style.display = "block"
StartBtn.style.display = "block"
ContinueBtn.style.display = "none";
RestartBtn.style.display = "none";
HelpText.style.display = "none"

 // --------------------------------------------------------------Buttons-----------------------------------------------------------------

function ContinueButton(){
    GameState = 2
    StartBtn.style.display = "none";
    ContinueBtn.style.display = "none";
    RestartBtn.style.display = "none";
    HelpBtn.style.display = "none";
    PlayerName = Name.value
    Name.style.display = "none"
    ScoreList.style.display = "none"
    HelpText.style.display = "none"
    GameLoop()
}
function RestartButton(){
    GameState = 2
    killCounter = 0
    PlayerHealth = 3
    ZombieSpawnRate = 90
    Zombies = []
    bullets = []
    AllSet = false

    Name.style.display = "none"
    StartBtn.style.display = "none";
    ContinueBtn.style.display = "none";
    RestartBtn.style.display = "none";
    HelpBtn.style.display = "none";
    PlayerName = Name.value
    ScoreList.style.display = "none"
    HelpText.style.display = "none"
    GameLoop()

}
var on = true
function HelpButton(){
    if(on){
        HelpText.style.display = "block"
        ScoreList.style.display = "none"
        on = false
    }
    else{
        HelpText.style.display = "none"
        ScoreList.style.display = "block"
        on = true
    }
}

function EscapeButton(){
    GameState = 0;
    Name.style.display = "block"
    RestartBtn.style.display = "block"
    HelpBtn.style.display = "block"
    ContinueBtn.style.display = "block"

}

function HighScore(){
    PlayerName = Name.value
    var t1 = "" // "siggi-20"
    var t2 = ""
    var t3 = ""
    var t4 = ""
    var t5 = ""
    var listinn = []

    t1 = Storage.getItem("1st") // "siggi-20"
    t2 = Storage.getItem("2nd")
    t3 = Storage.getItem("3rd")
    t4 = Storage.getItem("4th")
    t5 = Storage.getItem("5th")
    listinn = []

 
    
    if(AllSet == false){

        if(t1 == ""){  // ef ekki er sett nafn. eða ekki er skorða neitt. Svo þú getur ekki bara refreshað og fyllt töfluna
            if(PlayerName == ""){
                PlayerName = "Chad"
                listinn.push(PlayerName+"-"+10)
            }

        }
        else{
            listinn.push(t1)
            if(PlayerName == ""){
                PlayerName = "Kyle"     
            }
            if(killCounter != 0){
                listinn.push(PlayerName+"-"+killCounter)
            }
        }

                
        if (t2 != ""){ listinn.push(t2) }
        if (t3 != ""){ listinn.push(t3) }
        if (t4 != ""){ listinn.push(t4) }
        if (t5 != ""){ listinn.push(t5) }
        //console.log(listinn)




        if(listinn.length >1){ // notaði bubblesort því þetta eru bara topp 6 stök
            var n = listinn.length-1
            swapp = false 
            do {
                swapp = false
                for(var i = 0; i < n; i++){
                    if(parseInt(listinn[i].split("-")[1]) < parseInt(listinn[i+1].split("-")[1])){
                        var temp = listinn[i]
                        listinn[i] = listinn[i+1]
                        listinn[i+1] = temp
                        swapp = true
                    }
                }
                n--
            } while (swapp)

            AllSet = true
        }  
    }


    while(ScoreList.firstChild) ScoreList.removeChild(ScoreList.firstChild); // tæma listann
    for(let x = 0; x<listinn.length; x++){
        if(x == 0){
            Storage.setItem("1st",listinn[x])
            var li = document.createElement("li");
            li.textContent = "1st: " + listinn[x].split("-")[0] + " - Kills: " + listinn[x].split("-")[1]
            ScoreList.appendChild(li)
            li = ""
        }
        if(x == 1){
            Storage.setItem("2nd",listinn[x])
            var li = document.createElement("li");
            li.textContent = "2nd: " + listinn[x].split("-")[0] + " - Kills: " + listinn[x].split("-")[1]
            ScoreList.appendChild(li)
            li = ""
        }
        if(x == 2){
            Storage.setItem("3rd",listinn[x])
            var li = document.createElement("li");
            li.textContent = "3rd: " + listinn[x].split("-")[0] + " - Kills: " + listinn[x].split("-")[1]
            ScoreList.appendChild(li)
            li = ""
        }
        if(x == 3){
            Storage.setItem("4th",listinn[x])
            var li = document.createElement("li");
            li.textContent = "4th: " + listinn[x].split("-")[0] + " - Kills: " + listinn[x].split("-")[1]
            ScoreList.appendChild(li)
            li = ""
        }
        if(x == 4){
            Storage.setItem("5th",listinn[x])
            var li = document.createElement("li");
            li.textContent = "5th: " + listinn[x].split("-")[0] + " - Kills: " + listinn[x].split("-")[1]
            ScoreList.appendChild(li)
            li = ""
        }
        if(x >= 5){
                listinn.pop()
            }
    }


console.log(Storage)

}


function drawScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Kills: "+killCounter, width*0.04, height*0.2);
}

function drawHealth() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Health: "+PlayerHealth, width*0.04, height*0.1);
}


function Random(min, max) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min) + min);
}



let keyPresses = {};
document.addEventListener('keydown', keyDownListener, false);
function keyDownListener(event) {
  keyPresses[event.key] = true;
}

document.addEventListener('keyup', keyUpListener, false);
function keyUpListener(event) {
  keyPresses[event.key] = false;
}

function DrawSprite(ss,frameX,farmeY,canvasX,canvasY){ // ------------------------------------------------------------------------------------------Player---------------------------------------
    ctx.drawImage(ss, frameX*PWith, farmeY*PHeight, PWith, PHeight, canvasX, canvasY, PWith*scale, PHeight*scale);
}


function moveCharacter(deltaX, deltaY, direction) {
  if (PlayerX + deltaX > 0 && PlayerX + PWith*scale + deltaX < canvas.width) {
    PlayerX += deltaX;
  }
  if (PlayerY + deltaY > 0 && PlayerY + PHeight*scale + deltaY < canvas.height) {
    PlayerY += deltaY;
  }
  currentDirection = direction;
}

function bullet(x,y,exist,dir,size){  // ------------------------------------------------------------------Bullet---------------------------------------
    this.x = x
    this.y = y
    this.exist = exist
    this.dir = dir;
    this.size = size;
}

//bullet.prototype.constructor = bullet;

bullet.prototype.draw = function(){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillstyle = "red";
    ctx.fill();
    ctx.closePath();
}

bullet.prototype.update = function(){
    if(this.dir == 0){
        this.y += bulletSpeed; 
    }
    if(this.dir == 1){
        this.y -= bulletSpeed;
    }
    if(this.dir == 2){
        this.x -= bulletSpeed
    }
    if(this.dir == 3){
        this.x += bulletSpeed
    }
    
}

bullet.prototype.collisionDetect = function(){
    //console.log(this.x, this.y)
    if(this.y <= 0 || this.y >= height || this.x >= width || this.x <= 0){
        this.exist = false
    }
}

function Zombie(x,y){  // ------------------------------------------------------------------Zombie---------------------------------------
    this.x = x;
    this.y = y;
    this.exist = true;
    this.dir = 0;
    this.zAnimationframe = 0;
    this.zFrameCount = 0
}
//Zombie.prototype.constructor = Zombie;

//down = 0 up = 1 left = 2 right 3

Zombie.prototype.update = function(){
    if(this.x > PlayerX){
        this.x -= ZombieSpeed;

    }
    if(this.x < PlayerX){
        this.x += ZombieSpeed;

    }
    if(this.y > PlayerY){
        this.y -= ZombieSpeed;

    }
    if(this.y < PlayerY){
        this.y += ZombieSpeed;
  
    }

    if(Math.abs(this.x - PlayerX) > Math.abs(this.y - PlayerY)){
        if(this.x > PlayerX){
            this.dir = 2;
        }
        else{
            this.dir = 3;
        }
    }
    else{
        if(this.y > PlayerY){
        this.dir = 1;
        }
        else{
            this.dir = 0;
        }
    }

    this.zFrameCount++;
    if(this.zFrameCount >= frameLimit){
        this.zFrameCount = 0;
        this.zAnimationframe++
        if(this.zAnimationframe >= 4){
            this.zAnimationframe = 0;
        }
    }
    
}

Zombie.prototype.draw = function(){
    DrawSprite(ZombieSS,this.zAnimationframe,this.dir,this.x,this.y)
}

Zombie.prototype.collisionDetect = function(){
    if(bullets.length >0){
        for(var bul = 0; bul < bullets.length; bul++){
            if(bullets[bul].x > (this.x) && bullets[bul].x < (this.x + PWith*scale) && bullets[bul].y > (this.y) && bullets[bul].y < (this.y + PHeight*scale)){
                this.exist = false;
                bullets[bul].exist = false;
                killCounter++
                if(ZombieSpawnRate >40){
                   ZombieSpawnRate -= 1 
                }
            }
        }
    }

    
    var playerTop = PlayerY -(scaledW*0.3);
    var playerBottom = PlayerY + (scaledH*0.7);
    var playerLSide = PlayerX -(scaledW*0.3);
    var playerRSide = PlayerX + (scaledW*0.7);

    var zombieTop = this.y;
    var zombieBottom = this.y + scaledH;
    var zombieLSide = this.x;
    var zombieRSide = this.x + scaledW;

    var hit = false


    if( ((zombieBottom > playerTop) && (zombieTop < playerTop))  &&  ((zombieLSide < playerRSide) && (zombieRSide > playerRSide))   ){
        hit = true;
    }
    else if( ((zombieBottom > playerTop) && (zombieTop < playerTop))  &&  ((zombieRSide > playerLSide) && (zombieLSide < playerLSide)) ){
        hit = true;
    }
    else if( ((zombieTop < playerBottom) && (zombieBottom > playerBottom))  &&  ((zombieLSide < playerRSide) && (zombieRSide > playerRSide)) ){
        hit = true;
    }
    else if( ((zombieTop < playerBottom) && (zombieBottom > playerBottom))  &&  ((zombieRSide > playerLSide) && (zombieLSide < playerLSide)) ){
        hit = true;
    }

    if(hit == true){ // leyfi spilaranum að vera ódauðlegur í norrar sec eftir að miss líf svo hann deyji ekki á einni sec
        if(invinsableCount >= invinsableFrames){
           PlayerHealth -= 1;
           invinsableCount = 0;
        }
        
    }
    
}


function GameLoop(){ // ----------------------------------------------------------------------------------------GameLoop----------------------------------------------------------------------------------------------------------------

    if(GameState == 0){ // esc

    }
    
    if(GameState == 1){ // Menu
        HighScore()
    }

    if(GameState == 3){ // Game Over
        //Storage.setItem('New',PlayerName +"-"+killCounter);
        RestartBtn.style.display = "block"
        HelpBtn.style.display = "block"
        HighScore()
        ScoreList.style.display = "block"
        Name.style.display = "block"
    }


    if(GameState == 2){ //------------------------------------------------------------Game-------------------------------------------------------------    
    //--------------------------------------------------------------------------Player GameLoop-----------------------------------------------------------
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(Background,0,0, canvas.width, canvas.height)

        

        if(keyPresses.Escape){
            EscapeButton()
        }

        if(PlayerHealth <= 0){
            AllSet = false
            GameState = 3
            console.log("Game Over")
            

        }

        invinsableCount++
        var moving = false;
        if (keyPresses.w) {
            moveCharacter(0, -MovementSpeed, FACING_UP);
            moving = true;
        }

        if (keyPresses.s) {
            moveCharacter(0, MovementSpeed, FACING_DOWN);
            moving = true;
        }



        if (keyPresses.a) {
            moveCharacter(-MovementSpeed, 0, FACING_LEFT);
            moving = true;
        } 
        else if (keyPresses.d) {
            moveCharacter(MovementSpeed, 0, FACING_RIGHT);
            moving = true;
        }

        if(moving){
            frameCount++;
            if(frameCount>= frameLimit){
                frameCount = 0;
                animationframe++
                if(animationframe >= 4){
                    animationframe = 0;
                }
            }
        }
        if(!moving && currentDirection == FACING_RIGHT){
            animationframe = 1;
        }
        if(!moving && currentDirection != FACING_RIGHT){
            animationframe = 0;
        }

    //--------------------------------------------------------------------------Bullet GameLoop-----------------------------------------------------------

        if (keyPresses.e) {
            if(bulletCooldown <= 0){
                let b = new bullet(PlayerX+(PWith/2),PlayerY+(PHeight/2),true,currentDirection,30)
                bullets.push(b);
                bulletCooldown = 15; // hversu mikill tími er á milli skota
            }   
        }
        if(bulletCooldown >=0){bulletCooldown--}

        if(bullets.length >0){
            for(let i = 0; i < bullets.length; i++) {
                if(bullets[i].exist == true) {
                    //console.log("if")
                    bullets[i].draw();
                    bullets[i].update();
                    bullets[i].collisionDetect();
                }
                else{
                    bullets.splice(i, 1); // Eyðir byssukúluni úr listanum
                }
            }
        }

    //--------------------------------------------------------------------------Zombie GameLoop-----------------------------------------------------------
        if(spCount >= ZombieSpawnRate ){
            //Lætur zombie'ana spawn´a á random stöðum fyrir utan skjáinn
            var side = Random(1,5)
            if(side == 1){ //vinstri
                let Z = new Zombie(-PWith,Random(0,height));
                Zombies.push(Z);
            }
            if(side == 2){//hægri
                let Z = new Zombie(width+PWith,Random(0,height));
                Zombies.push(Z);
            }
            if(side == 3){//uppi
                let Z = new Zombie(Random(0,width),-PHeight);
                Zombies.push(Z);
            }
            if(side == 4){//niðri
                let Z = new Zombie(Random(0,width),height+PHeight);
                Zombies.push(Z);
            }
            
            spCount = 0;
        }
        else{
            spCount++
        }

        
        if(Zombies.length > 0){
            for(var zz = 0; zz<Zombies.length; zz++)
                if(Zombies[zz].exist == true){
                    Zombies[zz].update()
                    Zombies[zz].draw()
                    Zombies[zz].collisionDetect() 
                }
                else{
                    Zombies.splice(zz,1)
                }     
        }






        DrawSprite(PlayerSS,animationframe,currentDirection,PlayerX, PlayerY);
        drawScore()
        drawHealth()

        window.requestAnimationFrame(GameLoop);
    }
}


