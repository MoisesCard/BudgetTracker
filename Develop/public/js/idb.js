const request = indexedDB.open("budget-tracker", 1)

let db;

request.onupgradeneeded = (event) => {
    db = event.target.result
    db.createObjectStore('transactions', {autoIncrement: true})
}

request.onsuccess = (event) => {
    db = event.target.result
}

request.onerror = (event) => {
    console.log(event.target.errorCode)
}

function saveRecord(item) {
    const transaction = db.transaction('transactions', 'readwrite')
    const itemStore = transaction.objectStore('transactions')
    itemStore.add(item)
}

const saveToMongo = () => {
    const transaction = db.transaction('transactions', 'readwrite')
    const itemStore = transaction.objectStore('transactions')
    const getAllItems = itemStore.getAll()

    getAllItems.onsuccess = () => {
        if (getAllItems.result.length) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAllItems.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                }
              })
              .then(response => {    
                return response.json();
              })
              .then(data => {
                if (data.message) {
                    console.log(data)
                    return
                }
                const transaction = db.transaction('transactions', 'readwrite')
                const itemStore = transaction.objectStore('transactions')
                itemStore.clear()
                alert("items have been added to database")
              })
              .catch(err => {
                console.log(err)
              });
        }
    }
}


window.addEventListener("online", saveToMongo) 