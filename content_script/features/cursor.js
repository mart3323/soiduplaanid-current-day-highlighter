class Cursor {
    constructor() {
        this.element = document.createElement("span");
        let subcursor = document.createElement("span");
        this.element.appendChild(subcursor);
        this.element.className = DOTBEFORE_CLASSNAME;
    }

    attachBefore(minuteCell){
        minuteCell.element.parentNode.insertBefore(this.element, minuteCell.element);
    }

}