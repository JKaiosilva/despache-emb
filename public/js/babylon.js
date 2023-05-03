const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {

    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 175, new BABYLON.Vector3(0, 100, 0));
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);


    const modelo3d = BABYLON.SceneLoader.ImportMesh("", "/3dModels/", "Maps.gltf", scene, function (newMeshes) {
        camera.target = newMeshes[0];
        });


    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;
    


        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.idealWidth = 600;
        advancedTexture.useInvalidateRectOptimization = false;
    
        const textura_pontos = new BABYLON.StandardMaterial("textura_pontos");
        textura_pontos.diffuseColor = new BABYLON.Color3(0.1, 0.5, 1);
                

        const cuiaba = new BABYLON.MeshBuilder.CreateCapsule("cuiaba", {radius:0.5, height:10, radiusTop:4});
        cuiaba.position.x = 10;
        cuiaba.position.z = 25;
        cuiaba.position.y = 40;
        
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
    
       
    
    return scene;

};





const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
})