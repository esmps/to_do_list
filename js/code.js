const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector(".item-list");
const feedback = document.querySelector(".feedback");
const clear = document.querySelector("#clear-list");
let toDoItems = [];

//handle complete/edit/delete buttons
const configItem = function(itemBox, i){
    const items = itemList.querySelectorAll(".item");
    items.forEach(function(item, i){
        if(item.querySelector(".item-name").textContent === itemBox){
            //completed to-do event listener
            if (localStorage.getItem(`complete-${i}`) === "true"){
                item.querySelector(".item-name").classList.add('completed');
                 item.querySelector(".complete-item").classList.add('visibility');
            }
            item.querySelector(".complete-item").addEventListener('click', function(){
                if (localStorage.getItem(`click-${i}`) === undefined || localStorage.getItem(`click-${i}`) === null ){
                    click = 1;
                }
                else {
                    click = localStorage.getItem(`click-${i}`);
                }
                if (click % 2 !== 0){
                    localStorage.setItem(`complete-${i}`, "true");
                    item.querySelector(".item-name").classList.add('completed');
                    this.classList.add('visibility');
                }
                else{
                    localStorage.setItem(`complete-${i}`, "false");
                    item.querySelector(".item-name").classList.remove('completed');
                    this.classList.remove('visibility');
                }
                click++;
                localStorage.setItem(`click-${i}`, click);
            });
            //edit to-do event listener
            item.querySelector(".edit-item").addEventListener('click', function(){
                itemInput.value = itemBox;
                itemList.removeChild(item);
                toDoItems = toDoItems.filter(function(item){
                   return item !== itemBox; 
                });
            });
            item.querySelector(".delete-item").addEventListener('click', function(){
                itemList.removeChild(item);
                toDoItems = toDoItems.filter(function(item){
                    return item !== itemBox;
                });
                setLocalStorage(toDoItems);
            });
        };
    });
};

//generate the to-do items list
const generateList = function(toDoItems){
    itemList.innerHTML = '';
    toDoItems.forEach(function(item){
        itemList.insertAdjacentHTML('beforeend', `<div class="item my-3"><h5 class="item-name">${item}</h5><div class="item-icons"><a href="#" class="complete-item mx-2 item-icon"><i class="bi bi-bookmark-check"></i></a><a href="#" class="edit-item mx-2 item-icon"><i class="bi bi-pencil-square"></i></a><a href="#" class="delete-item mx-2 item-icon"><i class="bi bi-trash"></i></a></div></div>`);
        let i = toDoItems.indexOf(item);
        configItem(item, i);
    });

};

//remove and item from the list
const removeItem = function(item){
    const removeIndex = toDoItems.indexOf(item);
    toDoItems = toDoItems.splice(removeIndex, 1);
    setLocalStorage(toDoItems);
};

//get local storage to access items so if the page is refreshed, you don't lose the to-do list
const getLocalStorage = function (){
    const storage = localStorage.getItem('toDoItems');
    const comp = localStorage.getItem('complete');
    if (storage === 'undefined' || storage === null){
        toDoItems = [];
    }
    else{
        toDoItems = JSON.parse(storage);
        generateList(toDoItems);
    }
};

//set local storage to hold items so if the page is refreshed, you don't lose the to-do list
const setLocalStorage = function (toDoItems){
    localStorage.setItem('toDoItems', JSON.stringify(toDoItems));
};

//local storage from page
getLocalStorage();

//add item to the list
form.addEventListener('submit', function(event){ 
    event.preventDefault();
    const itemContent = itemInput.value;
    if (itemContent.length === 0){
        feedback.innerHTML = 'Error: Please enter valid value';
        feedback.classList.add('showItem', 'alert-danger');
        setTimeout(
            function(){
                feedback.classList.remove('showItem');
                }, 1000);
    } else {
        toDoItems.push(itemContent);
        generateList(toDoItems);
        setLocalStorage(toDoItems);
    }
    itemInput.value = '';
    });

//clear items from entire list
clear.addEventListener('click', function (){
    toDoItems = [];
    localStorage.clear();
    generateList(toDoItems);
})