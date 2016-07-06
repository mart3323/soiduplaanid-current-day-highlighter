"use strict";
var options = new Options();

/**
 * Returns the current time as a Date object (separate function for mocking (testing) purposes
 * @returns {Date}
 */
function getCurrentDate() {
    //return new Date(Date.UTC(2016,6,3,23-3,41,0));
    return new Date();
}

var cursor = new Cursor();
var countdown = new Countdown();

let scheduleContainer = document.getElementById("divScheduleContentInner");
scheduleContainer.arrive('.timetable + div:not(.timetable)', function() {
    options.loaded.then(function(){
        if(options.highlight || options.fade || options.element || options.highlight){
            let tables = scheduleContainer.querySelectorAll(".timetable");
            let days = new Days(tables);

            let now = getCurrentDate();

            if(options.highlight){
                days.highlight(now, false);
            }
            if(options.fade){
                days.fade(now, false);
            }

            let {day, hour, minute, nextBusDate} = days.findNextForDate(getCurrentDate());
            if(options.cursor){
                cursor.attachBefore(minute);
            }
            if(options.countdown){
                countdown.start(getCurrentDate, 100, nextBusDate);
                window.onhashchange = function(){
                    let targetElement = document.querySelector("dt > a.current");
                    countdown.attachTo(targetElement);
                };
                document.arrive("dt > a.current", {existing: true}, function(){
                    countdown.attachTo(this);
                });
            }
        }
    })
});


options.loaded.then(function(){
    if(options.signature){
        var signature = createSignatureElement();
        document.arrive('#divScheduleBody', {existing: true, fireOnAttributesModification: true}, function(e){
            let target = this;
            target.appendChild(signature);
            setTimeout(function(){
                signature.className += " active";
            }, 1000);
        });

    }

    /** @returns {HTMLElement} */
    function createSignatureElement(){
        let element = document.createElement("div");
        element.id = SIGNATURE_CLASSNAME;
        {
            let text = document.createElement("div");
            text.textContent = "Soiduplaanid+ extension by mart3323";
            element.appendChild(text);
        }
        {
            let text2 = document.createElement("div");
            text2.textContent = "go to chrome://extensions to configure options";
            element.appendChild(text2);
        }
        {
            let image = document.createElement("img");
            image.src = "https://31.media.tumblr.com/b881090aa4d8085bfcb213b2be985beb/tumblr_inline_ndlqydgnQ41rxu46b.png";
            element.appendChild(image);
        }

        return element
    }
});






