const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const canvas = document.getElementById('renderCanvas');
const engine = new 	BABYLON.Engine(canvas, true);


app.get('/', (req, res) => {

var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(4, 100, 20, 3.0);

    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 170, new BABYLON.Vector3(0, 100, 0));
    camera.setTarget(BABYLON.Vector3.Zero());
    //Deixar segundo parâmetro como "false" para desabilitar escroll duplicado. 
    camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;

   const modelo3d = BABYLON.SceneLoader.ImportMesh("", "/3dModels/", "Rio_paraguai_2.gltf", scene, function (newMeshes) {
    camera.target = newMeshes[0];
    });
    
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.idealWidth = 600;
    advancedTexture.useInvalidateRectOptimization = false;

    const textura_pontos = new BABYLON.StandardMaterial("textura_pontos");
    textura_pontos.diffuseColor = new BABYLON.Color3(0.1, 0.5, 1);
    
    //posição Cuiabá

    const cuiaba = new BABYLON.MeshBuilder.CreateCapsule("cuiaba", {radius:0.5, height:10, radiusTop:4});
    cuiaba.position.x = 15;
    cuiaba.position.y = 40;
    cuiaba.position.z = 120;
    cuiaba.material = textura_pontos;

    var rect1_cuiaba = new BABYLON.GUI.Rectangle();
        advancedTexture.addControl(rect1_cuiaba);
        rect1_cuiaba.width = "50px";
        rect1_cuiaba.height ="17px";
        rect1_cuiaba.thickness = 1;  
        rect1_cuiaba.linkOffsetY = "-20px";
        rect1_cuiaba.transformCenterY = 1; 
        rect1_cuiaba.background = "MidnightBlue"; 
        rect1_cuiaba.alpha = 0.7;
        rect1_cuiaba.scaleX = 0;
        rect1_cuiaba.scaleY = 0;
        rect1_cuiaba.cornerRadius = 5
        rect1_cuiaba.linkWithMesh(cuiaba);    
  
    var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Cuiabá";
        text1.color = "white";
        text1.fontSize = 18;
        text1.textWrapping = true;
        text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text1.background = 'white'
        rect1_cuiaba.addControl(text1)
        text1.alpha = (1/text1.parent.alpha);

    var actionManager = new BABYLON.ActionManager(scene);
    cuiaba.actionManager = actionManager;

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
            rect1_cuiaba.animations = [];
            rect1_cuiaba.animations.push(scaleXAnimation);
            rect1_cuiaba.animations.push(scaleYAnimation);

        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                scene.beginAnimation(rect1_cuiaba, 0, 10, false);
                }));
 
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                    scene.beginAnimation(rect1_cuiaba, 10, 0, false);
                }));

    //posição Cáceres

    const caceres = new BABYLON.MeshBuilder.CreateCapsule("caceres", {radius:0.5, height:10, radiusTop:4});
    caceres.position.x = 20;
    caceres.position.y = 35;
    caceres.position.z = 100;
    caceres.material = textura_pontos;

    var rect1_caceres = new BABYLON.GUI.Rectangle();
        advancedTexture.addControl(rect1_caceres);
        rect1_caceres.width = "50px";
        rect1_caceres.height ="17px";
        rect1_caceres.thickness = 1;  
        rect1_caceres.linkOffsetY = "-20px";
        rect1_caceres.transformCenterY = 1; 
        rect1_caceres.background = "MidnightBlue"; 
        rect1_caceres.alpha = 0.7;
        rect1_caceres.scaleX = 0;
        rect1_caceres.scaleY = 0;
        rect1_caceres.cornerRadius = 5
        rect1_caceres.linkWithMesh(caceres);    
  
    var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Cáceres";
        text1.color = "white";
        text1.fontSize = 18;
        text1.textWrapping = true;
        text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text1.background = 'white'
        rect1_caceres.addControl(text1)
        text1.alpha = (1/text1.parent.alpha);

    var actionManager = new BABYLON.ActionManager(scene);
    caceres.actionManager = actionManager;

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
            rect1_caceres.animations = [];
            rect1_caceres.animations.push(scaleXAnimation);
            rect1_caceres.animations.push(scaleYAnimation);

        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                scene.beginAnimation(rect1_caceres, 0, 10, false);
                }));
                //if hover is over remove highlight of the mesh
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                    scene.beginAnimation(rect1_caceres, 10, 0, false);
                }));

    //posição Ladário

    const ladario = new BABYLON.MeshBuilder.CreateCapsule("ladario", {radius:0.5, height:10, radiusTop:4});
    ladario.position.x = 15;
    ladario.position.y = 30;
    ladario.position.z = 35;
    ladario.material = textura_pontos;

    var rect1_ladario = new BABYLON.GUI.Rectangle();
        advancedTexture.addControl(rect1_ladario);
        rect1_ladario.width = "50px";
        rect1_ladario.height ="17px";
        rect1_ladario.thickness = 1;  
        rect1_ladario.linkOffsetY = "-20px";
        rect1_ladario.transformCenterY = 1; 
        rect1_ladario.background = "MidnightBlue"; 
        rect1_ladario.alpha = 0.7;
        rect1_ladario.scaleX = 0;
        rect1_ladario.scaleY = 0;
        rect1_ladario.cornerRadius = 5
        rect1_ladario.linkWithMesh(ladario);    
  
    var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Ladário";
        text1.color = "white";
        text1.fontSize = 18;
        text1.textWrapping = true;
        text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text1.background = 'white'
        rect1_ladario.addControl(text1)
        text1.alpha = (1/text1.parent.alpha);

    var actionManager = new BABYLON.ActionManager(scene);
    ladario.actionManager = actionManager;

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
            rect1_ladario.animations = [];
            rect1_ladario.animations.push(scaleXAnimation);
            rect1_ladario.animations.push(scaleYAnimation);

        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                scene.beginAnimation(rect1_ladario, 0, 10, false);
                }));
                //if hover is over remove highlight of the mesh
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                    scene.beginAnimation(rect1_ladario, 10, 0, false);
                }));

    //posição Forte Coimbra

    const fcoimbra = new BABYLON.MeshBuilder.CreateCapsule("fcoimbra", {radius:0.5, height:10, radiusTop:4});
    fcoimbra.position.x = 8;
    fcoimbra.position.y = 30;
    fcoimbra.position.z = 10;
    fcoimbra.material = textura_pontos;

    var rect1_fcoimbra = new BABYLON.GUI.Rectangle();
        advancedTexture.addControl(rect1_fcoimbra);
        rect1_fcoimbra.width = "80px";
        rect1_fcoimbra.height ="17px";
        rect1_fcoimbra.thickness = 1;  
        rect1_fcoimbra.linkOffsetY = "-20px";
        rect1_fcoimbra.transformCenterY = 1; 
        rect1_fcoimbra.background = "MidnightBlue"; 
        rect1_fcoimbra.alpha = 0.7;
        rect1_fcoimbra.scaleX = 0;
        rect1_fcoimbra.scaleY = 0;
        rect1_fcoimbra.cornerRadius = 5
        rect1_fcoimbra.linkWithMesh(fcoimbra);    

    var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Forte Coimbra";
        text1.color = "white";
        text1.fontSize = 18;
        text1.textWrapping = true;
        text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text1.background = 'white'
        rect1_fcoimbra.addControl(text1)
        text1.alpha = (1/text1.parent.alpha);

    var actionManager = new BABYLON.ActionManager(scene);
    fcoimbra.actionManager = actionManager;

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
            rect1_fcoimbra.animations = [];
            rect1_fcoimbra.animations.push(scaleXAnimation);
            rect1_fcoimbra.animations.push(scaleYAnimation);

        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                scene.beginAnimation(rect1_fcoimbra, 0, 10, false);
                }));
                //if hover is over remove highlight of the mesh
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                    scene.beginAnimation(rect1_fcoimbra, 10, 0, false);
                }));

    //posição Porto Murtinho

    const pmurtinho = new BABYLON.MeshBuilder.CreateCapsule("pmurtinho", {radius:0.5, height:10, radiusTop:4});
    pmurtinho.position.x = 3;
    pmurtinho.position.y = 35;
    pmurtinho.position.z = -30;
    pmurtinho.material = textura_pontos;

    var rect1_pmurtinho = new BABYLON.GUI.Rectangle();
        advancedTexture.addControl(rect1_pmurtinho);
        rect1_pmurtinho.width = "80px";
        rect1_pmurtinho.height ="17px";
        rect1_pmurtinho.thickness = 1;  
        rect1_pmurtinho.linkOffsetY = "-20px";
        rect1_pmurtinho.transformCenterY = 1; 
        rect1_pmurtinho.background = 'MidnightBlue'; 
        rect1_pmurtinho.alpha = 0.7;
        rect1_pmurtinho.scaleX = 0;
        rect1_pmurtinho.scaleY = 0;
        rect1_pmurtinho.cornerRadius = 5
        rect1_pmurtinho.linkWithMesh(pmurtinho);    

    var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Porto Murtinho";
        text1.color = "white";
        text1.fontSize = 18;
        text1.textWrapping = true;
        text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text1.background = 'white'
        rect1_pmurtinho.addControl(text1)
        text1.alpha = (1/text1.parent.alpha);

    var actionManager = new BABYLON.ActionManager(scene);
    pmurtinho.actionManager = actionManager;

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
            rect1_pmurtinho.animations = [];
            rect1_pmurtinho.animations.push(scaleXAnimation);
            rect1_pmurtinho.animations.push(scaleYAnimation);

        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                scene.beginAnimation(rect1_pmurtinho, 0, 10, false);
                }));
                //if hover is over remove highlight of the mesh
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                    scene.beginAnimation(rect1_pmurtinho, 10, 0, false);
                }));


    return scene;

};





const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
})
res.render('canvas', {
    canvasId: engine.getRenderingCanvas().id
  });
})