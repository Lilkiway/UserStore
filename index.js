'use strict'

window.addEventListener('DOMContentLoaded', () => {

const users = document.querySelector('.users');

createUsers();

function createUsers() {

    getData('http://localhost:3000/users').then(data => {
        let newUser = '';
        if(data.length === 0) users.innerHTML = '';
        
        data.reverse();
        data.forEach((user, i) => {
            newUser += `
                <li class='user'>
                    <span class='name'>${user.name}</span>
                    <input class='input_name' type='text'>
                    <span class='tel'>${user.phone}</span>
                    <input class='input_tel' type='tel'>
                    <span class='buttons'>
                        <button data-id=${user.id} data-i=${i} class='edit'>редактировать</button>
                        <button data-id=${user.id} data-i=${i} class='delete'>удалить</button>
                    </span>
                </li>
            `;
    
            users.innerHTML = newUser;
        })
    });
}
    
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = document.querySelector('#form'),
          formData = new FormData(form),
          data = JSON.stringify(Object.fromEntries(formData));

    sendData(data)
        .then(() => createUsers())
        .finally(form.reset());
});

users.addEventListener('click', (e) => {
    if(e.target.tagName !== 'BUTTON') return;

    const user = users.querySelectorAll('li'),
          i = e.target.dataset.i,
          id = e.target.dataset.id,
          isEditing = user[i].classList.contains('editing'),
          inputName = user[i].querySelector('.input_name'),
          inputTel = user[i].querySelector('.input_tel'),   
          name = user[i].querySelector('.name'),
          tel = user[i].querySelector('.tel'),
          btn = user[i].querySelector('.edit'),
          del = user[i].querySelector('.delete');
    
    if(e.target.classList.contains('delete')) {

        if(isEditing) {
            inputName.value = '';
            inputTel.value = '';
        } else {
            deleteData(id)
                .then(() => createUsers())
                .catch((err) => 
                    {user[i].innerHTML = err}
                );
        }
    }

    if(e.target.classList.contains('edit')) {
              
        if(isEditing) {
            const newData = {
                name: inputName.value,
                phone: inputTel.value
            }

            if(inputName.value && inputTel.value) {
                putData(id, newData)
                    .then(() => createUsers())
                    .catch((err) => 
                        {user[i].innerHTML = err}
                    );
            } else{
                inputTel.classList.add('_req');
                inputName.classList.add('_req');
            }
        } else {
            inputName.value = name.textContent;
            inputTel.value = tel.textContent;
            btn.innerHTML = 'сохранить';
            del.innerHTML = 'очистить';
        }
        
        user[i].classList.add('editing');
    }
});

async function getData(url) {
    const responce = await fetch(url);

    if(!responce.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${responce.status}`);
    }

    return await responce.json();
}

async function sendData(data) {
    const responce = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: data
    })

    if(!responce.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${responce.status}`);
    }
    
    return await responce.json();
}

async function putData(id, newData) {
    const responce = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(newData)
        })

    if(!responce.ok) {
        throw new Error(`Ошибка по адресу ${responce.url}, статус ошибки ${responce.status}`);
    }

    return await responce.json();
}

async function deleteData(id) {
    const responce = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE'
    })

    if(!responce.ok) {
        throw new Error(`Ошибка по адресу ${responce.url}, статус ошибки ${responce.status}`);
    }

    return await responce.json();
}

})