const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);



fetch('portoInfo')
  .then(response => response.json())
  .then((data) => {
    const porto = data.portos;


    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.idealWidth = 600;
    advancedTexture.useInvalidateRectOptimization = false;


    porto.forEach(async(portos) => {





      const textura_pontos = new BABYLON.StandardMaterial("textura_pontos");
      textura_pontos.diffuseColor = new BABYLON.Color3(0.1, 0.5, 1);

      const porto = new BABYLON.MeshBuilder.CreateCapsule("porto", {radius:0.3, height:5, radiusTop:2});
        porto.position.x = portos.positionX;
        porto.position.z = portos.positionZ;
        porto.position.y = 30;
        
        porto.material = textura_pontos;


      porto.actionManager = new BABYLON.ActionManager(scene);
      porto.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, async function() {
          // Cria o elemento HTML do card do Bootstrap
          var card = document.createElement("div");
          card.className = "card";
          card.style.position = "fixed";
          card.style.top = (event.clientY + 10) + "px"; // posição vertical do card
          card.style.left = (event.clientX + 10) + "px"; // posição horizontal do card
          
          // Adiciona conteúdo ao card
          var cardBody = document.createElement("div");
          cardBody.className = "card-body";
          cardBody.innerHTML = `<h5 class='card-title'>${portos.portoNome}</h5><p class='card-text'></p>`;
          card.appendChild(cardBody);

          // Adiciona o card ao elemento HTML da cena
          document.getElementById("renderCanvas").parentNode.appendChild(card);
      }));

      // Adiciona um evento de mouse out no mesh
      porto.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function() {
          // Remove o card da cena
          document.querySelector(".card").remove();
      }));
      






    })



/*      portosInfo.forEach(async (portos) => {



        const textura_pontos = new BABYLON.StandardMaterial("textura_pontos");
        textura_pontos.diffuseColor = new BABYLON.Color3(0.1, 0.5, 1);

        const porto = new BABYLON.MeshBuilder.CreateCapsule("porto", {radius:0.5, height:10, radiusTop:4});
        porto.position.x = portos.positionX;
        porto.position.z = portos.positionZ;
        porto.position.y = 30;
        
        porto.material = textura_pontos;
    
        var rect1_porto = await new BABYLON.GUI.Rectangle();
            advancedTexture.addControl(rect1_porto);
            rect1_porto.width = `${portos.portoNome.length * 5}px`;
            rect1_porto.height = '16px';
            rect1_porto.thickness = 1;  
            rect1_porto.linkOffsetY = "-20px";
            rect1_porto.transformCenterY = 1; 
            rect1_porto.background = "MidnightBlue"; 
            rect1_porto.alpha = 0.7;
            rect1_porto.scaleX = 0;
            rect1_porto.scaleY = 0;
            rect1_porto.cornerRadius = 5
            rect1_porto.linkWithMesh(porto);    
      
        var text1 = new BABYLON.GUI.TextBlock();
            text1.text = `${portos.portoNome}`;
            text1.color = "white";
            text1.fontSize = 18;
            text1.textWrapping = true;
            text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            text1.background = 'white'
            rect1_porto.addControl(text1)
            text1.alpha = (1/text1.parent.alpha);

            
            // Criar retângulos abaixo do rect1_porto
            var rect2_porto = new BABYLON.GUI.Rectangle();
            rect2_porto.width = "50px";
            rect2_porto.height ="17px";
            rect2_porto.thickness = 1;  
            rect2_porto.background = "LightBlue"; 
            rect2_porto.alpha = 0.7;
            rect2_porto.scaleX = 0.5;
            rect2_porto.scaleY = 0.5;
            rect2_porto.cornerRadius = 5;
            rect1_porto.addControl(rect2_porto);
              
        var actionManager = new BABYLON.ActionManager(scene);
        porto.actionManager = actionManager;
    
          var scaleXAnimation = new BABYLON.Animation("myAnimation", "scaleX", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
          var scaleYAnimation = new BABYLON.Animation("myAnimation", "scaleY", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    
            var keys = [];
    
             keys.push({
                          frame: 0,
                          value: 0
                      });
                      keys.push({
                        frame: 10,
                        value: 1
                      });
    
                scaleXAnimation.setKeys(keys);
                scaleYAnimation.setKeys(keys);
                rect1_porto.animations = [];
                rect1_porto.animations.push(scaleXAnimation);
                rect1_porto.animations.push(scaleYAnimation);
    
            actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                    scene.beginAnimation(rect1_porto, 0, 10, false);
                    }));
     
            actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                        scene.beginAnimation(rect1_porto, 10, 0, false);
                    }));


                rect2_porto.animations = [];
                rect2_porto.animations.push(scaleXAnimation);
                rect2_porto.animations.push(scaleYAnimation);
    
            actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                    scene.beginAnimation(rect2_porto, 0, 10, false);
                    }));
     
            actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                        scene.beginAnimation(rect2_porto, 10, 0, false);
                    }));
       
    
    }) 



    embarcacoes.forEach(async(embs) => {


      var rect1_embs = await new BABYLON.GUI.Rectangle();
            advancedTexture.addControl(rect1_embs);
            rect1_embs.width = `${embs.embarcacaoNome.length * 5}px`;
            rect1_embs.height = '16px';
            rect1_embs.thickness = 1;  
            rect1_embs.linkOffsetY = "-20px";
            rect1_embs.transformCenterY = 1; 
            rect1_embs.background = "MidnightBlue"; 
            rect1_embs.alpha = 0.7;
            rect1_embs.scaleX = 0;
            rect1_embs.scaleY = 0;
            rect1_embs.cornerRadius = 5
            rect1_embs.linkWithMesh(porto);    
      
        var embs = new BABYLON.GUI.TextBlock();
            embs.text = `${embs.embarcacaoNome}`;
            embs.color = "white";
            embs.fontSize = 18;
            embs.textWrapping = true;
            embs.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            embs.background = 'white'
            rect1_embs.addControl(embs)
            embs.alpha = (1/embs.parent.alpha);

            var actionManager = new BABYLON.ActionManager(scene);
            porto.actionManager = actionManager;
        
              var scaleXAnimation = new BABYLON.Animation("myAnimation", "scaleX", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
              var scaleYAnimation = new BABYLON.Animation("myAnimation", "scaleY", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        
                var keys = [];
        
                 keys.push({
                              frame: 0,
                              value: 0
                          });
                          keys.push({
                            frame: 10,
                            value: 1
                          });
        
                    scaleXAnimation.setKeys(keys);
                    scaleYAnimation.setKeys(keys);
                    rect1_embs.animations = [];
                    rect1_embs.animations.push(scaleXAnimation);
                    rect1_embs.animations.push(scaleYAnimation);
        
                actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                        scene.beginAnimation(rect1_embs, 0, 10, false);
                        }));
         
                actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                            scene.beginAnimation(rect1_embs, 10, 0, false);
                        }));
    
    }) */





        
    })
  .catch(error => console.error(error));


const createScene = function () {

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.1);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 175, new BABYLON.Vector3(0, 100, 0));
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);


    const modelo3d = BABYLON.SceneLoader.ImportMesh("", "/3dModels/", "Mapa.gltf", scene, function (newMeshes) {
        camera.target = newMeshes[0];
        });


    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.9;
    

        
    return scene;

};


const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
})