// Timer
var timeInterval;
function timer(){
    document.getElementById('start').classList.add("hide");
    var min = document.getElementById("minutes");
    var sec = document.getElementById("seconds");
    var totalSeconds = 0;
    timeInterval = setInterval(setTime, 1000);

    function setTime() {
    ++totalSeconds;
    sec.innerHTML = cal(totalSeconds % 60);
    min.innerHTML = cal(parseInt(totalSeconds / 60));
    }

    function cal(val) {
        var valString = val.toString();
        if (valString.length < 2) {
        return "0" + valString;
        } else {
        return valString;
        }
    }
}

function stopTimer(){
    clearInterval(timeInterval);
}

let ul = document.querySelectorAll('li');
const letters= ["A", "B", "C", "D", "E", "F", "G", "H", ""]

const ids = (items) => {
    for(let i = 0; i < items.length; i++) {
        items[i].setAttribute("id", `li${i}`)
    }
}

const shuffle = (arr) => {
    const arr_val = [...arr];
    for(let ar = 0; ar < arr_val.length; ar++) {
        let j = parseInt(Math.random()*arr_val.length);
        let temp = arr_val[ar];
        arr_val[ar] = arr_val[j];
        arr_val[j] = temp;
    }   
    return arr_val;
 }

const dragstart_handler = ev => {
    ev.dataTransfer.setData("text/plain", ev.target.id)
    ev.target.classList.add('dragging');
    ev.dataTransfer.dropEffect = "move";
}

const dragover_handler = ev => {
    ev.preventDefault();
}

const Emptybox = () => {
    const emptyCellNumber = state.emptyCellIndex+1;
    const emptyCellRow = Math.ceil(emptyCellNumber/3);
    const emptyCellCol = 3 - (3 * emptyCellRow - emptyCellNumber);
    return [emptyCellRow-1, emptyCellCol-1]
}

const setDraggable = (items) => {
    const [row, col] = Emptybox();
    let left, right, top, bottom = null;
    if(state.dimension[row][col-1]) left = state.dimension[row][col-1];
    if(state.dimension[row][col+1]) right = state.dimension[row][col+1];

    if(state.dimension[row-1] != undefined) top = state.dimension[row-1][col];
    if(state.dimension[row+1] != undefined) bottom = state.dimension[row+1][col];

    items.forEach(item => {
        if(item.innerText == top || 
            item.innerText == bottom || 
            item.innerText == right ||
            item.innerText == left) {
                item.setAttribute("draggable", "true");
                item.setAttribute("ondragstart", "dragstart_handler(event)");
                item.setAttribute("ondragend", "dragend_handler(event)")
            }
    })
}

const drop_handler = ev => {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    ev.target.innerText = document.getElementById(data).innerText;
    ev.target.classList.remove("empty")
    ev.target.setAttribute("ondrop", "");
    ev.target.setAttribute("ondragover", "");
    document.getElementById(data).innerText = "";
    state.content = getState(ul);
    state.dimension = getDimension(state);
}

const removeDroppable = (items) => {
    items.forEach((item) => {
        item.setAttribute("ondrop", "");
        item.setAttribute("ondragover", "");
        item.setAttribute("draggable", "false");
        item.setAttribute("ondragstart", "");
        item.setAttribute("ondragend", "");
    })
}

const dragend_handler = ev => {
  ev.dataTransfer.clearData();
  ev.target.classList.remove('dragging');
  removeDroppable(document.querySelectorAll('li'));
  setDroppable(document.querySelectorAll('li'));
  setDraggable(document.querySelectorAll('li'))

    if(isCorrect(letters, state.content)) {
        popup();
    }
}

const popup = () => {
    var min = document.getElementById('minutes').innerText;
    var sec = document.getElementById('seconds').innerText;
    document.getElementById('message').innerText = "Hurray!! You won! \n Time "+min+" : "+sec;
    document.getElementById('modal').classList.remove("hide");
    stopTimer();
}

const hidepopup = () => {
    document.getElementById('modal').classList.add("hide");
}

 const isSolvable = (arr) => {
    let number_of_inv = 0;
    for(let i =0; i<arr.length; i++){
        for(let j = i+1; j < arr.length; j++) {
            if((arr[i] && arr[j]) && arr[i] > arr[j]) number_of_inv++;
        }
    }
    return (number_of_inv % 2 == 0);
}

const isCorrect = (solution, content) => {
    if(JSON.stringify(solution) == JSON.stringify(content)) return true;
    return false;
}

const fillGrid = (items, letters) => {
    let shuffled = shuffle(letters);
    while(!isSolvable(shuffled)) {
        shuffled = shuffle(letters);
    }

    items.forEach((item, i) => {
        item.innerText = shuffled[i];
    })
}

fillGrid(ul, letters);

const getState = (items) => {
    const content = [];
    items.forEach((item, i) => {
        content.push(item.innerText)
    });
    return content;
}

const getDimension = (state) => {
    let j = 0;
    let arr = [];
    const {content} = state;
    for(let i = 0; i < 3; i++) {
        arr.push(content.slice(j, j+3));
        j+=3;
    }

    return arr;
}


const state = {}
state.content = letters;

const setDroppable = (items) => {
    items.forEach((item, i) => {
        if(!item.innerText) {
            state.emptyCellIndex = i;
            item.setAttribute("ondrop", "drop_handler(event);");
            item.setAttribute("ondragover", "dragover_handler(event);");
            item.setAttribute("class", "empty");
        }
        return;
    })
}


function start() {
    fillGrid(ul, letters);
    ids(ul)
    state.content = getState(ul);
    state.dimension = getDimension(state);
    setDroppable(ul) ;
    setDraggable(ul);
}

window.onload = start();
