var FADED_TABLE_CLASSNAME = "m3-fadedTable";
var CURRENT_TABLE_CLASSNAME = "m3-activeTable";
var DOTBEFORE_CLASSNAME = "m3-cursor";
var COUNTDOWN_CLASSNAME = "m3-countdown";


document.addEventListener("DOMContentLoaded", function(event) {
    let properties = new Set();
    properties.add("highlight");
    properties.add("fade");
    properties.add("cursor");
    properties.add("countdown");
    properties.add("fade_time");
    properties.add("signature");

    let controls = new Map();
    for(let prop of properties){
        controls.set(prop, document.getElementById("control_"+prop));
    }
    for(let prop of properties){
        controls.get(prop).onchange = updateExample;
    }
    load();
    updateExample();



    function save(){
        for(let prop of properties){
            localStorage.setItem(prop, controls.get(prop).checked);
        }
    }

    function load(){
        for(let prop of properties){
            controls.get(prop).checked = localStorage.getItem(prop) == "true";
        }
    }

    function updateExample(){
        save();
        load();

        let tbl_1 = document.getElementById("workdayTable");
        let tbl_2 = document.getElementById("saturdayTable");
        let tbl_3 = document.getElementById("sundayTable");
        let cursor = document.getElementById("cursor");
        let countdown = document.getElementById("countdown");

        removeClass(cursor, DOTBEFORE_CLASSNAME);
        for(let elem of [tbl_1, tbl_2, tbl_3]){
            removeClass(elem, CURRENT_TABLE_CLASSNAME);
            removeClass(elem, FADED_TABLE_CLASSNAME);
        }

        var tbl_active = tbl_3;

        if(controls.get("cursor").checked){
            addClass(cursor, DOTBEFORE_CLASSNAME);
        }

        if(controls.get("highlight").checked){
            addClass(tbl_active, CURRENT_TABLE_CLASSNAME);
        }

        if(controls.get("fade").checked){
            for(let table of [tbl_1, tbl_2, tbl_3]){
                if(table != tbl_active){
                    addClass(table, FADED_TABLE_CLASSNAME);
                }
            }
        }

        if(controls.get("countdown").checked){
            countdown.style.display = "inline-block";
        } else {
            countdown.style.display = "none";
        }
    }
});

function removeClass(element, className){
    element.className = element.className.replace(" "+className, "");
    element.className = element.className.replace(className, "");
}

function addClass(element, className){
    removeClass(element, className);
    element.className += " " + className;
}