class Countdown {

    constructor() {
        this.element = document.createElement("span");
        this.runningInterval = undefined;
        this.element.className = COUNTDOWN_CLASSNAME;
    }

    attachTo(targetElement){
        targetElement.appendChild(this.element);
    }

    start(getCurrentDate, frequency, target){
        let targetMillis = target.getTime();

        if (this.runningInterval) {
            clearInterval(this.runningInterval)
        }

        var self = this;
        this.runningInterval = setInterval(function () {
            self._update(target-getCurrentDate());
        }, frequency);
    }

    _update(millis){
        let remainingSeconds = Math.floor((millis / 1000) % 60);
        let remainingMinutes = Math.floor((millis / 1000 / 60) % 60);
        let remainingHours = Math.floor((millis / 1000 / 60 / 60) % 24);
        let remainingDays = Math.floor((millis / 1000 / 60 / 60 / 24));

        let separator = " → ";
        let text = separator;
        if(millis > 0){

            if (remainingDays > 0) {
                text += remainingDays + " days +";
            }
            if (text != separator || remainingHours > 0) {
                if (remainingHours < 10) {
                    text += "0";
                }
                text += remainingHours + ":";
            }
            if (remainingMinutes < 10) {
                text += "0";
            }
            text += remainingMinutes + ":";
            if (remainingSeconds < 10) {
                text += "0";
            }
            text += remainingSeconds;
        }
        if(text == separator){
            text += "NOW";
        }
        this.element.innerHTML = text;
    }

}