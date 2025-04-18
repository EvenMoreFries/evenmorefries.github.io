"use strict";

const Canvas = document.getElementById("gameCanvas");
const Context = Canvas.getContext("2d");

let time = 0;
let deltaTime = 0;
let chips = 200;
let chipsText = document.getElementById("chipsText");
let wheelImg = new Image();
let wheel = document.getElementById("wheel");
let rot = 0;
let speed = 5;
let total = 0;
let timeLeft = 0;
let timeTotal = 0;
let tiles = [-1, 200, 50, 100, 0, 200, 50, 100, 0, 200, -2, 100, 0, 200, 50, 100, 0, 200, 50, 100, -1];
let won = 0;
let cost = 100;
let first = 0;
let going = false;
let jackpot = 0;

function Start()
{
    let cookie = document.cookie;
    if (cookie.length > 6)
    {
        chips = cookie.slice(6).substring(0, cookie.length - 6);
        document.cookie = "chips=" + chips + "; domain=.evenmorefries.github.io;";
    }
    else
    {
        chips = 200;
    }
    console.log(cookie + " " + cookie.slice(6).substring(0, cookie.length - 6))
    wheelImg.src = "./images/wheel.png";
    time = Date.now();
}

function Update()
{
    document.cookie = "chips=" + chips + "; domain=.evenmorefries.github.io;";
    Context.clearRect(0, 0, Canvas.width, Canvas.height);
    let message = "";
    if (first == 0)
    {
        message = "Play for 100 chips.";
    }
    let rotLeft = total - rot;
    timeLeft = (rotLeft / (speed * deltaTime));
    let timeDecimal = timeLeft / timeTotal;
    if (timeDecimal == 0)
    {
        timeDecimal = 1;
    }
    chipsText.textContent = "Chips: "+ chips;
    deltaTime = (Date.now() - time) / 1000;
    time = Date.now();
    if (total - rot > 0)
    {
        rot += deltaTime * speed * ((total-rot)/total) * (Math.PI / 2);
    }
    if (deltaTime * speed * ((total-rot)/total) * (Math.PI / 2) < 0.15)
    {
        speed /= 1 + deltaTime * 5;
    }
    //console.log((rotLeft / (speed * deltaTime)) / 100 + " seconds", rot + " " + total);
    if (speed < 0.175)
    {
        speed = 0;
        let relRot = rot - Math.floor(rot / 360) * 360;
        let prize = tiles[Math.floor((360 - relRot) / 18)];
        message = "You won " + prize + " chips! Play again?";
        if (won == 0)
        {
            if (prize == -2)
            {
                jackpot = GetRandomInt(500, 1500);
                prize = jackpot;
            }
            going = 0;
            chips += prize;
            document.cookie = "chips=" + chips + "; domain=.evenmorefries.github.io;";
            won = 1;
        }
        if (prize == 0)
        {
            message = "You won nothing. Remember that real gamblers never quit.";
        }
        if (prize > 200 || prize == -2)
        {
            message = "You won the jackpot of " + jackpot + " chips! Try your luck again?"
        }
        if (prize == -1)
        {
            chips = 0;
            document.cookie = "chips=" + chips + "; domain=.evenmorefries.github.io;";
            cost = 0;
            message = "You're bankrupt! Remember that real gamblers never quit. Here is one free spin."
        }
    }

    Context.fillStyle = "#FFFFFF";
    Context.font = "25px sans-serif";
    Context.fillText(message, 0, 25);
    document.querySelector("#wheel").style.transform = "rotate("+rot+"deg)";
    requestAnimationFrame(Update);
}

function Play()
{
    if (going)
    {
        return;
    }
    if (chips >= cost)
    {
        going = true;
        first = 1;
        chips -= cost;
        document.cookie = "chips=" + chips +"; domain=.evenmorefries.github.io;";
        cost = 100;
        won = 0;
        speed = 500;
        rot = 0;
        total = GetRandomInt(720, 1440);
        total *= Math.PI / 2;
        timeTotal = (total - rot / (speed * deltaTime));
    }
}

function GetRandomInt(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


document.onload = Start();
requestAnimationFrame(Update);