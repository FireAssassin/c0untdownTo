const key = "V";
let count = 1;//#f0370e

class Countdown {
    constructor(date, name, isNatural, id) {
        this.isnatural = isNatural;
        this.name = name;
        this.date = date;
        this.id = id;
        this.countdown = document.createElement("div");
        this.countdown.classList.add("countdown");
        this.countdown.classList.add(makeUniqueClass());
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
        let total = Date.parse(this.date) - Date.parse(new Date());
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

function makeUniqueClass() {
    this.uniqueClass = "";
    this.possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 7; i++)
        this.uniqueClass += this.possible.charAt(Math.floor(Math.random() * this.possible.length));
    count++;
    return this.uniqueClass + count;
}

function add() {
    let clength = localStorage.length;
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

document.addEventListener("keypress", (e) => {
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

})

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

fetch('./dates.json')
    .then(response => response.json())
    .then(json => {
        const lengthExtFile = Object.keys(json).length;
        const lengthLocData = localStorage.length;
        if (lengthLocData > 0) {
            for (i = 0; i < lengthLocData; i++) {
                let key = localStorage.key(i);
                let data = JSON.parse(localStorage.getItem(key));
                let date = data['date']
                if (new Date(new Date().getTime + (14 * 24 * 60 * 60 * 1000)) > new Date(date)) {
                    date = new Date().getFullYear() + 1 + "-" + data['date']
                }
                const countdown = new Countdown(date, data['name'], data['isNatural'], key);
                countdown.start();
                document.body.querySelector("div.grid-container").appendChild(countdown.countdown);

            }
            document.querySelectorAll("span[class=delete]").forEach((button) => {
                button.addEventListener("click", (element) => {
                    element['target']['parentElement'].remove();
                    remove(element['target']['parentElement']['id'])
                });
            });
        }

        for (i = 0; i < lengthExtFile; i++) {
            let date = new Date().getFullYear() + "-" + json[i]['date']
            if (new Date(new Date().getTime() + (14 * 24 * 60 * 60 * 1000)) > new Date(date)) {
                date = new Date().getFullYear() + 1 + "-" + json[i]['date']
            }
            const countdown = new Countdown(date, json[i]['name'], json[i]['isNatural']);
            countdown.start();
            document.body.querySelector("div.grid-container").appendChild(countdown.countdown);
        }
    })
