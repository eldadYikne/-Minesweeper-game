function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}
function getEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[i].length; j++) {
        if (gBoard[i][j].gameElement === null && gBoard[i][j].type !== WALL)
          emptyCells.push({ i, j })
      }
    }
    return emptyCells
  }
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getSelector(coordObj) {
    return '#cell-' + coordObj.i + '-' + coordObj.j
}
function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
             })
        }
        mat.push(row)
    }
    return mat
}
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;

    }

}
function printMat(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function drawNum(nums) {
    // console.log(`gNums.length:`, gNums.length)
    var num = getRandomInt(0, nums.length)
    var removedNum = nums.splice(num, 1)
    // console.log(`gNums:`, gNums)
    return removedNum
}
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}
function randomArraySort(array) {
    var shuffledArray = array.sort((a, b) => 0.5 - Math.random());
    return shuffledArray
}
function startTimer() {
    if (count) {
        miliSec = parseInt(miliSec)
        sec = parseInt(sec)
        min = parseInt(min)

        miliSec += 48

        if (miliSec >= 1000) {
            sec++
            miliSec = 0
        }

        if (sec == 60) {
            min++
            sec = 0
            miliSec = 0
        }

        if (miliSec < 10) {
            miliSec = '0' + miliSec
        }

        if (sec < 10) {
            sec = '0' + sec
        }

        if (min < 10) {
            min = '0' + min
        }
        stopWatch.innerText = min + ' : ' + sec + ' : ' + miliSec
        // setTimeout('startTimer()', 0050)
    }
}
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}
function addGameElement(element, renderEl) {
    var emptyCells = getEmptyCells()
    if (emptyCells.length === 0) return
  
    var emptyCell = drawNum(emptyCells)
    var i = emptyCell[0].i
    var j = emptyCell[0].j
    gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = element
    renderCell({ i, j }, renderEl)
  
    if (element === BALL) gBallsLeft++
    else if (element === GLUE) {
      setTimeout(() => {
        if (gBoard[emptyCell[0].i][emptyCell[0].j].gameElement === GLUE) {
          gBoard[emptyCell[0].i][emptyCell[0].j].gameElement = null
          renderCell({ i, j })
        }
      }, 3000)
    }
  
}
function countNeighbors(mat, rowIdx, CollIdx) {
    var neigborsCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = CollIdx - 1; j <= CollIdx + 1; j++) {
            if (rowIdx === i && CollIdx === j) continue
            if (j < 0 || j > mat[i].length) continue
            if (mat[i][j] === life) {
                neigborsCount++
            }
        }
    }
    // console.log('neigborsCount',neigborsCount);
    return neigborsCount
}