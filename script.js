let count = 1;

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
        if (this.isnatural == 'true') {
            this.countdown.innerHTML = `<span class="titlecd">${this.name}</span><br><span class="cd"></span>`;
        } else {
            this.countdown.innerHTML = `<span class="titlecd">${this.name}</span><span class="delete">Del.</span><br><span class="cd"></span>`;
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
            this.span.innerHTML = `${timeLeft.months} mies. ${timeLeft.weeks} tyg. ${timeLeft.days} dni | ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`;
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
        seconds < 10 ? seconds = "0" + seconds : true;
        minutes < 10 ? minutes = "0" + minutes : true;
        hours < 10 ? hours = "0" + hours : true;
        return {
            total,
            months,
            weeks,
            days,
            hours,
            minutes,
            seconds,
        };
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

function readData() {
    data = JSON.parse(localStorage.getItem("data"))
    return data;
}

function add() {
    let clength = localStorage.length;
    let name = document.getElementById("name").value;
    let date = document.getElementById("date").value;
    if (date == "") {
        alert("Proszę wpisać rok, miesiąc, dzień, godzinę oraz minuty");
        return;
}
    let isNatural = "false";
    let data = {
        "name": name,
        "date": date,
        "isNatural": isNatural
    }
    localStorage.setItem(makeUniqueClass(), JSON.stringify(data));
    location.reload();
}

function remove(todelete) {
    localStorage.removeItem(todelete);
}

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
                    date = new Date().getFullYear()+1 + "-" + data['date']
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
                date = new Date().getFullYear()+1 + "-" + json[i]['date']
            }
                const countdown = new Countdown(date, json[i]['name'], json[i]['isNatural']);
                countdown.start();
                document.body.querySelector("div.grid-container").appendChild(countdown.countdown);
        }
    })




/*saveData({
    0: {
        "name": "test",
        "day": "25",
        "month": "12",
        "isNatural": "false"
    },
    1: {
        "name": "test",
        "day": "25",
        "month": "12",
        "isNatural": "false"
    }
})
readData()*/