"use strict";
const Canvas = document.getElementById("gameCanvas");
const Context = Canvas.getContext("2d");

let horses = [];
let names = ["Pranav", "Vedant", "Horse", "Lios", "Mohammed", "Maurice", "Messi", "Jan", "Nived", "Geoff", "Dave", "Tony", "John", "Marquis", "Jimbo", "Steve", "Cole", "Keith","Von", "Abdul", "Hawk", "Odee", "Tooka", "David", "Alex"];
let adjectives = ["Fat", "Great", "Swift", "Massive", "Speedy", "Smelly", "Suspicious", "Black", "White", "King", "Chopped", "Quick", "Destroyer", "Menacing", "Champion", "Lucky", "Little"];
let racing = 0;
let changeTimer = 0;
let over = false;
let winner = 0;
let finalRank = [];
let message = "";
let message2 = "";
let wager = 0;
let pick = 0;
let time = 0;
let deltaTime = 0;
let beaten = 0;
let figuredBeaten = false;
let chips = 200;
let chipsText = document.getElementById("chipsText");

function Start()
{
    let cookie = document.cookie;
    chips = 200;
    if (cookie.includes("chips="))
    {
        chips = cookie.slice(6).substring(0, cookie.length - 6);
    }
    Canvas.width = window.innerWidth;
    CreateHorse();
    CreateHorse();
    CreateHorse();
    CreateHorse();
}

function IncreaseWager(amount)
{
    if (racing == 1)
    {
        return;
    }
    wager += amount;
    if (wager > chips)
    {
        wager = chips;
    }
    if (wager < 0)
    {
        wager = 0;
    }
}

function Wager(horse)
{
    pick = horse;
}

function Begin()
{
    if (pick == 0)
    {
        return;
    }
    chips -= wager;
    racing = 1;
}

function CreateHorse()
{
    let num = horses.length + 1;
    let horse =
    {
        horseName: "",
        id: num,
        currentSpeed: 1.25,
        targetSpeed: 1.1,
        x: 20,
        y: GetRandomInt(0, 5) - 2,
        yDir: 1,
        type: GetRandomInt(1, 10),
        won: false
    }
    let change = GetRandomInt(0, 10) - 5;
    horse.targetSpeed += (change) / 20;
    if (Math.random() > 0.5)
    {
        horse.yDir = -1
        horse.horseName = names[GetRandomInt(0, names.length - 1)] + ", the " + adjectives[GetRandomInt(0, adjectives.length - 1)]
    }
    else
    {
        horse.horseName = adjectives[GetRandomInt(0, adjectives.length - 1)] + " " + names[GetRandomInt(0, names.length - 1)]
    }
    horses.push(horse);
}

function Win()
{
    let mult = 0;
    if (beaten == 0)
    {
        mult = 0;
    }
    if (beaten == 1)
    {
        mult = 0.5;
    }
    if (beaten == 2)
    {
        mult = 1;
    }
    if (beaten == 3)
    {
        mult = 2;
    }
    message2 = "You won " + Math.round(wager * mult) + " chips.";
    let place = 4 - beaten;
    message = "You bet on horse " + pick + ", " + horses[pick - 1].horseName + ", who placed in #" + place + ".";
    chips += Math.round(wager * mult);
}

function Update()
{
    console.log(beaten);
    document.cookie = "chips=" + chips + "; domain=.evenmorefries.github.io;";
    chipsText.textContent = "Chips: "+ chips;
    deltaTime = (Date.now() - time) / 1000;
    if (!over)
    {
        if (pick == 0)
            {
                message = "Select a horse."
            }
            else
            {
                message = "You bet on horse " + pick + ", " + horses[pick - 1].horseName + ".";
            }
        message2 = "You bet " + wager + " chips."
    }
    //if (over)
    //{
    //    if (winner == pick)
    //    {
    //        message = horses[winner - 1].horseName + " is the winner!\nYou gained " + wager + " chips.";
    //    }
    //    else
    //    {
    //        message = horses[winner - 1].horseName + " is the winner!\nYou lost " + wager + " chips.";
    //    }
    //}
    Context.clearRect(0, 0, Canvas.width, Canvas.height);
    horses.forEach(horse => 
    {
    Context.fillStyle = "#704E2F";
    Context.fillRect(0, 20 + (horse.id - 1)* 45, Canvas.width - 20, 32);
    });
    Context.fillStyle = "white";
    Context.font = "20px sans-serif";
    Context.fillText(message, 5, 210);
    Context.fillText(message2, 5, 240);
    Context.fillRect(Canvas.width - 65, 20, 5, 167);
    horses.forEach(horse => 
    {
    Context.fillStyle = "white";
    Context.font = "10px sans-serif";
    Context.fillText(horse.horseName, 5, 17.5 + (horse.id - 1)* 45);
    Context.font = "20px sans-serif";
    Context.fillText(horse.id, 5, 43 + (horse.id - 1)* 45);
    Context.fillStyle = "#5B3411";
    let horsePic = new Image();
    horsePic.src = "./images/horse(" + horse.type + ").png";
    Context.drawImage(horsePic, horse.x, (23.5 + horse.y) + (horse.id - 1)* 45);
    time = Date.now();
    });

    if (racing)
    {
        if (!over)
        {
            changeTimer += deltaTime;
        }
        let winCount = 0;
        horses.forEach(horse =>
        {
        if(horse.x > Canvas.width - 60)
        {
            winCount++;
            horse.won = true;
            if (horse = horses[pick - 1] && horse.won == false)
            {
                beaten = winCount;
            }
        }
        if (horse.won)
        {
            horse.currentSpeed = 0;
        }
        if (winCount == 4)
        {
            if(!over)
            {
                Win();
            }
            over = true;
        }
        if (changeTimer > 1.5)
        {
            let change = GetRandomInt(0, 10) - 4;
            horse.targetSpeed += (change) / 15;
            if (horse.targetSpeed < 1)
            {
                horse.targetSpeed = 1;
            }
            if (horse.targetSpeed > 2.4)
            {
                horse.targetSpeed = 2.4;
            }
        }
        if (!horse.won) 
        {
            horse.x += horse.currentSpeed * deltaTime * 60;
            horse.y += deltaTime * 3 * horse.yDir * horse.currentSpeed;
        }    
        if (horse.y > 3)
        {
            horse.yDir = -1;
        }
        if (horse.y < -2)
        {
            horse.yDir = 1;
        }
        if (horse.targetSpeed > horse.currentSpeed)
        {
            horse.currentSpeed += deltaTime / 3;
        }
        if (horse.targetSpeed < horse.currentSpeed)
        {
            horse.currentSpeed -= deltaTime / 3;
        }
        });
    }
    if (changeTimer > 1.4)
    {
        changeTimer = 0;
    }
    requestAnimationFrame(Update);
}

function GetRandomInt(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


document.onload = Start();
requestAnimationFrame(Update);