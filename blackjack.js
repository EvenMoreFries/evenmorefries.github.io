"use strict";
const Canvas = document.getElementById("gameCanvas");
const Context = Canvas.getContext("2d");

let deck = [];
let playerHand = [];
let dealerHand = [];
let score = 0;
let dealerScore = 0;
let ended = 0;
let wagered = 1;
let wager = 0;
let aces = 0;
let message = "";
let dDrawn = 0;
let dDrawBlock = 1;
let chipsText = document.getElementById("chipsText");
let chips = 200; // load from cookies

function reset()
{
    document.cookie = "chips=200; domain=.evenmorefries.github.io;";
}

function Start()
{
    let cookie = document.cookie;
    chips = 200;
    chips = cookie.slice(6).substring(0, cookie.length - 27);
    console.log(cookie);
    CreateDeck();
    DealerDraw();
    DealerDraw();
    PlayerDraw();
    dDrawBlock = 0;
}


function StartGame()
{
    if (ended || !wagered)
    {
        return;
    }
    chips -= wager;
    if (wager > 0)
    {
        wagered = 0;
    }
}

function IncreaseWager(num)
{
    if (wager + num > chips || ended)
    {
        return;
    }
    
    wager += num;
    if (wager < 0)
    {
        wager = 0;
    }
}

function EndGame()
{
    let hawk = false;
    if (ended == 1 || wagered == 1)
    {
        return;
    }
    playerHand.forEach(card => 
    {
        if (card.rankName == "Ace" && score > 21 && aces > 0)
        {
            aces--;
            score -= 10;
            if (score < 21)
            {
                hawk = true;
            }
        }
    }
    );
    if (hawk)
    {
        return;
    }
    ended = 1;
    if (score <= 21 && score >= dealerScore)
    {
        let mult = 1.5;
        message = "You win.";
        if (wager >= 100)
        {
            mult = 1.75;
            if (wager >= 200)
            {
                mult = 2;
                if (wager >= 500)
                {
                    mult = 3;
                }
            }
        }
        if (score == dealerScore)
        {
            mult = 1;
        }
        chips += Math.floor(wager * mult);
    }    
    else
    {
        if (score > 21)
        {
            message = "You busted.";
        }
        else
        {
            message = "You lose. You had " + score + ", and the dealer had " + dealerScore + ".";
        }
        if (score == dealerScore)
        {
            message = "You drew.";
        }
    }
}

function Update()
{
    document.cookie = "chips=" + chips +"; domain=.evenmorefries.github.io;";
    chipsText.textContent = "Chips: "+ chips;
    if (!ended)
    {
        message = score;
    }
    if (score > 20)
    {
        EndGame();
    }
    let publicScore = score;
    if (wagered)
    {
        publicScore = "???";
    }
    let publicDScore = dealerScore;
    if (!ended)
    {
        publicDScore = "???";
    }
    if (wagered)
    {
        message = "Confirm wager to start."
    }
    Context.clearRect(0, 0, Canvas.width, Canvas.height);
    Context.fillStyle = "#334433";
    Context.fillRect(0, 0, 720, 480);
    Context.font = "20px sans-serif";
    Context.fillStyle = "#FFFFFF";
    Context.fillText(message, 5, 166);
    let message2 = "You wagered " + wager + " chips.";
    if (wager == 0)
    {
        message2 = "Select a wager.";
    }
    Context.fillText(message2, 5, 190);
    Context.font = "10px sans-serif";
    Context.fillText("Dealer's hand: " + publicDScore, 6, 11);
    Context.fillText("Your hand: " + publicScore, 6, 82);
    let i = 0;
    let j = 0;
    playerHand.forEach(card =>
    {
        let prefix = "";
        switch(card.suit)
        {
            case 0:
                prefix = "s";
                break;
            case 1:
                prefix = "c";
                break;
            case 2:
                prefix = "h";
                break;
            case 3:
                prefix = "d";
                break;
        }
        const image = new Image();
        if (!wagered)
        {
            image.src = "./images/" + prefix + card.rank + ".png";
        }
        else
        {
            image.src = "./images/back.png";
        }
        Context.drawImage(image, 5 + (44 * i), 86);
        i++;
    }
    );
    dealerHand.forEach(card =>
        {
            let prefix = "";
            switch(card.suit)
            {
                case 0:
                    prefix = "s";
                    break;
                case 1:
                    prefix = "c";
                    break;
                case 2:
                    prefix = "h";
                    break;
                case 3:
                    prefix = "d";
                    break;
            }
            const image = new Image();
            if (ended)
            {
                image.src = "./images/" + prefix + card.rank + ".png";
            }
            else
            {
                image.src = "./images/back.png";
            }
            Context.drawImage(image, 5 + (44 * j), 15);
            j++;
        }
    );
    requestAnimationFrame(Update);
}

function GetRandomInt(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function PlayerDraw()
{
    if (playerHand.length == 1 && wagered == 1)
    {
        return;
    }
    if (ended)
    {
        return;
    }
    if (dealerScore < 11 && dDrawn == 0 && dDrawBlock == 0)
    {   
        dDrawn = 1;
        DealerDraw();
    }
    if (score < 21 || !ended)
    {
        let selected = GetRandomInt(0, deck.length - 1);
        score += deck[selected].value;
        if (deck[selected].rankName == "Ace")
        {   
            aces++;
            if (score > 21)
            {
                score -= 10;
                aces--;
            }
        }    
        playerHand.push(deck[selected]);
        deck.splice(selected, 1);
    }
}

function DealerDraw()
{
    let selected = GetRandomInt(0, deck.length - 1);
    console.log(selected);
    console.log(selected.value);
    dealerScore += deck[selected].value;
    dealerHand.push(deck[selected]);
    deck.splice(selected, 1);
}

function CreateDeck()
{
    for (let i = 1; i <= 13; i++)
    {
        for (let j = 0; j <= 3; j++)
            {
                AddCard(i, j);
            }
    }
}

function AddCard(arank, asuit)
{
    // 1 = Ace, 11 = Jack, 12 = Queen, 13 = King
    // 0 = Spades, 1 = Clubs, 2 = Hearts, 3 = Diamonds
    let card = 
    {
        rank: "",
        suit: "",
        value: 0,
        rankName: "",
        suitName: ""
    }
    card.rank = arank;
    card.suit = asuit;
    card.value = arank;
    card.rankName = card.value;
    if (card.rank > 10)
    {
        card.value = 10;
        switch(card.rank)
    {
        case 11:
            card.rankName = "Jack";
            break;
        case 12:
            card.rankName = "Queen";
            break;
        case 13:
            card.rankName = "King";
            break;
    }
    }
    if (card.rank == 1)
    {
        card.rankName = "Ace";
        card.value = 11;
    }
    switch(card.suit)
    {
        case 0:
            card.suitName = "Spades";
            break;
        case 1:
            card.suitName = "Clubs";
            break;
        case 2:
            card.suitName = "Hearts";
            break;
        case 3:
            card.suitName = "Diamonds";
            break;

    }
    console.log(card.rankName);
    deck.push(card);
}

document.onload = Start();
requestAnimationFrame(Update);