"use strict";
const Canvas = document.getElementById("gameCanvas");
const Context = Canvas.getContext("2d");

let Symbols = ["cherry", "clover", "apple", "orange", "horseshoe", "bell", "heart", "7", "cherry", "clover", "apple"]
let FinalSymbols = [];
let AllSlots = [];
let Chosen = []
let Result = [];
let time = 0;
let deltaTime = 0;
let counter = 0;
let i = 0;
let prize = 5000;
let playing = false
let speed = 1;
let chips = 200;
let chipsText = document.getElementById("chipsText");

function Start()
{
    // load chips from cookies
    let cookie = document.cookie;
    chips = 200;
    if (cookie.includes(";"))
    {
        chips = cookie.slice(6).substring(0, cookie.length - 6);
    }
    time = Date.now();
    CreateSlots();
}

function CreateSlots()
{
    for (let i = 0; i <= 2; i++) 
    {
        let slot =
        {
            id: i,
            x: 0,
            y: 0,
            time: 1,
            speed: 1
        }
        AllSlots.push(slot);
    }
    let j = 0;
    let one = 0;
    let two = 0;
    let three = 0;
    Symbols.forEach(symbol => {
        j++;
        let square = 
        {
            id: j,
            name: symbol,
            color: "#" + j.toString()+ j.toString()+ j.toString()+ j.toString()+ j.toString()+ j.toString(),
            image: ""
        }
        FinalSymbols.push(square);
    });
}

function Play()
{
    if (chips < 20)
    {
        return
    }
    chips -= 20;
    if (playing)
    {
        return;
    }
    counter = 0;
    playing = true;
    Chosen = [];
    Result = [];
    ChoseSymbol();
    ChoseSymbol();
    ChoseSymbol();
    let i = 0;
    AllSlots.forEach(slot => 
    {
        slot.speed = 1;
        slot.time = ((GetRandomInt(0, 9) / 4) + (i+1) * 2);
        console.log(Symbols.indexOf(Chosen[i]));
        i++;
    }) 
    if (Chosen[0] == Chosen[2])
    {
        let temp1 = Chosen[1];
        Chosen[1] = Chosen[2];
        Chosen[2] = temp1;
    }
    else
    {
        if (Chosen[1] == Chosen[2])
            {
                let temp0 = Chosen[0];
                Chosen[0] = Chosen[2];
                Chosen[2] = temp0;
            }
    }
    prize += 10;
}

function ChoseSymbol()
{
    let cs = Symbols[GetRandomInt(0, 7)];
    Chosen.push(cs);
}

function Update()
{
    document.cookie = "chips=" + chips + "; domain=.evenmorefries.github.io;";
    Context.font = "20px sans-serif";
    let message = ""
    chipsText.textContent = "Chips: "+ chips;
    Context.clearRect(0, 0, Canvas.width, Canvas.height);
    Context.fillStyle = "white";
    Context.fillText(message, 240, 107.5);
    Context.fillRect(0, 99, 220, 2);
    deltaTime = (Date.now() - time) / 1000;
    time = Date.now();
    if (playing)
    {
        counter += deltaTime;
    }
    let zeroed = 0;
    AllSlots.forEach(slot => 
    {
        FinalSymbols.forEach(symbol => 
        {
            let image = new Image();
            image.src = "./images/" + symbol.name + ".png";
            let x = (slot.id) * 70 + 10;
            let y = (symbol.id - 1) * 60 + slot.y;
            Context.drawImage(image, x, y);
        })
        if (playing)
        {
            slot.y += slot.speed * 240 * deltaTime * 2;
            slot.time -= deltaTime;
            if (slot.y > 0)
            {
                slot.y = -480;
            }
            if (slot.time < 0)
            {
                slot.speed /= 1 + (2.5 * deltaTime);
            }
            if (slot.speed < 0.125)
            {
                slot.speed /= 1 + (3 * deltaTime);
            }
            if (slot.speed < 0.05)
            {
                slot.speed = 0.05;
                console.log(Math.round(slot.y - 1) % 60);
                if ((Math.round(slot.y / -1)) % 60 <= 2)
                {
                    slot.speed = 0;
                    zeroed++;
                }
            }
        }
    });
    if (zeroed == 3 && playing)
    {
        AllSlots.forEach(slot =>
        {
            let chosen = -slot.y / 60;
            chosen = Math.floor(chosen + 1);
            Result.push(Symbols[chosen]);
        })
        playing = false;
        if (Result[0] == Result[1] && Result[0] == Result[2])
        {
            if (Result[0] == "7")
            {
                chips += 500;
            }
            else
            {
                chips += 2500;
            }
        }
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