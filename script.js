class Countdown {
    constructor(date, name) {
        this.name = name;
        this.date = date;
        this.countdown = document.createElement("div");
        this.countdown.classList.add("countdown");
        this.countdown.innerHTML = `<span class="titlecd">${this.name}</span><br><span class="cd"></span>`;
        this.title = this.countdown.querySelector("span.titlecd");
        this.span = this.countdown.querySelector("span.cd");
        this.interval = null;
    }

    start() {
        if (new Date(this.date) < new Date()) {
            throw new Error("Date is old");
        }
        this.interval = setInterval(() => {
            const timeLeft = this.getTimeLeft();
            this.span.innerHTML = `${timeLeft.months} mies. ${timeLeft.weeks} tyg. ${timeLeft.days} dni | ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`;
            if (timeLeft.total <= 0) {
                this.span.innerHTML = "Done!";
                clearInterval(this.interval);
            }
        }, 1000);
    }

    getTimeLeft() {
        const total = Date.parse(this.date) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24) % 7);
        const weeks = Math.floor(total / (1000 * 60 * 60 * 24 * 7) % 4);
        const months = Math.floor(total / (1000 * 60 * 60 * 24 * 7 * 4));
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

fetch('https://fireassassin848.github.io/c0untdownTo/dates.json')
    .then(response => response.json())
    .then(json => {
        for (i = 0; i < Object.keys(json).length; i++) {

            let date = json[i]['month']+" "+json[i]['day']+" "+new Date().getFullYear()

            if (new Date(date) > new Date()) {
                const countdown = new Countdown(date, json[i]['name']);
                countdown.start();
                document.body.appendChild(countdown.countdown);
            }
        }
    })