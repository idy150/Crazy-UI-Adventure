document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    const inputs = document.querySelectorAll("input");
    const cartoonFace = document.getElementById("cartoonFace");
    const face = document.getElementById("face");

    if (!submitBtn || !cartoonFace) {
        console.error("Certains éléments sont manquants");
        return;
    }

    const expressions = {
        neutral: "assets/face-neutral.svg",
        angry: "assets/face-angry.svg",
        thoughtful: "assets/face-thoughtful.svg",
        closed: "assets/face-closed.svg",
        starEyed: "assets/face-star-eyed.svg",
        surprised: "assets/face-surprised.svg",
        awkward: "assets/face-awkward.svg",
        sad: "assets/face-sad.svg",
        skeptical: "assets/face-skeptical.svg",
        curious: "assets/face-curious.svg"
    };

    function changeExpression(expression) {
        if (expressions[expression] && cartoonFace) {
            cartoonFace.src = expressions[expression];
        }
    }

    changeExpression("neutral");

    function makeElementFlee(element) {
        element.addEventListener("mouseenter", () => {
            const x = Math.random() * 600 - 300;
            const y = Math.random() * 300 - 150;
            element.style.transition = "transform 0.05s linear";
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        element.addEventListener("mouseleave", () => {
            element.style.transition = "transform 0.3s ease-out";
            element.style.transform = "translate(0, 0)";
        });
    }

    function makeButtonFleeOnClick(button) {
        let isMoving = false;
        let originalPosition = null;
        let originalParent = null;
        
        function checkMouseDistance(e) {
            if (isMoving) return;
            
            const rect = button.getBoundingClientRect();
            const buttonCenterX = rect.left + rect.width / 2;
            const buttonCenterY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
                Math.pow(e.clientX - buttonCenterX, 2) + 
                Math.pow(e.clientY - buttonCenterY, 2)
            );
            
            if (distance < 100 && !isMoving) {
                startJumping();
            }
        }
        
        document.addEventListener("mousemove", checkMouseDistance);
        
        button.addEventListener("mouseenter", () => {
            if (!isMoving) {
                startJumping();
            }
        });
        
        button.addEventListener("mouseleave", () => {
            if (!isMoving) {
                button.style.transition = "transform 0.3s ease-out";
                button.style.transform = "translate(0, 0)";
            }
        });
        
        function startJumping() {
            if (isMoving) return;
            
            isMoving = true;
            
            const rect = button.getBoundingClientRect();
            originalPosition = {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            };
            
            originalParent = button.parentElement;
            document.body.appendChild(button);
            
            button.style.position = "fixed";
            button.style.left = rect.left + "px";
            button.style.top = rect.top + "px";
            button.style.transform = "translate(0, 0)";
            button.style.zIndex = "10000";
            button.style.margin = "0";
            button.style.width = rect.width + "px";
            button.style.height = rect.height + "px";
            button.style.boxSizing = "border-box";
            
            let jumpCount = 0;
            const colors = [
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
                "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
            ];
            const laughEmojis = ["😂", "🤣", "😆", "😄", "😃", "😊", "😁", "😝"];
            
            function moveButton() {
                const buttonWidth = originalPosition.width;
                const buttonHeight = originalPosition.height;
                const maxX = window.innerWidth - buttonWidth;
                const maxY = (window.innerHeight * 0.25) - buttonHeight;
                
                const x = Math.max(0, Math.min(maxX, Math.random() * window.innerWidth));
                const y = Math.max(0, Math.min(maxY, Math.random() * (window.innerHeight * 0.25)));
                const rotation = Math.random() * 720 - 360;
                const scale = 0.7 + Math.random() * 0.6;
                
                button.style.transition = "left 0.8s ease-out, top 0.8s ease-out, transform 0.8s, background 0.8s";
                button.style.left = x + "px";
                button.style.top = y + "px";
                button.style.transform = `rotate(${rotation}deg) scale(${scale})`;
                
                if (jumpCount % 2 === 0) {
                    const numEmojis = 2 + Math.floor(Math.random() * 2);
                    
                    for (let i = 0; i < numEmojis; i++) {
                        const emoji = laughEmojis[Math.floor(Math.random() * laughEmojis.length)];
                        const laughElement = document.createElement("div");
                        laughElement.textContent = emoji;
                        laughElement.style.position = "fixed";
                        const offsetX = (Math.random() - 0.5) * 60;
                        const offsetY = -30 - (Math.random() * 20);
                        laughElement.style.left = (x + buttonWidth / 2 + offsetX) + "px";
                        laughElement.style.top = (y + offsetY) + "px";
                        laughElement.style.fontSize = (20 + Math.random() * 15) + "px";
                        laughElement.style.pointerEvents = "none";
                        laughElement.style.zIndex = "10001";
                        laughElement.style.transition = "all 0.8s ease-out";
                        document.body.appendChild(laughElement);
                        
                        setTimeout(() => {
                            laughElement.style.transform = `translateY(-${40 + Math.random() * 30}px) scale(${1.5 + Math.random() * 0.5}) rotate(${(Math.random() - 0.5) * 360}deg)`;
                            laughElement.style.opacity = "0";
                        }, 10);
                        
                        setTimeout(() => laughElement.remove(), 800);
                    }
                }
                
                button.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                if (jumpCount % 2 === 0) {
                    button.style.transform += " translateY(-20px)";
                } else {
                    button.style.transform += " translateY(20px)";
                }
                
                jumpCount++;
                
                setTimeout(() => {
                    if (isMoving) {
                        moveButton();
                    }
                }, 800);
            }
            
            moveButton();
            
            setTimeout(() => {
                isMoving = false;
                jumpCount = 0;
                button.style.transition = "left 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), top 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.8s, background 0.8s";
                
                if (originalPosition && originalParent) {
                    button.style.left = originalPosition.left + "px";
                    button.style.top = originalPosition.top + "px";
                    button.style.transform = "rotate(0deg) scale(1) translateY(0)";
                    button.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                    
                    setTimeout(() => {
                        originalParent.appendChild(button);
                        button.style.position = "";
                        button.style.left = "";
                        button.style.top = "";
                        button.style.zIndex = "";
                        button.style.transform = "translate(0, 0)";
                        button.style.margin = "";
                        button.style.width = "";
                        button.style.height = "";
                        button.style.boxSizing = "";
                    }, 800);
                }
            }, 10000);
        }
    }

    makeButtonFleeOnClick(submitBtn);

    inputs.forEach(input => {
        makeElementFlee(input);
    });

    const nameExpressions = ["curious", "thoughtful", "surprised", "starEyed", "awkward", "skeptical"];
    const emailExpressions = ["surprised", "curious", "starEyed", "thoughtful", "sad", "angry"];
    
    inputs.forEach(input => {
        let inputTimeout = null;
        let expressionCount = 0;
        
        function handleInputExpression() {
            if (input.id === "name") {
                changeExpression(nameExpressions[expressionCount % nameExpressions.length]);
                expressionCount++;
            } else if (input.id === "email") {
                changeExpression(emailExpressions[expressionCount % emailExpressions.length]);
                expressionCount++;
            }
        }
        
        input.addEventListener("focus", () => {
            if (inputTimeout) clearTimeout(inputTimeout);
            inputTimeout = setTimeout(handleInputExpression, 300);
        });

        input.addEventListener("blur", () => {
            if (inputTimeout) clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => changeExpression("neutral"), 400);
        });

        input.addEventListener("mouseenter", () => {
            if (inputTimeout) clearTimeout(inputTimeout);
            inputTimeout = setTimeout(handleInputExpression, 300);
        });

        input.addEventListener("mouseleave", () => {
            if (inputTimeout) clearTimeout(inputTimeout);
            if (document.activeElement !== input) {
                inputTimeout = setTimeout(() => changeExpression("neutral"), 400);
            }
        });
    });

    if (face) {
        const randomExpressions = ["starEyed", "surprised", "curious", "awkward", "angry", "thoughtful", "sad", "skeptical"];
        
        face.addEventListener("mouseenter", () => {
            face.style.transform = "scale(1.1)";
            const randomExpression = randomExpressions[Math.floor(Math.random() * randomExpressions.length)];
            changeExpression(randomExpression);
        });

        face.addEventListener("mouseleave", () => {
            face.style.transform = "scale(1)";
            if (document.activeElement !== inputs[0] && document.activeElement !== inputs[1]) {
                changeExpression("neutral");
            }
        });
        
        // Animation automatique du visage - expressions variées en continu
        let autoExpressionInterval = setInterval(() => {
            if (document.activeElement !== inputs[0] && document.activeElement !== inputs[1]) {
                const autoExpressions = ["curious", "thoughtful", "surprised", "starEyed", "awkward", "skeptical", "sad", "angry"];
                const randomExpression = autoExpressions[Math.floor(Math.random() * autoExpressions.length)];
                changeExpression(randomExpression);
                
                setTimeout(() => {
                    if (document.activeElement !== inputs[0] && document.activeElement !== inputs[1]) {
                        changeExpression("neutral");
                    }
                }, 1000);
            }
        }, 2000);
        
        // Animation supplémentaire - clignements et micro-expressions
        setInterval(() => {
            if (document.activeElement !== inputs[0] && document.activeElement !== inputs[1]) {
                const microExpressions = ["curious", "thoughtful", "surprised"];
                const microExpression = microExpressions[Math.floor(Math.random() * microExpressions.length)];
                changeExpression(microExpression);
                
                setTimeout(() => {
                    if (document.activeElement !== inputs[0] && document.activeElement !== inputs[1]) {
                        changeExpression("neutral");
                    }
                }, 400);
            }
        }, 4000);

        let clickCount = 0;
        const clickExpressions = ["starEyed", "surprised", "curious", "angry", "sad", "awkward", "thoughtful", "skeptical"];
        
        face.addEventListener("click", () => {
            const clickExpression = clickExpressions[clickCount % clickExpressions.length];
            changeExpression(clickExpression);
            clickCount++;
            face.style.transform = "scale(1.2) rotate(5deg)";
            setTimeout(() => {
                face.style.transform = "scale(1) rotate(0deg)";
                if (document.activeElement !== inputs[0] && document.activeElement !== inputs[1]) {
                    changeExpression("neutral");
                }
            }, 150);
        });
    }

    document.getElementById("gameForm").addEventListener("submit", e => {
        e.preventDefault();
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement("div");
            confetti.style.position = "fixed";
            confetti.style.left = Math.random() * window.innerWidth + "px";
            confetti.style.top = "-10px";
            confetti.style.width = "10px";
            confetti.style.height = "10px";
            confetti.style.backgroundColor = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181"][Math.floor(Math.random() * 5)];
            confetti.style.borderRadius = "50%";
            confetti.style.pointerEvents = "none";
            confetti.style.zIndex = "1000";
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.style.transition = "all 2s ease-out";
                confetti.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
                confetti.style.opacity = "0";
            }, 10);
            
            setTimeout(() => confetti.remove(), 2000);
        }
    });
});
