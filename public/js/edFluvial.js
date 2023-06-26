const canvas = document.getElementById('renderCanvas1');
const engine = new 	BABYLON.Engine(canvas, true);

var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0);

    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 170, new BABYLON.Vector3(0, 100, 0));
    camera.setTarget(BABYLON.Vector3.Zero());
    //Deixar segundo parâmetro como "false" para desabilitar escroll duplicado. 
    camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;

   const modelo3d = BABYLON.SceneLoader.ImportMesh("", "/3dModels/", "loy_boat.obj", scene, function (newMeshes) {
    camera.target = newMeshes[0];
    });
    
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.idealWidth = 600;
    advancedTexture.useInvalidateRectOptimization = false;

    const textura_pontos = new BABYLON.StandardMaterial("textura_pontos");
    textura_pontos.diffuseColor = new BABYLON.Color3(0.1, 0.5, 1);
    


    //Colete Salva Vidas

    const colete_salva_vidas = new BABYLON.MeshBuilder.CreateCapsule("colete_salva_vidas", {radius:0.4, height: 3.5, radiusTop:1.5});
    colete_salva_vidas.position.x = 5;
    colete_salva_vidas.position.y = 8;
    colete_salva_vidas.position.z = 0;
    colete_salva_vidas.material = textura_pontos;

    var rect1_colete_salva_vidas = new BABYLON.GUI.Rectangle();
        advancedTexture.addControl(rect1_colete_salva_vidas);
        rect1_colete_salva_vidas.width = "120px";
        rect1_colete_salva_vidas.height ="17px";
        rect1_colete_salva_vidas.thickness = 1;  
        rect1_colete_salva_vidas.linkOffsetY = "-20px";
        rect1_colete_salva_vidas.transformCenterY = 1; 
        rect1_colete_salva_vidas.background = "gray"; 
        rect1_colete_salva_vidas.alpha = 0.7;
        rect1_colete_salva_vidas.scaleX = 0;
        rect1_colete_salva_vidas.scaleY = 0;
        rect1_colete_salva_vidas.cornerRadius = 5
        rect1_colete_salva_vidas.linkWithMesh(colete_salva_vidas);    
  
    var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Colete Salva Vidas";
        text1.color = "white";
        text1.fontSize = 18;
        text1.textWrapping = true;
        text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text1.background = 'white'
        rect1_colete_salva_vidas.addControl(text1)
        text1.alpha = (1/text1.parent.alpha);

    var actionManager = new BABYLON.ActionManager(scene);
    colete_salva_vidas.actionManager = actionManager;

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
            rect1_colete_salva_vidas.animations = [];
            rect1_colete_salva_vidas.animations.push(scaleXAnimation);
            rect1_colete_salva_vidas.animations.push(scaleYAnimation);

        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
                scene.beginAnimation(rect1_colete_salva_vidas, 0, 10, false);
                }));
 
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                    scene.beginAnimation(rect1_colete_salva_vidas, 10, 0, false);
                }));




//GPS

const GPS = new BABYLON.MeshBuilder.CreateCapsule("GPS", {radius:0.4, height: 3.5, radiusTop:1.5});
GPS.position.x = -12;
GPS.position.y = 25;
GPS.position.z = 0;
GPS.material = textura_pontos;

var rect1_GPS = new BABYLON.GUI.Rectangle();
    advancedTexture.addControl(rect1_GPS);
    rect1_GPS.width = "40px";
    rect1_GPS.height ="17px";
    rect1_GPS.thickness = 1;  
    rect1_GPS.linkOffsetY = "-20px";
    rect1_GPS.transformCenterY = 1; 
    rect1_GPS.background = "gray"; 
    rect1_GPS.alpha = 0.7;
    rect1_GPS.scaleX = 0;
    rect1_GPS.scaleY = 0;
    rect1_GPS.cornerRadius = 5
    rect1_GPS.linkWithMesh(GPS);    

var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "GPS";
    text1.color = "white";
    text1.fontSize = 18;
    text1.textWrapping = true;
    text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    text1.background = 'white'
    rect1_GPS.addControl(text1)
    text1.alpha = (1/text1.parent.alpha);

var actionManager = new BABYLON.ActionManager(scene);
GPS.actionManager = actionManager;

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
        rect1_GPS.animations = [];
        rect1_GPS.animations.push(scaleXAnimation);
        rect1_GPS.animations.push(scaleYAnimation);

    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
            scene.beginAnimation(rect1_GPS, 0, 10, false);
            }));

    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                scene.beginAnimation(rect1_GPS, 10, 0, false);
            }));



//Âncora

const ancora = new BABYLON.MeshBuilder.CreateCapsule("ancora", {radius:0.4, height: 3.5, radiusTop:1.5});
ancora.position.x = -55;
ancora.position.y = 18;
ancora.position.z = 0;
ancora.material = textura_pontos;

var rect1_ancora = new BABYLON.GUI.Rectangle();
    advancedTexture.addControl(rect1_ancora);
    rect1_ancora.width = "60px";
    rect1_ancora.height ="17px";
    rect1_ancora.thickness = 1;  
    rect1_ancora.linkOffsetY = "-20px";
    rect1_ancora.transformCenterY = 1; 
    rect1_ancora.background = "gray"; 
    rect1_ancora.alpha = 0.7;
    rect1_ancora.scaleX = 0;
    rect1_ancora.scaleY = 0;
    rect1_ancora.cornerRadius = 5
    rect1_ancora.linkWithMesh(ancora);    

var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "Âncora";
    text1.color = "white";
    text1.fontSize = 18;
    text1.textWrapping = true;
    text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    text1.background = 'white'
    rect1_ancora.addControl(text1)
    text1.alpha = (1/text1.parent.alpha);

var actionManager = new BABYLON.ActionManager(scene);
ancora.actionManager = actionManager;

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
        rect1_ancora.animations = [];
        rect1_ancora.animations.push(scaleXAnimation);
        rect1_ancora.animations.push(scaleYAnimation);

    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
            scene.beginAnimation(rect1_ancora, 0, 10, false);
            }));

    actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                scene.beginAnimation(rect1_ancora, 10, 0, false);
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