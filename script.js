//#f0370e

class Countdown {
    constructor(date, name, isNatural, id) {
        this.isnatural = isNatural;
        this.name = name;
        this.id = id;
        this.date = date;
        this.countdown = document.createElement("div");
        this.countdown.classList.add("countdown");
        this.countdown.classList.add("grid-item");
        if (this.id != undefined) this.countdown.id = this.id;
        if (this.isnatural == true) {
            this.countdown.innerHTML = `<span class="titlecd">${this.name}</span><br><span class="cd"></span>`;
        } else {
            this.countdown.innerHTML = `<span class="titlecd">${this.name}</span><span class="delete">Usuń</span><br><span class="cd"></span>`;
        }
        this.title = this.countdown.querySelector("span.titlecd");
        this.span = this.countdown.querySelector("span.cd");
        this.interval = null;
    }

    start() {
        // if (new Date(this.date) < new Date()) {
        //     throw new Error("Date is old");
        // }
        this.interval = setInterval(() => {
            const timeLeft = this.getTimeLeft();
            this.span.innerHTML = timeLeft;
            if (timeLeft.total <= 0) {
                this.span.innerHTML = "Zakończone!";
                clearInterval(this.interval);
            }
        }, 1000);
    }

    getTimeLeft() {
        let total = Date.parse(new Date(getDate(this.date))) - Date.parse(new Date());
        let seconds = Math.floor((total / 1000) % 60);
        let minutes = Math.floor((total / 1000 / 60) % 60);
        let hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        let days = Math.floor(total / (1000 * 60 * 60 * 24) % 7);
        let weeks = Math.floor(total / (1000 * 60 * 60 * 24 * 7) % 4);
        let months = Math.floor(total / (1000 * 60 * 60 * 24 * 7 * 4));
        let result = ``;
        months > 0 ? result += months + " mies. " : true;
        weeks > 0 ? result += weeks + " tyg. " : true;
        days > 0 ? result += days + " dni " : true;
        hours < 10 ? result += "0" + hours + ":" : result += hours + ":";
        minutes < 10 ? result += "0" + minutes + ":" : result += minutes + ":";
        seconds < 10 ? result += "0" + seconds : result += seconds;
        return result;
    }
}

const getDate = (date) => {
    let currentyear = new Date().getFullYear()
    if (new Date(currentyear + "-" + date) > new Date()) {
        return `${currentyear}-${date}`;
    } else {
        return `${currentyear + 1}-${date}`;
    }
}

function makeUniqueClass() {
    return crypto.randomUUID()
}

function add() {
    let name = document.getElementById("name").value;
    let date = document.getElementById("date").value;
    if (date == "") {
        alert("Proszę wpisać rok, miesiąc, dzień, godzinę oraz minuty");
        return;
    }
    let data = {
        "name": name,
        "date": date,
        "isNatural": false
    }
    localStorage.setItem(makeUniqueClass(), JSON.stringify(data));
    location.reload();
}

function remove(todelete) {
    localStorage.removeItem(todelete);
}

function sort(json, sort) {//0 - asc 1 - desc
    let first = json
    const sortedDates = Object.values(first)
    if (sort == 0)
        sortedDates.sort((a, b) => (
            Date.parse(new Date(getDate(a['date']))) - Date.parse(new Date())
        ) - (
                Date.parse(new Date(getDate(b['date']))) - Date.parse(new Date())))
    else sortedDates.sort((a, b) => (
        Date.parse(new Date(getDate(a['date']))) - Date.parse(new Date())
    ) + (
            Date.parse(new Date(getDate(b['date']))) - Date.parse(new Date())))

    return sortedDates;
}

async function mergeJSONdata() {
    let rawJSON = Object.values({});
    await fetch('./dates.json')
        .then(response => response.json())
        .then(json => {
            console.log(json)
            for (i = 0; i < Object.keys(json).length; i++) {
                console.log(json[i])
                rawJSON.push({
                    name: json[i]['name'],
                    date: json[i]['date'],
                    isNatural: json[i]['isNatural']
                })
            }
            if (localStorage.length > 0) {
                for (i = 0; i < localStorage.length; i++) {
                    let index = JSON.parse(localStorage.getItem(localStorage.key(i)));
                    let date = index['date']
                    rawJSON.push({
                        name: index['name'],
                        date: date.toString().substring(date.toString().search(/[0-9]{2}[-][0-9]{2}[T][0-9]{2}[:][0-9]{2}/)),
                        isNatural: index['isNatural'],
                        id: localStorage.key(i)
                    })
                }
            }

        })
    return rawJSON;
}

/* document.addEventListener("keypress", (e) => {
    if ((e.code).charAt(3) == "D"
        && e.ctrlKey == true
        && e.shiftKey == true) {
        if (document.querySelector("h1.port")) {
            document.querySelector("h1.port").remove();
        } else {
            const port = document.createElement("h1");
            port.classList.add("port");
            port.innerText = location;
            document.body.appendChild(port);
        }
    }

}) */

setInterval(() => {
    let result = `Dzisiaj jest: `;
    let now = new Date();
    result += now.getFullYear() + "-";
    now.getMonth() < 10 ? result += "0" + now.getMonth() : result += now.getMonth();
    now.getDay() < 10 ? result += "-0" + now.getDay() + " " : result += "-" + now.getDay() + " ";
    now.getHours() < 10 ? result += "0" + now.getHours() + ":" : result += now.getHours() + ":";
    now.getMinutes() < 10 ? result += "0" + now.getMinutes() + ":" : result += now.getMinutes() + ":";
    now.getSeconds() < 10 ? result += "0" + now.getSeconds() : result += now.getSeconds();
    document.querySelector("span.today").innerHTML = result;
}, 50)

async function load() {
    const lengthLocData = localStorage.length;
    let SortedJSON = sort(await mergeJSONdata(), 0)
    SortedJSON.forEach(index => {
        const countdown = new Countdown(index['date'], index['name'], index['isNatural'], index['id']);
        countdown.start();
        document.body.querySelector("div.grid-container").appendChild(countdown.countdown);
    });
    if (lengthLocData > 0) {
        document.querySelectorAll("span[class=delete]").forEach((button) => {
            button.addEventListener("click", (element) => {
                element['target']['parentElement'].remove();
                remove(element['target']['parentElement']['id'])
            });
        });
    }
}
load()