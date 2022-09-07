// ↓ пример создания transaction, objectStore, request и onsuccess/onerror и вызова objectStore.add
export function addRecord(database, data, ){
    let transaction = database.transaction("students", "readwrite");
    let objectStore = transaction.objectStore("students");
    let request = objectStore.add(data);
    request.onsuccess = function(event){
        event.stopPropagation();// остановить всплытие
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onerror = null;
        event.target.onsuccess = null;
    }
    request.onerror = function(event){
        event.stopPropagation();// остановить всплытие 
        console.log('Ошибка при вызове objectStore.add');
        console.log(event.target.error);
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onsuccess = null;
        event.target.onerror = null;
    }
}
// ↓ пример objectStore.getAll
export function updateTable(database, dataTable) {
    let transaction = database.transaction("students", "readwrite");
    let objectStore = transaction.objectStore("students");
    let request = objectStore.getAll();
    request.onsuccess = function(event){
        event.stopPropagation();// остановить всплытие
        outputTable(request.result, dataTable, "База данных пуста");
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onerror = null;
        event.target.onsuccess = null;
    }
    request.onerror = function(event){
        event.stopPropagation();// остановить всплытие 
        console.log('Ошибка при вызове objectStore.getAll');
        console.log(event.target.error);
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onsuccess = null;
        event.target.onerror = null;
    }
}
// ↓ пример objectStore.clear
export function clearDatabase(database){
    let transaction = database.transaction("students", "readwrite");
    let objectStore = transaction.objectStore("students")
    let request = objectStore.clear();
    request.addEventListener("success", event => {
        event.stopPropagation();// остановить всплытие 
    }, {"once": true});
}
// ↓ пример objectStore.count, IDBKeyRange, objectStore.openKeyCursor, cursor.continue
export function countRecords(database){
    let transaction = database.transaction("students", "readwrite");
    let objectStore = transaction.objectStore("students");
    /*
    // ↓ Первый вариант - использование метода поиска по ключу
    let request = objectStore.count(IDBKeyRange.lowerBound(1, false));
    // ↑ при autoIncrement: true, то ключ - целое число больше или равное 1
    request.onsuccess = function(event){
        event.stopPropagation();// остановить всплытие 
        alert("Количество записей в базе данных: " + request.result);
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onerror = null;
        event.target.onsuccess = null;
    }
    request.onerror = function(event){
        event.stopPropagation();// остановить всплытие 
        console.log('Ошибка при вызове objectStore.count');
        console.log(event.target.error);
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onsuccess = null;
        event.target.onerror = null;
    }
    */
    // ↓ Второй вариант (приоритетный) - использование курсора
    let numOfRecords = 0;
    let request = objectStore.openKeyCursor(null, "prev");
    // ↑ получим ключи в обратном порядке "prev"
    // ↑ (можно и в прямом "next", на результат не повлияет)
    request.onsuccess = function(event){
        event.stopPropagation();// остановить всплытие
        let cursor = request.result;
        if (cursor != null) {
            ++numOfRecords;
            cursor.continue();
        } else {
            alert("Количество записей в базе данных: " + numOfRecords);
            // ↓ удаляем уже ненужные обработчики событий
            event.target.onerror = null;
            event.target.onsuccess = null;
        }
    }
    request.onerror = function(event){
        event.stopPropagation();// остановить всплытие 
        console.log('Ошибка курсора в countRecords');
        console.log(event.target.error);
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onsuccess = null;
        event.target.onerror = null;
    }
}
// ↓ пример index.getAll, IDBKeyRange, index.openCursor, cursor.continue
export function getAdults(database, tableElement){
    let transaction = database.transaction("students", "readwrite");
    let objectStore = transaction.objectStore("students");
    let index = objectStore.index("students-index");
    /*
    // ↓ Первый вариант - использование метода поиска по ключу
    let request = index.getAll(IDBKeyRange.lowerBound(18, false));
    request.onsuccess = function(event){
        event.stopPropagation();// остановить всплытие 
        outputTable(request.result, tableElement, "Нет совершеннолетних в базе данных");
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onerror = null;
        event.target.onsuccess = null;
    }
    request.onerror = function(event){
        event.stopPropagation();// остановить всплытие 
        console.log('Ошибка при вызове index.getAll');
        console.log(event.target.error);
        // ↓ удаляем уже ненужные обработчики событий
        event.target.onsuccess = null;
        event.target.onerror = null;
    }
    */
    // ↓ Второй вариант (приоритетный) - использование курсора
    let request = index.openCursor(IDBKeyRange.lowerBound(18, false));
    let headIsDisplayed = true;
    request.onsuccess = function(event){
        event.stopPropagation();// остановить всплытие
        let cursor = request.result;
        if (cursor != null) {
            if (headIsDisplayed === true) {
                tableElement.innerHTML = "";
                tableElement.style.gridTemplateColumns = "1fr ".repeat(Object.keys(cursor.value).length);
                tableElement.style.gridTemplateRows = "1fr";
                for (const key of Object.keys(cursor.value)) {
                    tableElement.insertAdjacentHTML("beforeend", 
                        "<div>" + key + "</div>"
                    );
                }
                headIsDisplayed = false;
            }
            tableElement.style.gridTemplateRows = tableElement.style.gridTemplateRows + " 1fr";
            for (const key in cursor.value) {
                tableElement.insertAdjacentHTML("beforeend", 
                    "<div>" + cursor.value[key] + "</div>"
                );
            }
            cursor.continue();
        } else {
            if (headIsDisplayed === true) {
                tableElement.style.gridTemplateColumns = "";
                tableElement.style.gridTemplateRows = "";
                tableElement.innerHTML = "Нет совершеннолетних в базе данных";
            }
            // ↓ удаляем уже ненужные обработчики событий
            event.target.onerror = null;
            event.target.onsuccess = null;
        }
    }
}

function outputTable(data, tableElement, emptyMessage) {
    if (data.length === 0) {
        tableElement.style.gridTemplateColumns = "";
        tableElement.style.gridTemplateRows = "";
        tableElement.innerHTML = emptyMessage;
        return;
    }
    tableElement.innerHTML = "";
    tableElement.style.gridTemplateColumns = "1fr ".repeat(Object.keys(data[0]).length);
    tableElement.style.gridTemplateRows = "1fr ".repeat(data.length + 1);
    for (const key of Object.keys(data[0])) {
        tableElement.insertAdjacentHTML("beforeend", 
            "<div>" + key + "</div>"
        );
    }
    data.forEach(obj => {
        for (const key in obj) {
            tableElement.insertAdjacentHTML("beforeend", 
                "<div>" + obj[key] + "</div>"
            );
        }
    })
}
