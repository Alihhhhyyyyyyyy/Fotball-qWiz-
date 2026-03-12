// بيانات اللاعبين
let players = [
    {
        id: 1,
        name: "ليونيل ميسي",
        image: "images/messi.jpg",
        club: "إنتر ميامي",
        nationality: "الأرجنتين",
        position: "مهاجم",
        level: 1
    }
];

let currentPlayer = null;
let score = 0;

function startGame() {
    alert("اللعبة شغالة!");
    currentPlayer = players[0];
    document.getElementById('player-image').style.backgroundImage = "url('" + currentPlayer.image + "')";
    document.getElementById('player-image').classList.add('blurred');
}
