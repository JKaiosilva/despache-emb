const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

fetch('portoInfo')
  .then(response => response.json())
  .then((data) => {
    const porto = data;

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.idealWidth = 600;
    advancedTexture.useInvalidateRectOptimization = false;

    porto.forEach((portos) => {
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
          card.id = 'cardPorto'
          card.className = "card";
          card.style.position = "fixed";
          card.style.top = (event.clientY + 10) + "px"; // posição vertical do card
          card.style.left = (event.clientX + 10) + "px"; // posição horizontal do card
          
          // Adiciona conteúdo ao card
          var cardBody = document.createElement("div");
          cardBody.className = "card-body";
          cardBody.innerHTML = `<h5 class='card-title text-center'>${portos.portoNome}</h5>
                                <h6>Barcaças no porto:</h6>
                                <p class='card-text'>${portos.barcaca.join("<br>")}</p>
                                <br>
                                <h6>Outras Embarcações:</h6>
                                <p class='card-text'>${portos.embarcacaoNome.join("<br>")}</p>`;
          card.appendChild(cardBody);

          // Adiciona o card ao elemento HTML da cena
          document.getElementById("renderCanvas").parentNode.appendChild(card);
      }));

      // Adiciona um evento de mouse out no mesh
      porto.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function() {
          // Remove o card da cena
          document.querySelector("#cardPorto").remove();
      }));
      porto.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function() {
        window.location.href = `/admin/portoVizu/${portos._id}`
      }));

    })

    })
  .catch(error => console.error(error));


const createScene = function () {

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 175, new BABYLON.Vector3(0, 100, 0));
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);


    const modelo3d = BABYLON.SceneLoader.ImportMesh("", "/3dModels/", "Rio_paraguai_2.gltf", scene, function (newMeshes) {
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