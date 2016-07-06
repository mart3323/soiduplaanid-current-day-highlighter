const MONDAY = "monday";
const TUESDAY = "tuesday";
const WEDNESDAY = "wednesday";
const THURSDAY = "thursday";
const FRIDAY = "friday";
const SATURDAY = "saturday";
const SUNDAY = "sunday";
const HOLIDAY = "national_holiday";



class Days{
    constructor(tables){
        /** @type {Map<String, DayTable>}*/
        this.dayTables = new Map();
        /** @type {DayTable} */
        this.holiday = undefined;


        this.dayTables = new Map();
        for (var i = 0; i < tables.length; i++) {
            this.addTable(tables[i]);
        }
    }
    /**
     * @param {HTMLElement} table
     */
    addTable(table) {
        let days = getDaysFromHeading(table.querySelector("th.workdays").innerHTML);
        for(let day of days){
            if(this.dayTables.has(day)){
                if(document.contains(this.dayTables.get(day).element)){
                    console.error(
                        "Ambiguous tables, both of the following tables...",
                        this.dayTables.get(day).element,
                        table,
                        "... match "+day+" and are visible"
                    );
                }
            }
            this.dayTables.set(day, new DayTable(table));
        }
    }
    highlight(now, smart){
        this.dayTables.get([SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY][now.getDay()]).element.className += " " + CURRENT_TABLE_CLASSNAME
    }
    fade(now, smart){
        let highlit = this.dayTables.get([SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY][now.getDay()]).element;
        for(let day of [SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY]){
            var table = this.dayTables.get(day).element;
            if(table != highlit){
                table.className += " " + FADED_TABLE_CLASSNAME;
            }
        }
    }


    /**
     * @param {number} num
     * @returns {DayTable}
     */
    getDayByDateNumber(num){
        return this.dayTables.get([SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY][num]);
    }
    /**
     * @param {Date} date
     * @returns {{day: DayTable, hour: HourRow, minute: TimeCell, nextBusDate:Date}}
     */
    findNextForDate(date){
        var orig_day = date.getDay();
        var orig_hour = date.getHours();
        var orig_minutes = date.getMinutes();

        var dayTable, hourRow, timeCell;

        for(let i = 0; i < 7; i++) {
            let day = (orig_day+i)%7;
            dayTable = this.getDayByDateNumber(day);

            if(dayTable){
                for (let j = 0; j < 24; j++) {
                    let hour = orig_hour+j;
                    hourRow = dayTable.hours.get(hour);

                    if(hourRow){
                        timeCell = hourRow.times.find((cell) => cell.value >= orig_minutes);
                        if(timeCell){
                            date.setDate(date.getDate()+i);
                            date.setHours(hour);
                            date.setMinutes(timeCell.value);
                            date.setSeconds(0);
                            date.setMilliseconds(0);
                            return {day: dayTable, hour:hourRow, minute:timeCell, nextBusDate:date};
                        }
                    }
                    orig_minutes = 0;
                }
            }
            orig_hour = 0;
        }
        return {day: undefined, hour:undefined, minute:undefined, nextBusDate:undefined};
    }

}


class DayTable{
    /**
     * @param {HTMLElement} table
     */
    constructor(table){
        /** @type {HTMLElement} */
        this.element = table;
        /** @type {Map<number, HourRow>} */
        this.hours = Array.prototype.slice.call(table.querySelectorAll("tr"))
            .reduce(function (map, row) {
                let hourRow = new HourRow(row);
                if(hourRow.isValid){
                    map.set(hourRow.value, hourRow);
                }
                return map;
            }, new Map());
    }
}


class HourRow{

    /**
     * @param {HTMLElement} row
     */
    constructor(row) {
        /** @type {HTMLElement} */
        this.element = row;
        /** @type {Number} */
        this.value = undefined;

        /** @type {Boolean} */
        this.isValid = true;
        /** @type {TimeCell[]} */
        this.times = [];

        let row_heading = row.querySelector("th").innerHTML;
        if (row_heading == "") {
            this.isValid = false;
        } else {
            this.value = parseInt(row_heading);
        }
        for(let cell of Array.prototype.slice.call(row.querySelectorAll("a"))){
            this.times.push(new TimeCell(cell));
        }
    }

}


class TimeCell{

    /**
     * @param {HTMLElement} cell
     */
    constructor(cell) {
        /** @type {HTMLElement} */
        this.element = cell;
        /** @type {Number} */
        this.value = parseInt(cell.innerHTML)
    }
}

/**
 * Returns the dayTables that the heading_text represents
 * @param {string} heading_text
 * @return {Set<string>} the set of dayTables represented
 */
function getDaysFromHeading(heading_text){
    var days = new Set();

    if (heading_text.match(/Esmaspäev/i)) { days.add(MONDAY); }
    if (heading_text.match(/Teisipäev/i)) { days.add(TUESDAY); }
    if (heading_text.match(/Kolmapäev/i)) { days.add(WEDNESDAY); }
    if (heading_text.match(/Neljapäev/i)) { days.add(THURSDAY); }
    if (heading_text.match(/Reede/i)) { days.add(FRIDAY); }
    if (heading_text.match(/Laupäev/i)) { days.add(SATURDAY); }
    if (heading_text.match(/Pühapäev/i)) { days.add(SUNDAY); }

    if (heading_text.match(/Tööpäev/i)) {
        days.add(MONDAY);
        days.add(TUESDAY);
        days.add(WEDNESDAY);
        days.add(THURSDAY);
        days.add(FRIDAY);
    }
    if (heading_text.match(/Riiklik püha/i)) {
        days.add(HOLIDAY);
    }
    if (heading_text.match(/iga päev/i)) {
        days.add(MONDAY);
        days.add(TUESDAY);
        days.add(WEDNESDAY);
        days.add(THURSDAY);
        days.add(FRIDAY);
        days.add(SATURDAY);
        days.add(SUNDAY);
        days.add(HOLIDAY);
    }

    return days;
}
