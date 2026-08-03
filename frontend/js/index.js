const getStartedBtn = document.querySelector(".primary-btn");
const exploreBtn = document.querySelector(".secondary-btn");

getStartedBtn.addEventListener("click", function () {
    window.location.href = "chatbot.html";
});

exploreBtn.addEventListener("click", function () {
    window.location.href = "explorer.html";
});