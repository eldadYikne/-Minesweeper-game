'use strict'
const LIFE = '💖'
const BOMB = '💣'
const FLAG = '🚩'
const HINT = '💡'
const CRY = '<img  src="img/cry.png" />'
const HAPPY = '<img  src="img/cool.png" />'
const GAMEOVER = '<img style= width:100px src="img/game-over.png" />'
const VICTORY = '<img style= width:100px src="img/star.png" />'
var gBoard
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
}
var gCellClickIsFlag=false
var gCellNumber = ''
var cellInput
var gStartTime
var gInterval
var gsec
var isHint = false
var gCountClick = 0
var lastScores
var isRightMB = false
var gLifeCounter = 3
var gHintCounter = 3
var gSafeCellCount = 3
init()
function init() {
    buildBoard()
    creatMines()
    renderCells()
    renderBoard()
    liveCounter()
    hint()
}
function buildBoard() {

    gBoard = createMat(gLevel.size, gLevel.size)


}

function creatMines() {
    for (var i = 0; i < gLevel.mines; i++) {
        var randomNum1 = getRandomInt(0, gBoard.length - 1)
        var randomNum2 = getRandomInt(0, gBoard.length - 1)
        var randomNumObj = { i: randomNum1, j: randomNum2 }

        if (isEmptyCell(randomNumObj)) {
            gBoard[randomNum1][randomNum2].isMine = true
        } else {
            i--
        }
    }
}
function renderBoard() {

    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < gBoard[i].length; j++) {

            var cellInput = gBoard[i][j].isMine === true ? BOMB : gBoard[i][j].minesAroundCount

            strHTML += `\n<td class="cell" data-i="${i}" data-j="${j}" onmousedown=cellMarked(event)
             onclick="cellClicked(this, ${i}, ${j})" >
            ${cellInput} </td>`

        }
        strHTML += `</tr>`
    }


    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}


function renderCells() {
    var shownCounter = 0
    var markedCounter = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]

            var minesNeighbors = setMinesNegsCount(gBoard, i, j)
            if (!currCell.isMine) {
                if (minesNeighbors > 0) {
                    currCell.minesAroundCount = minesNeighbors
                    gCellNumber = currCell.minesAroundCount
                } else {
                    currCell.minesAroundCount = ''
                }
            }
            if (currCell.isShown) shownCounter++

            if (currCell.isMarked) markedCounter++


        }
    }
    gGame.shownCount = shownCounter
    gGame.markedCount = markedCounter

}


function cellClicked(elCell, i, j) {
    if (gGame.isOn) return
    if (elCell.innerText === FLAG) return
    isVictory()
    if(gCellClickIsFlag){
        cellMarked()
        return
    }
    if (gBoard[i][j].isShown) return
    if (isHint) {
        var neighbors = setNoMinesCellsNegs(gBoard, i, j)
        console.log(neighbors);
        for (var i = 0; i < neighbors.length; i++) {
            var elneighbor = document.querySelector(`[data-i="${neighbors[i].i}"][data-j="${neighbors[i].j}"]`)
            if (!gBoard[neighbors[i].i][neighbors[i].j].isShown) {
                elneighbor.classList.add('clicked')
                setTimeOut(i, neighbors)
                isHint = false
            }
        }
        return
    }

    if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
        if(gBoard[i][j].minesAroundCount===''){

            gBoard[i][j].isShown = true
            recursionNeg(gBoard, i, j)
        }
        
    }
    gCountClick++
    if (gCountClick === 1) {
        startTimer()
        gStartTime = Date.now();
    }
   
    

    var currCell = gBoard[i][j]
    currCell.isShown = true
    if (!currCell.isMine) {
        elCell.innerText = currCell.minesAroundCount
        elCell.classList.add('clicked')
        elCell.style.color = 'black'
    } else if (currCell.isMine === true) {
        elCell.classList.add('clicked')
        elCell.style.color = 'black'
        gLifeCounter--
        liveCounter()
        if (gLifeCounter === 0) {

            var mineOnBorad = showMine()
            for (var i = 0; i < mineOnBorad.length; i++) {
                var elMineCell = document.querySelector(`[data-i="${mineOnBorad[i].i}"][data-j="${mineOnBorad[i].j}"]`)
                elMineCell.innerText = BOMB
                elMineCell.classList.add('clicked')
                elMineCell.classList.remove('transparent')
                elMineCell.innerText = BOMB
                elMineCell.style.backgroundColor = 'rgba(216, 107, 116, 0.862)'

                gameOver()
            }
        }
    }
}


function findNoMineNeg(gBoard, i, j) {
    var cellsNotMines = setNoMinesCellsNegs(gBoard, i, j)
    console.log(cellsNotMines);
    for (var i = 0; i < cellsNotMines.length; i++) {
        var elNoMineCell = document.querySelector(`[data-i="${cellsNotMines[i].i}"][data-j="${cellsNotMines[i].j}"]`)
        gBoard[cellsNotMines[i].i][cellsNotMines[i].j].isShown = true
        elNoMineCell.classList.add('clicked')
    }
}
function setTimeOut(i, neighbors) {
    setTimeout(() => {
        var elneighbor = document.querySelector(`[data-i="${neighbors[i].i}"][data-j="${neighbors[i].j}"]`)
        elneighbor.classList.remove('clicked')

    },
        1000)

}

function recursionNeg(mat, rowIdx, CollIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = CollIdx - 1; j <= CollIdx + 1; j++) {
            if (j < 0 || j > mat[i].length - 1) continue
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.classList.add('clicked')
            if (mat[i][j].minesAroundCount === '' && !mat[i][j].isShown) {
                mat[i][j].isShown = true
               
                recursionNeg(mat, i, j)
            }



        }

    }

}
function setMinesNegsCount(mat, rowIdx, CollIdx) {
    var mineNegsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (mat[rowIdx][CollIdx].isMine === true) continue
        if (i < 0 || i >= mat.length) continue
        for (var j = CollIdx - 1; j <= CollIdx + 1; j++) {
            if (rowIdx === i && CollIdx === j) continue
            if (j < 0 || j > mat[i].length - 1) continue

            if (mat[i][j].isMine === true) {
                mineNegsCount++
                gBoard[rowIdx][CollIdx].minesAroundCount++

            }
        }
    }
    return mineNegsCount
}
function setNoMinesCellsNegs(mat, rowIdx, CollIdx) {
    var noMineCellNegs = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = CollIdx - 1; j <= CollIdx + 1; j++) {
            if (j < 0 || j > mat[i].length - 1) continue
            if (!mat[i][j].isMarked) {
                noMineCellNegs.push({ i, j })

            }

        }
    }
    return noMineCellNegs
}

function isVictory() {
    var mineOnBorad = showMine()
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine === true) continue
            if (gBoard[i][j].isShown !== true) return
        }
    }
    console.log(mineOnBorad);
    for (var i = 0; i < mineOnBorad.length; i++) {

        if (!gBoard[mineOnBorad[i].i][mineOnBorad[i].j].isShown &&
            !gBoard[mineOnBorad[i].i][mineOnBorad[i].j].isMarked) return
        if (!gBoard[mineOnBorad[i].i][mineOnBorad[i].j].isShown &&
            gBoard[mineOnBorad[i].i][mineOnBorad[i].j].isMarked) {

        }


    }
    var elRstBtn = document.querySelector('.rstbtn')
    elRstBtn.innerHTML = VICTORY
    clearInterval(gInterval)
    gCountClick = 0
    gGame.isOn = true
    gLifeCounter = 3
    gHintCounter = 3
    gSafeCellCount = 3

}
function levelCoice(elBtn) {
    if (elBtn.innerText === 'Beginner') {
        gLevel.size = 4
        gLevel.mines = 2
    }
    if (elBtn.innerText === 'Smart-Guy') {
        gLevel.size = 8
        gLevel.mines = 12
    }
    if (elBtn.innerText === 'Totaly Crazy') {
        gLevel.size = 12
        gLevel.mines = 30
    }
    gLifeCounter = 3
    gHintCounter = 3
    clearInterval(gInterval)
    gStartTime = Date.now()
    gCountClick = 0
    init()
}
function gameOver() {
    var elScor = document.querySelector('.score')
    elScor.innerHTML =
        `<table class="time">
    <tr>
    <th>score</th>
    <th>time</th>
    </tr>
    <tr>
    <td>${gCountClick}</td>
    <td>${gsec}</td>
    </tr>
  </table>`
    var elRstBtn = document.querySelector('.rstbtn')
    elRstBtn.innerHTML = CRY
    clearInterval(gInterval)
    gStartTime = Date.now()
    gCountClick = 0
    gGame.isOn = true
    if (gLifeCounter === 0) {
        elRstBtn.innerHTML = GAMEOVER
        gLifeCounter = 3
        gHintCounter = 3
        gSafeCellCount = 3
    }
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j].isMine === false
}

function startTimer() {
    var strHTML = ''
    gInterval = setInterval(function () {
        var currTime = Date.now() - gStartTime;
        var sec = currTime / 1000
        var elTimer = document.querySelector('.timer')
        strHTML = sec
        elTimer.innerHTML = ` timer:${strHTML}`
        gsec = sec
    }, 1)
}

function showMine() {
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine === true) {
                mines.push({ i, j })

            }

        }
    }
    return mines
}

function rstBtn() {
    gGame.isOn = false
    clearInterval(gInterval)
    gStartTime = Date.now()
    var elRstBtn = document.querySelector('.rstbtn')
    elRstBtn.innerHTML = HAPPY
    gSafeCellCount = 3
    init()
}

function cellMarked(ev) {
    if (ev.button === 2||gCellClickIsFlag) {
        if (gGame.isOn) return
        var currCell = gBoard[ev.target.dataset.i][ev.target.dataset.j]
        // ev.target.dataset
        if (ev.target.innerText === FLAG) {
            currCell.isMarked = false
            ev.target.style.color = 'transparent'
            if (currCell.isMine === true) {
                ev.target.innerText = BOMB
            } else {
                ev.target.innerText = currCell.minesAroundCount
            }
        } else {
            if (currCell.isShown === true) return
            currCell.isMarked = true
            ev.target.style.color = 'black'
            ev.target.innerText = FLAG

        }

        gCountClick++
        if (gCountClick === 1) {
            startTimer()
            gStartTime = Date.now();
        }
        isVictory()

    }
}
function liveCounter() {
    var elLife = document.querySelector('.live')
    var str = ''

    for (var i = 0; i < gLifeCounter; i++) {
        str += LIFE
    }
    elLife.innerText = str


}
function hint(elBtn) {
    if (gLifeCounter === 0) return
    if (elBtn) {
        gHintCounter--
        isHint = true
    }
    var elLife = document.querySelector('.hint')
    var str = ''
    for (var i = 0; i < gHintCounter; i++) {
        str += HINT
    }
    elLife.innerText = str


}
function safeClick() {
    if (gSafeCellCount === 0) return
    gSafeCellCount--
    var safeCells = []
    console.log('hey');
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                safeCells.push({ i, j })
            }
        }
    }
    var safeCell = safeCells.splice(getRandomInt(0, safeCells.length - 1), 1)
    console.log(safeCell);
    var elCell = document.querySelector(`[data-i="${safeCell[0].i}"][data-j="${safeCell[0].j}"]`)
    // elCell.style.backgroundColor='gray'
    console.log(elCell);
    elCell.classList.add('issafe')
    setTimeout(() => {
        elCell.classList.remove('issafe')
    }, 1000)
}
function putFlag(elBtn){
    gCellClickIsFlag=!gCellClickIsFlag
    if(gCellClickIsFlag){
    elBtn.style.backgroundColor='gray'
    console.log('flag true');
}else{
    console.log('flag flase');
    // cellClickIsFlag=false
    elBtn.style.backgroundColor='transparent'

}
}
const noContext = document.getElementById('noContextMenu');
noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
});


