let gameAreaSize = null;
let world = [];
let worldHistory = [];
let populationCycle = null;


//////////////////
///
/// Getting user input
///
//////////////////

let submitGameAreaBtn = document.querySelector(`#submit-game-area-size`);
let startWorldBtn = document.querySelector(`#start-world`);
let chance = document.querySelector(`#select-chance`).value;
let selectChance = document.querySelector(`#select-chance`);

selectChance.addEventListener('change', function() {
    chance = document.querySelector(`#select-chance`).value;
});

submitGameAreaBtn.addEventListener('click', function() {
    gameAreaSize = Number(document.querySelector(`#game-area-size`).value);
    world = [];
    worldHistory = [];
    createWorld(gameAreaSize);
    
    document.querySelector(`#game-area-size`).value = ``;
    document.querySelector(`.end-of-cyle-header`).innerText = ``;
    document.querySelector(`#start-world`).disabled = false;
    
});

startWorldBtn.addEventListener('click', function () {
    populationCycle = setInterval(function(){lifeCycle(world)}, 300);
}); 

//////////////////
///
/// Creating world
///
//////////////////

function createWorld(gameAreaSize) {
    for (let i = 0; i < gameAreaSize; i++) {
        world.push([]);
        for (let e = 0; e < gameAreaSize; e++) {
            world[i].push(randomNumber());            
        }       
    }
    drawGameArea(world);
    worldHistory.push(world);
}

function randomNumber() {
    let randomNumber = Math.random(); 
    if (randomNumber > chance) {
        return 1;
    }
    return 0;
}

//////////////////
///
/// Printing game area
///
//////////////////

function drawGameArea(world) {
    let rowHTML = ``;
    for (let i = 0; i < world.length; i++) {
        let cellHTML = '';
        for (let e = 0; e < world.length; e++) {
            let isAlive = isCellAlive(world, i, e);
            let cell = `<div class="gameCell ${isAlive}" id=""></div>`;
            cellHTML += cell; 
        }
        rowHTML += `<div class="game-row-wrapper">${cellHTML}</div>`;
    }
    document.querySelector('.grid-container').innerHTML = rowHTML;
}

function isCellAlive(world, row, place) {
    if (world[row][place]) {
        return `alive`;
    }
    return ``
}

//////////////////
///
/// Create life
///
//////////////////

function lifeCycle(previousWorld) {
    let newWorld = nextWorld(previousWorld);
    drawGameArea(newWorld);
    isPopulationEvolving(previousWorld, newWorld);
    world = newWorld;
    worldHistory.push(newWorld);
}

function nextWorld(previousWorld) {
    let newWorld = [];
    for (let i = 0; i < previousWorld.length; i++) {
        newWorld.push([])
        for (let e = 0; e < previousWorld.length; e++) {
            newWorld[i].push(checkNeighbours(previousWorld, i, e));    
        }
    }
    return newWorld;
}

function checkNeighbours(previousWorld, row, place) {
    let countNeighbours = 0;
    let result;

    let rowLimit = previousWorld.length-1;
    let columnLimit = previousWorld[0].length-1;
      
    for(let x = Math.max(0, row-1); x <= Math.min(row+1, rowLimit); x++) {
        for(let y = Math.max(0, place-1); y <= Math.min(place+1, columnLimit); y++) {
            if(x !== row || y !== place) {
            countNeighbours += previousWorld[x][y];
            }
        }
    }

    switch (previousWorld[row][place]) {
        case 1:
            if (countNeighbours < 2 || countNeighbours > 3) {
                result = 0;
                return result;
            }
            if (countNeighbours == 2 || countNeighbours == 3) {
                result = 1;
                return result;
            }
            break;
    
        case 0:
            if (countNeighbours == 3) {
                result = 1;
                return result;
            }
            result = 0;
            return result;
    }
}

function isPopulationEvolving(previousWorld, newWorld) {
    if (JSON.stringify(previousWorld) === JSON.stringify(newWorld)) {
        let header = `Population stoped`;
        clearInterval(populationCycle);
        populationEndInfo(header);
        return;
    }
    for (let i = (worldHistory.length - 1); i >= 0; i--) {
        if (JSON.stringify(worldHistory[i]) == JSON.stringify(newWorld)) {
            let header = `Population cycled ${Number(worldHistory.length) - i} times`;
            
            clearInterval(populationCycle);
            populationEndInfo(header);
            return;
        } 
    }
}

//////////////////
///
/// Adding info to screen after cycle ends
///
//////////////////

function populationEndInfo(header) {
    let headerText = `${header}`;
    document.querySelector(`.end-of-cyle-header`).innerText = headerText;
}

// console.log(world);
// console.log('REPEATS-------------');
// console.log(worldHistory[worldHistory.length-6]);
// console.log(worldHistory[worldHistory.length-5]);
// console.log(worldHistory[worldHistory.length-4]);
// console.log(worldHistory[worldHistory.length-3]);
// console.log(worldHistory[worldHistory.length-2]);
// console.log(worldHistory[worldHistory.length-1]);