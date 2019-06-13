

module.exports = {
    events: [],
    addEvent(cb, time = 0) {
        this.events.push({ cb: cb, time: time });
    },
    tick() {
        for (let i in this.events) {
            if (this.events[i].time <= 0) {
                this.events[i].cb();
                delete this.events[i];
            } else {
                this.events[i].time--;
            }
        }
    }
};