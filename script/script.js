"use strict"

import { addRecord, clearDatabase, countRecords, getAdults, updateTable } from "./database-fns.js"

// HTML тот же, что и в предыдущем примере
// CSS тот же, что и в предыдущем примере
// HTML и CSS те же, что и в предыдущем примере

// HTML тот же, что и в предыдущем примере

// 📁 script.js:


const dataTable = document.querySelector(".data-table");
const addRecordBtn = document.querySelector(".add-record-btn");
const clearDatabaseBtn = document.querySelector(".clear-database-btn");
const countRecordsBtn = document.querySelector(".count-records-btn");
const getAdultsBtn = document.querySelector(".get-adults-btn");

let database;
let openRequest = window.indexedDB.open("database", 1);

openRequest.addEventListener("upgradeneeded", event => {
    database = openRequest.result;
    if (!database.objectStoreNames.contains('students')) { // если хранилище "books" не существует
        let objectStore = database.createObjectStore('students', {autoIncrement: true}); // создаём хранилище
        objectStore.createIndex("students-index", "age");
    }
});
openRequest.addEventListener("success", event => {
    database = openRequest.result;
    updateTable(database, dataTable);
    enableButtons();
    addRecordBtn.addEventListener("pointerup", event => {
        event.preventDefault();
        if (addRecordBtn.dataset.disabled === "true") {
            return;
        }
        let data = {};
        data.name = prompt("Введите имя студента") || "";
        data.surname = prompt("Введите фамилию студента") || "";
        data.age = Number(prompt("Введите возраст студента")) || 0;
        disableButtons();
        addRecord(database, data);
        updateTable(database, dataTable);
        getAdultsBtn.textContent = "Вывести совершеннолетних (возраст >= 18) студентов";
        enableButtons();
    });
    clearDatabaseBtn.addEventListener("pointerup", event => {
        event.preventDefault();
        if (clearDatabaseBtn.dataset.disabled === "true") {
            return;
        }
        disableButtons();
        clearDatabase(database);
        updateTable(database, dataTable);
        enableButtons();
    });
    countRecordsBtn.addEventListener("pointerup", event => {
        event.preventDefault();
        if (countRecordsBtn.dataset.disabled === "true") {
            return;
        }
        disableButtons();
        countRecords(database);
        enableButtons();
    });
    getAdultsBtn.addEventListener("pointerup", event => {
        event.preventDefault();
        if (getAdultsBtn.dataset.disabled === "true") {
            return;
        }
        disableButtons();
        if (getAdultsBtn.textContent.includes("возраст >= 18")) {
            getAdults(database, dataTable);
            getAdultsBtn.textContent = "Вывести все записи";
        } else {
            updateTable(database, dataTable);
            getAdultsBtn.textContent = "Вывести совершеннолетних (возраст >= 18) студентов";
        }
        enableButtons();
    });
    database.addEventListener('versionchange', event => {
        document.location.reload();// перезагрузка страницы при параллельном обновлении
    });
});
openRequest.addEventListener("error", event => {
    tableElement.style.gridTemplateColumns = "";
    tableElement.style.gridTemplateRows = "";
    dataTable.textContent = 'Ошибка при открытии базы данных. Код ошибки: ' + event.target.errorCode;
});
function disableButtons(){
    [addRecordBtn, clearDatabaseBtn, countRecordsBtn, getAdultsBtn].forEach(btn => {
        btn.dataset.disabled = true;
    });
}
function enableButtons(){
    [addRecordBtn, clearDatabaseBtn, countRecordsBtn, getAdultsBtn].forEach(btn => {
        btn.dataset.disabled = false;
    });
}







/* ↑ Выведет:



*/


// ↑ ↓ 📁 console.log();


/* ↑ Выведет:

*/
// let fruit = ['Персик', 'Банан', 'Яблоко', 'Апельсин', 'Груша', 'Ананас', 'Абрикос'];
// let name = ["David", "Adam", "Henry", "James", "John", "Lily", "Alice", "Daniel", ]
// let surname = ["Hill", "Cliff", "King", "Cloud", 'Smith', ]
// ctrl + space -> подсказки

/* Суррогатные символы:
// 𝒳 𝒴 𝒵 𝚺 🗍 🗎 🗏 🗐 🗑 🗒 🗗 🗘 🗙 🗴 🗵 🗶 🗷 🗸 🗹 🗺 😎 😁 😂 😅 😆 😉 🤝
*/
// Использовал в статьях: 𝒳🗎🗹😁;🗗😉𝚺🗷🗏 🗺😂🗘🗒🗑;🗶

/*
https://freepngimg.com/thumb/ball/75396-cricket-tennis-green-ball-hq-image-free-png-thumb.png
https://freepngimg.com/thumb/technology/7-2-technology-picture-thumb.png
https://freepngimg.com/thumb/usa/6-2-america-flag-thumb.png
https://freepngimg.com/thumb/france/2-2-france-flag-png-hd-thumb.png
*/






