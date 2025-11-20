let currentRotation = { x: 0, y: 0 }; // on definit nos x,y par default a 0.
let directions = ["left", "right", "up", "down"]; // on cree un tableau de direction 

function rotateCube() {
    for (let i = 0; i < 4; i++) {
        let direction = directions[Math.floor(Math.random() * 4)]; // on utilise la methode random pour la direction
        // ici on utlise switch pour connaitre la rotation a faire :
        switch (direction) {
            case 'left':
                currentRotation.y -= 90; // si c'est 'left' on fait -90deg de rotation y
                break;
            case 'right':
                currentRotation.y += 90; // si c'est 'right' on fait +90deg de rotation y
                break;
            case 'up':
                currentRotation.x += 90; // si c'est 'up' on fait +90deg sur l'axe x
                break;
            case 'down':
                currentRotation.x -= 90; // si c'est 'down' on fait -90deg sur l'axe x
                break;
        }
    }

    applyRotation(); // on applique notre rotation 
}

function applyRotation(){ 
     const cube = document.getElementById('cube'); // on recupere notre cube qui contient nos faces
     cube.style.transition = "transform 1.2s ease";

     //avec style.transform on applique la rotation sur x et y avec nos valeurs dans currentRotation{x et y} !
     document.getElementById('cube').style.transform = 
        `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
}

let intervalId = null; // on declare et on assign 'null' notre interval

function openBox() {
    intervalId = setInterval(rotateCube, 600); // notre intervale va contenir une setInterval qui va faire une rotation de cube toutes les 6ms 
    setTimeout(() => {
        clearInterval(intervalId); // apres 6s on supprime l'interval
        stopBox(); // on arrete la rotation -> appliquera x = 0 et y = 0
    }, 6000); // apres exactement 6s

}

function stopBox() {
   
    if (intervalId) {
        clearInterval(intervalId); // si intervalId -> on clear + re-assign la valeur null !
        intervalId = null;
    }
    currentRotation.x = 0; // l'axe x = 0
    currentRotation.y = 0; // l'axe y = 0
    applyRotation();
    closeFront()
    showMessage('🎉Congratulations !🎉 You Did It🥳🎊');
    
}

/* on cree un fonction qui va remove la face front apres avoir cliquer sur le boutton, ce dans le 
 but de creer l'effet d'une box ouverte : */
function closeFront() {
    const frontFace = document.querySelector('.front'); 
    frontFace.style.display = "none"; // va enlever la face front

    const backFace = document.querySelector('.back'); 
    backFace.textContent = "HϽƎT ᗡOOMƧ"; // dans notre face back (arriere) on mettre ensuite "SMOOD TECH" mais inversé car sinon l'affichage sera inversé

}


// La fonction de message de fin
function showMessage(text) {
    const container = document.getElementById("message-container"); // on recupere le container (present dans react.html) par son id
    
    const msg = document.createElement("div");
    msg.className = "message"; // on lui attrubit la class "message" presente dans index.css
    msg.textContent = text; // on met dans notre div l'argument "text"
    
    container.appendChild(msg);
    
    // Supprime le message apres 2secondes
    setTimeout(() => {
        msg.remove();
    }, 4000);
}

