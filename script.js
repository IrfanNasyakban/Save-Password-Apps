document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        addAccount();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage')
        return false;
    }
    return true;
}

const accounts = [];
const RENDER_EVENT = 'render-account';

document.addEventListener(RENDER_EVENT, function () {

    const selesai = document.getElementById('accounts');
    selesai.innerHTML = '';

    for (const itemAccount of accounts) {
        const elemenAccount = makeAccount(itemAccount);
        selesai.append(elemenAccount);
    }
});

const SAVED_EVENT = 'SIMPAN-PASSWORD';
const STORAGE_KEY = 'SAVE_PASSWORD_APPS';

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const account of data) {
            accounts.push(account);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(accounts);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
        alert("Data berhasil disimpan");
    }
}

function generateId() {
    return +new Date();
}

function generateAccountObject(id, platform, username, password) {
    return {
        id,
        platform,
        username,
        password
    }
}

function addAccount() {
    const platform = document.getElementById('platform').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const generateID = generateId()
    const accountObject = generateAccountObject(generateID, platform, username, password)
    accounts.push(accountObject)

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function makeAccount(accountObject) {
    const textPlatform = document.createElement('h3')
    textPlatform.innerText = 'Platform: ' + accountObject.platform;

    const textUsername = document.createElement('h3')
    textUsername.innerText = 'Username/Email: ' + accountObject.username;

    const textPassword = document.createElement('h3')
    textPassword.innerText = 'Password: ' + accountObject.password;

    const textContainer = document.createElement('div')
    textContainer.classList.add('inner')
    textContainer.append(textPlatform, textUsername, textPassword)

    const container = document.createElement('div')
    container.classList.add('item', 'shadow')
    container.append(textContainer)
    container.setAttribute('id', `account-${accountObject.id}`)

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('delete-button')

    editButton.addEventListener('click', function () {
        editAccount(accountObject.id);
    });

    deleteButton.addEventListener('click', function () {
        removeAccount(accountObject.id)
    })
    container.append(editButton, deleteButton)

    return container;
}

function findAccountIndex(idAccount) {
    for (const index in accounts) {
        if (accounts[index].id === idAccount) {
            return index;
        }
    }
    return -1;
}

function editAccount(idAccount) {
    const targetAccount = findAccountIndex(idAccount);

    const platform = document.getElementById('platform');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    const data = JSON.parse(window.localStorage.getItem(STORAGE_KEY));

    platform.value = data[targetAccount].platform
    username.value = data[targetAccount].username
    password.value = data[targetAccount].password

    removeAccount(idAccount)
}

function removeAccount(idAccount) {
    const targetAccount = findAccountIndex(idAccount);

    if (targetAccount === -1) return;

    accounts.splice(targetAccount, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    const parsed = JSON.stringify(accounts);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
}