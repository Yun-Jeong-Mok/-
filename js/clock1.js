function d_clock() {
    var d_t = new Date();
    var month = d_t.getMonth();
    var date = d_t.getDate();
    var day = d_t.getDay();
    var week = ["일", "월", "화", "수", "목", "금", "토"];
    var hours = d_t.getHours();
    var minutes = d_t.getMinutes();
    var seconds = d_t.getSeconds();


    document.getElementById("clock").innerHTML = (month + 1) + "월 " + date + "일 " + week[day] + "요일 " + hours + ":" + minutes + ":" + seconds;
}

d_clock();

setInterval(d_clock, 1000);

