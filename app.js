// Передача данных приложению. Параметры строки запроса :https://metanit.com/web/nodejs/4.5.php- сайт примера 
// Для получения данных форм из запроса необходимо использовать специальный пакет body-parser



// підключення Express:
const express = require('express');
// Для чтения и записи в этот файл мы будем использовать встроенный модуль fs
const fs = require('fs');
//створюємо обєкт прогрмами :
const app = express();

const jsonParse = express.json();
//  назначаємо порт :
const port = 3000;
app.use(express.static(__dirname + "/public"));

const filePath = "users.json";

app.get('/api/users',(req,res)=>{
    // получаем доступ к файлу filePath = "users.json":
    const content = fs.readFileSync(filePath,'utf-8');
    const users = JSON.parse(content);
    res.send(users)
})
// получение одного пользователя по id:
app.get('api/users/:id', (req,res)=>{
    // получаем id:
    const id = req.params.id;
    const content = fs.readFileSync(filePath,'utf-8');
    const users =JSON.parse(content);
    let user ;
    // находим в массиве пользователя по id
    for(let i=0; i<users.length; i++){
        if(users[i].id == id){
            user = user[i];
            break;
        }
    }
    if(user){
        res.send(user)
    }else{
        res.status(400).send();
    }
});
// получение отправленных данных

app.post("/api/users",jsonParse,(req,res)=>{
    if(!req.body) return res.status(400);
    // отримання даних з форми
    const userName = req.body.name;
    const userAge = req.body.age;
    // створюємо обєкт
    let user = {name:userName, age: userAge};
    let data = fs.readFileSync(filePath, 'utf-8');;
    let users = JSON.parse(data);
    // находим максимальный id
    const id = Math.max.apply(Math,users.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    user.id = id+1;
    // добавляємо пользователя в обьект
    users.push(user);
    data = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("users.json", data);
    res.send(user);
})

// удаление пользователя по id

app.delete("/api/users/:id", function(req, res){
    const id = req.params.id;
    let data = fs.readFileSync(filePath, 'utf-8');
    let users = JSON.parse(data);
    let index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i < users.length; i++){
        if(users[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        const user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        // отправляем удаленного пользователя
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
// изменение пользователя
app.put("/api/users",jsonParse,(req,res)=>{
    if(!req.body) return res.status(400);
    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;

    let data = fs.readFileSync(filePath, 'utf-8');
    const users = JSON.parse(data);
    let user;

    for(let i=0; i<users.length; i++){
        if(users[i].id==userId){
            user=user[i];
            break;
        }
    }
// изменяем данные у пользователя
    if(user){
        user.age = userAge;
        user.name = userName;
        data = JSON.stringify(users);
        fs.writeFile('users.json', data);
        res.send(user)
    }else{
        res.status(400);
    }    
})





// починаємо прослуховувати підключення на порту 3000:
app.listen(port, () => console.log("Сервер запущен..."));






