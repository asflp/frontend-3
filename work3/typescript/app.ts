let index = 0, storage: any[] = [], storageToLS: any[] = [];
const list = (<HTMLTableSectionElement>document.getElementById("item_list"));
const mySelect= (<HTMLSelectElement>document.getElementById("mySelect"));
mySelect?.addEventListener("click", function() {
    if(mySelect.value === "value1") {
        storage = storageToLS;
    } else if(mySelect.value === "value2") {
        storage = storageToLS.reverse();
    } else if(mySelect.value === "value3") {
        storage = sortStartDone(storageToLS).reverse();
    } else if(mySelect.value === "value4") {
        storage = sortStartDone(storageToLS);
    }

    list?.replaceChildren();
    showItems();
});

if(localStorage.getItem('tasks')) {
    // @ts-ignore
    storageToLS = JSON.parse(localStorage.getItem('tasks'));
    storage = storageToLS;
    showItems();
}

const taskList = document.querySelector('#item_list');
taskList?.addEventListener('click', addActions);

function addActions(event: Event){
    const target = event.target as HTMLElement;
    if(target.className === "check" || target.className === "empty-check") {
        doneOne({button: event.target});
    }

    if(target.className === "delete") {
        removeOne({button: event.target});
    }
}

function removeOne({button}: { button: any }) {
    list?.removeChild(button.parentNode);
    delete storageToLS[getId({element: button})];
    storageToLS = deleteNulls(storageToLS);
    updateLocalstorage();
}

function doneOne({button}: { button: any }) {
    if(button.className === "empty-check") {
        button.className = "check";
        button.parentNode.getElementsByTagName("div")[0].classList.add("done");
        storageToLS[getId({element: button})].isDone = true;
    } else {
        button.className = "empty-check"
        button.parentNode.getElementsByTagName("div")[0].classList.remove("done");
        storageToLS[getId({element: button})].isDone = false;
    }
    updateLocalstorage();
}

const input = (<HTMLInputElement>document.getElementById("message"));
const errorText = (<HTMLElement>document.getElementById("error"));
const isImportant = (<HTMLInputElement>document.getElementById("importance"));
function addNewItem(){
    const item = new Item(index, input.value, false, isImportant.checked)
    storageToLS.push(item);
    updateLocalstorage();
    showItem(item);
}

const addButton = (<HTMLButtonElement>document.getElementById("add_button"));
addButton.onclick = function () {
    if(input.value === ""){
        errorText.textContent = "Поле должно быть заполнено";
    } else if(input.value.length <= 2){
        errorText.textContent = "Слишком короткая задача";
    }

    if(errorText.textContent !== ""){
        input.style.border = '1px solid red';
    }

    if(errorText.textContent === "") {
        addNewItem();
    }
}

input.onfocus = function () {
    input.style.border = 'none';
    errorText.textContent = "";
}

function updateLocalstorage() {
    localStorage.clear();
    localStorage.setItem('tasks', JSON.stringify(storageToLS));
}

function showItems() {
    storage.forEach(function (item) {
        showItem(item);
    })
}
function showItem(item: Item) {
    item.id = index;
    let listItem = document.createElement("div");
    listItem.id = `list-item_${index}`;
    let buttonCheck = document.createElement("button");
    buttonCheck.type = "button";
    buttonCheck.id = `button-check_${index}`
    let textDiv = document.createElement("div");
    textDiv.textContent = item.text;
    if(item.isDone) {
        buttonCheck.className = "check";
        textDiv.className = "done";
    } else {
        buttonCheck.className = "empty-check";
    }
    let imgDelete = document.createElement("button");
    imgDelete.className = "delete";
    if(item.isImportant){
        let imgStar = document.createElement("button");
        imgStar.className = "star";
        listItem.innerHTML+= imgStar.outerHTML + buttonCheck.outerHTML + textDiv.outerHTML + imgDelete.outerHTML;
        list.appendChild(listItem);
    } else {
        listItem.innerHTML+= buttonCheck.outerHTML + textDiv.outerHTML + imgDelete.outerHTML;
        list.appendChild(listItem);
    }
    index++;
}

function getId ({element}: { element: any }) {
    return element.parentNode.id.split('_')[1];
}

function deleteNulls (array: any[]) :any[] {
    return array.filter(element => element !== null);
}

function sortStartDone (array: any[]) :any[] {
    let doneAndImportant: any[] = [];
    let done: any[] = [];
    let important: any[] = [];
    let other: any[] = [];
    array.forEach((item) => {
        if(item.isDone && item.isImportant){
            doneAndImportant.push(item);
        } else if(item.isDone){
            done.push(item);
        } else if(item.isImportant){
            important.push(item)
        } else{
            other.push(item);
        }
    })

    return important.concat(other).concat(doneAndImportant).concat(done);
}

class Item {

    id: number;
    text: string;
    isDone: boolean;
    isImportant: boolean;

    constructor(id: number, text: string, done: boolean, important: boolean) {
        this.id = id;
        this.text = text;
        this.isDone = done;
        this.isImportant = important;
    }
}