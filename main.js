let gameStarted = false;
let scene, camera, renderer, player, speed=0.3;
let moveF=false, moveB=false, moveL=false, moveR=false;
let currentMission=0;
const missions = [];

function startGame(){
  document.getElementById("startScreen").style.display="none";
  document.getElementById("ui").style.display="block";
  document.getElementById("bgMusic").play().catch(()=>{});
  gameStarted=true;
  initGame();
  animate();
}

function initGame(){
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,5,10);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100,100),
    new THREE.MeshBasicMaterial({color:0x228B22})
  );
  ground.rotation.x=-Math.PI/2;
  scene.add(ground);

  // Buildings
  function createBuilding(x,z,color){
    const b = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshBasicMaterial({color:color}));
    b.position.set(x,2.5,z);
    scene.add(b);
    return b;
  }
  const university = createBuilding(20,-20,0x3344ff);
  const office = createBuilding(-20,-20,0xff3333);
  const football = createBuilding(0,-40,0x00aa00);

  missions.push(
    {target: university, text:"University: Yahan meri struggle shuru hui."},
    {target: office, text:"Office: Responsibility ne mujhe change kiya."},
    {target: football, text:"Football Ground: Stress bhool jata hoon yahan."}
  );

  // Player
  player = new THREE.Mesh(new THREE.BoxGeometry(1,2,1), new THREE.MeshBasicMaterial({color:0xffff00}));
  player.position.set(0,1,0);
  scene.add(player);

  // Controls
  document.addEventListener('keydown', e=>{
    if(e.key==='w') moveF=true; if(e.key==='s') moveB=true; if(e.key==='a') moveL=true; if(e.key==='d') moveR=true;
  });
  document.addEventListener('keyup', e=>{
    if(e.key==='w') moveF=false; if(e.key==='s') moveB=false; if(e.key==='a') moveL=false; if(e.key==='d') moveR=false;
  });
}

function updateCamera(){ 
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.position.y = player.position.y + 3;
  camera.lookAt(player.position);
}

function checkMission(){
  if(currentMission >= missions.length) return;
  const t = missions[currentMission];
  if(player.position.distanceTo(t.target.position)<5){
    showStory(t.text);
    currentMission++;
    if(currentMission < missions.length) document.getElementById("mission").innerText = currentMission===1 ? "Go to Office" : "Go to Football Ground";
    else document.getElementById("mission").innerText = "Journey Completed!";
  }
}

function showStory(text){ document.getElementById("storyText").innerText=text; document.getElementById("storyBox").style.display="block"; }
function closeStory(){ document.getElementById("storyBox").style.display="none"; }

function animate(){
  requestAnimationFrame(animate);
  if(!gameStarted) return;

  // Movement
  if(moveF) player.position.z -= speed;
  if(moveB) player.position.z += speed;
  if(moveL) player.position.x -= speed;
  if(moveR) player.position.x += speed;

  updateCamera();
  checkMission();
  renderer.render(scene,camera);
}
