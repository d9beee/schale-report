let canvas, textbox, gl, shader, batcher, assetManager, skeletonRenderer;
let mvp = new spine.webgl.Matrix4();

let lastFrameTime;
let spineData;
let bgmfile = '';
let bgmvolume = 0;
let bgm;
let bufferColor = [ 0.3, 0.3, 0.3 ];

const CHARACTER = 'Rin_raiddungeon';
const BINARY_PATH = window.location.protocol === 'file:' ? location.href.replace('/index.html', `/assets/${CHARACTER}.skel`) : `../assets/${CHARACTER}.skel`;
const ATLAS_PATH = window.location.protocol === 'file:' ? location.href.replace('/index.html', `/assets/${CHARACTER}.atlas`) : `../assets/${CHARACTER}.atlas`;
const BG_PATH = window.location.protocol === 'file:' ? location.href.replace('/index.html', '/assets/Raid_Bg.png') : '../assets/Raid_Bg.png';
const START = Math.floor(Math.random() * 2);

let customScale = 1;
let targetFps = 30;

let introAnimation;
let acceptingClick;
let characterOffset = { x: -800, y: 0 };
let currentVoiceline = 0;
let mouseSelect = -1;
let trackerID = -1;
let untrackerID = -1;
let unpetID = -1;
let PPointX, PPointY, EPointX, EPointY;
let TPoint, TEye;
let flipped = false;
let displayDialog = false;

let transpose = 1;

// All voicelines are manually timed for duration. This may not be the most optimized solution, but works for all intents and purposes.
const INTRO_AUDIO = {
	track: [ 1, 2 ],
	dialog: [ "I've been waiting, Sensei.", "You know what'd make me happy? Schale taking care of Kivotos' problems." ],
	delay: [ 2500, 3500 ]
};
const INTERACT_AUDIO = {
	track: [ 1, 2, 3, 4, 5, 6 ],
	dialog: [ "Let's get started.", "Situations such as these are always a bitter pill to swallow.", "There isn't much that can be done. Schale is the only option left.", "I know I've put you through a lot, Sensei.", "...You're working hard.", "Studying your work is proving to be quite enlightening for me." ],
	delay: [ 1800, 1000, 1000, 1000, 1000, 1000 ]
};

const HITBOX = {
	headpat: { xMin: 1300, xMax: 1600, yMin: 350, yMax: 535 },
	voiceline: { xMin: 1230, xMax: 1600, yMin: 810, yMax: 1300 }
};

const HEADPAT_CLAMP = 30;
const EYE_CLAMP_X = 200;
const EYE_CLAMP_Y = EYE_CLAMP_X * (9 / 16)
const HEADPAT_STEP = 5;
const EYE_STEP = 10;
let mousePos = { x: 0, y: 0 };
let volume = 0.5;
let mouseOptions = { voicelines: true, headpatting: true, mousetracking: true };

function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}

// NOTE: X and Y appears to be inversely related from cursor position to bone adjustment.
//       This behavior's reason is unknown, but it LOOKS right so leave it alone!
function trackMouse() {
	let adjX = (mousePos.x / canvas.width) - 0.5 - (characterOffset.x / (2880 * 2));
	let adjY = (mousePos.y / canvas.height) - 0.5 - (characterOffset.y / (1620 * 2));
	TEye.y = TEye.y - (Math.sign(adjX) * EYE_STEP);
	TEye.x = TEye.x - (Math.sign(adjY) * EYE_STEP);
	TEye.y = clamp(TEye.y, EPointY - (Math.abs(adjX) * EYE_CLAMP_X), EPointY + (Math.abs(adjX) * EYE_CLAMP_X));
	TEye.x = clamp(TEye.x, EPointX - (Math.abs(adjY) * EYE_CLAMP_Y), EPointX + (Math.abs(adjY) * EYE_CLAMP_Y));
}

function untrackMouse() {
	if (Math.abs(TEye.y - EPointY) <= EYE_STEP && Math.abs(TEye.x - EPointX) <= EYE_STEP) {
		if (untrackerID != -1) {
			TEye.y = EPointY;
			TEye.x = EPointX;
			clearInterval(untrackerID);
			untrackerID = -1;
			setTimeout(function (){
				acceptingClick = true;
			}, 500);
		}
	}
	if (TEye.y > EPointY) TEye.y -= EYE_STEP;
	if (TEye.y < EPointY) TEye.y += EYE_STEP;
	if (TEye.x > EPointX) TEye.x -= EYE_STEP;
	if (TEye.x < EPointX) TEye.x += EYE_STEP;
}

function unpet() {
	if (Math.abs(TPoint.x - PPointX) <= HEADPAT_STEP && Math.abs(TPoint.y - PPointY) <= HEADPAT_STEP) {
		if (unpetID != -1) {
			TPoint.x = PPointX;
			TPoint.y = PPointY;
			clearInterval(unpetID);
			unpetID = -1;
			setTimeout(function (){
				acceptingClick = true;
			}, 500);
		}
	}
	if (TPoint.y > PPointY) TPoint.y -= HEADPAT_STEP;
	if (TPoint.y < PPointY) TPoint.y += HEADPAT_STEP;
	if (TPoint.x > PPointX) TPoint.x -= HEADPAT_STEP;
	if (TPoint.x < PPointX) TPoint.x += HEADPAT_STEP;
}

function playVoiceline() {
	spineData.state.clearListeners();
	spineData.state.setEmptyAnimation(1, 1);
	spineData.state.setEmptyAnimation(2, 1);
	spineData.state.addAnimation(1, `Talk_0${INTERACT_AUDIO.track[currentVoiceline]}_M`, false, 0);
	spineData.state.addAnimation(2, `Talk_0${INTERACT_AUDIO.track[currentVoiceline]}_A`, false, 0);
	spineData.state.addEmptyAnimation(1, 0.5, 0);
	spineData.state.addEmptyAnimation(2, 0.5, 0);

	let track = new Audio(`./assets/audio/Rin_RaidLobby_Talk_${INTERACT_AUDIO.track[currentVoiceline]}.ogg`);
	track.volume = volume;
	textbox.innerHTML = INTERACT_AUDIO.dialog[currentVoiceline];
	setTimeout(function() {
		if (displayDialog) textbox.style.opacity = 1;
		track.play();
		track.addEventListener('ended', function() {
			textbox.style.opacity = 0;
			acceptingClick = true;
		})
	}, INTERACT_AUDIO.delay[currentVoiceline]);

	currentVoiceline = (currentVoiceline + 1) % INTERACT_AUDIO.track.length;
}

// Hitbox Scaling
function t(n, side) {
	let d = { x: { length: 2880, mid: (canvas.width / 2) }, y: { length: 1620, mid: (canvas.height / 2) } }
	n = d[side].mid - n;
	n = (d[side].length / (transpose * 2)) - n;
	n = (n - (d[side].length / (transpose * 2))) / customScale;
	return (n + (d[side].length / (transpose * 2))) * transpose;
}

// -1 = [No Entry], 1 = Headpat, 2 = Voiceline, 3 = Eye Track
function pressedMouse(x, y) {
	tx = t(x, 'x');
	ty = t(y, 'y');
	if (tx > (HITBOX.headpat.xMin + characterOffset.x) && tx < (HITBOX.headpat.xMax + characterOffset.x) && ty > (HITBOX.headpat.yMin - characterOffset.y) && ty < (HITBOX.headpat.yMax - characterOffset.y) && mouseOptions.headpatting) {
		spineData.state.setAnimation(1, 'Pat_01_M', false);
		spineData.state.setAnimation(2, 'Pat_01_A', false);
		mouseSelect = 1;
	}
	else if (tx > (HITBOX.voiceline.xMin + characterOffset.x) && tx < (HITBOX.voiceline.xMax + characterOffset.x) && ty > (HITBOX.voiceline.yMin - characterOffset.y) && ty < (HITBOX.voiceline.yMax - characterOffset.y) && mouseOptions.voicelines) {
		mouseSelect = 2;
	}
	else if (mouseOptions.mousetracking) {
		if (trackerID == -1) {
			trackerID = setInterval(trackMouse, 20);
		}
		spineData.state.setEmptyAnimation(1, 0);
		spineData.state.setEmptyAnimation(2, 0);
		let eyetracking = spineData.state.addAnimation(1, 'Look_01_M', false, 0);
		let eyetracking2 = spineData.state.addAnimation(2, 'Look_01_A', false, 0);
		eyetracking.mixDuration = 0.2;
		eyetracking2.mixDuration = 0.2;
		mousePos.x = x;
		mousePos.y = y;
		mouseSelect = 3;
	}
}

function movedMouse(x, y, deltaX, deltaY) {
	switch (mouseSelect) {
		case 1:
			if ((y < 810 && deltaY < 0) || (x >= 1440 && deltaX > 0)) {
				TPoint.y = clamp(TPoint.y - HEADPAT_STEP, PPointY - HEADPAT_CLAMP, PPointY + HEADPAT_CLAMP);
			}
			else if ((y >= 810 && deltaY > 0) || (x < 1440 && deltaX < 0)) {
				TPoint.y = clamp(TPoint.y + HEADPAT_STEP, PPointY - HEADPAT_CLAMP, PPointY + HEADPAT_CLAMP);
			}
			break;
		case 2:
			mouseSelect = -1;
			acceptingClick = true;
			break;
		case 3:
			mousePos.x = x;
			mousePos.y = y;
			break;
		default:
	}
}

function releasedMouse(x, y) {
	switch (mouseSelect) {
		case 1:
			if (unpetID == -1) {
				unpetID = setInterval(unpet, 20);
			}
			spineData.state.setAnimation(1, 'PatEnd_01_M', false);
			spineData.state.setAnimation(2, 'PatEnd_01_A', false);
			spineData.state.addEmptyAnimation(1, 0.5, 0);
			break;
		case 2:
			playVoiceline();
			break;
		case 3:
			if (trackerID != -1) {
				clearInterval(trackerID);
				trackerID = -1;
			}
			if (untrackerID == -1) {
				untrackerID = setInterval(untrackMouse, 20);
			}
			let eyetracking = spineData.state.setAnimation(1, 'LookEnd_01_M', false);
			let eyetracking2 = spineData.state.setAnimation(2, 'LookEnd_01_A', false);
			eyetracking.mixDuration = 0;
			eyetracking2.mixDuration = 0;
			break;
		default:
	}
	mouseSelect = -1;
}

function setMouse(event) {
	let ax = event.clientX;
	let ay = event.clientY;
	let mx = 1;
	if (flipped) {
		mx = -1;
		ax = canvas.width - ax;
	}

	return { x: ax, y: ay, m: mx }
}

function init() {
	// Wallpaper Engine settings
	window.wallpaperPropertyListener = {
		applyUserProperties: (props) => {
			if (props.schemecolor) {
				bufferColor = props.schemecolor.value.split(" ");
			}
			if (props.alignmentfliph) flipped = props.alignmentfliph.value;
			if (props.scale) {
				customScale = props.scale.value;
				resize();
			}
			if (props.targetfps) targetFps = props.targetfps.value;

			if (props.introanimation) introAnimation = props.introanimation.value;

			if (props.mousetracking) mouseOptions.mousetracking = props.mousetracking.value;
			if (props.headpatting) mouseOptions.headpatting = props.headpatting.value;
			if (props.voicelines) mouseOptions.voicelines = props.voicelines.value;
			if (props.voicevolume) volume = props.voicevolume.value / 100;

			if (props.characterx) characterOffset.x = ((props.characterx.value - 50) / 100) * 2880;
			if (props.charactery) characterOffset.y = ((props.charactery.value - 50) / -100) * 1620;
			if (props.showdialog) displayDialog = props.showdialog.value;
			if (props.dialogx) textbox.style.left = props.dialogx.value + '%';
			if (props.dialogy) textbox.style.top = props.dialogy.value + '%';

			if (props.bgmfile) {
				bgmfile = 'file:///' + props.bgmfile.value.replace("%3A", "\:");
			}
			if (props.bgmvolume) {
				bgmvolume = props.bgmvolume.value / 100;
				if (bgm) bgm.volume = bgmvolume;
			}
		}
	};

	// Setup canvas and WebGL context. We pass alpha: false to canvas.getContext() so we don't use premultiplied alpha when
	// loading textures. That is handled separately by PolygonBatcher.

	textbox = document.getElementById('textbox');

	canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let config = { alpha: false, premultipliedAlpha: false };
	gl = canvas.getContext('webgl', config) || canvas.getContext('experimental-webgl', config);
	if (!gl) {
		alert('WebGL is unavailable.');
		return;
	}

	// Create a simple shader, mesh, model-view-projection matrix, SkeletonRenderer, and AssetManager.
	shader = spine.webgl.Shader.newTwoColoredTextured(gl);
	batcher = new spine.webgl.PolygonBatcher(gl);
	mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
	skeletonRenderer = new spine.webgl.SkeletonRenderer(gl);
	assetManager = new spine.webgl.AssetManager(gl);
	sceneRenderer = new spine.webgl.SceneRenderer(canvas, gl);

    // Tell AssetManager to load the resources for each skeleton, including the exported .skel file, the .atlas file and the .png
	// file for the atlas. We then wait until all resources are loaded in the load() method.
    assetManager.loadBinary(BINARY_PATH);
	assetManager.loadTextureAtlas(ATLAS_PATH);
	assetManager.loadTexture(BG_PATH);

	requestAnimationFrame(load);
}

// CITATION: http://esotericsoftware.com/spine-api-reference#
// CITATION: http://en.esotericsoftware.com/forum/Spine-Unity-Making-the-arm-follow-the-mouse-7856
function interactionLoad() {
	// Touch_Point and Touch_Eye
	TPoint = spineData.skeleton.findBone('Touch_Point');
	TEye = spineData.skeleton.findBone('Touch_Eye');
	PPointX = TPoint.x;
	PPointY = TPoint.y;
	EPointX = TEye.x;
	EPointY = TEye.y;

	downaction = canvas.addEventListener('mousedown', function (event) {
		if (!acceptingClick) {
			return;
		}
		acceptingClick = false;
		let mouseData = setMouse(event);
		pressedMouse(mouseData.x, mouseData.y);
	});
	upaction = canvas.addEventListener('mouseup', function(event) {
		let mouseData = setMouse(event);
		releasedMouse(mouseData.x, mouseData.y);
	});
	moveaction = canvas.addEventListener('mousemove', function(event) {
		let mouseData = setMouse(event);
		movedMouse(mouseData.x, mouseData.y, (event.movementX * mouseData.m), event.movementY);
	});

	return 1;
}

function introLine() {
	if (introAnimation) {
		spineData.state.addAnimation(0, 'Start0' + (START + 1) + '_Idle_01', false, 0);
		spineData.state.addAnimation(0, 'Idle_01', true, 0);

		setTimeout(function() {
			let track = new Audio(`./assets/audio/Rin_RaidLobby_In_${INTRO_AUDIO.track[START]}.ogg`);
			track.volume = volume;
			textbox.innerHTML = INTRO_AUDIO.dialog[START];
			if (displayDialog) textbox.style.opacity = 1;
			track.play();
			track.addEventListener('ended', function() {
				textbox.style.opacity = 0;
				acceptingClick = true;
			})
		}, INTRO_AUDIO.delay[START]);

		return;
	}
	spineData.state.addAnimation(0, 'Idle_01', true, 0);
	acceptingClick = true;
}

function load() {
	// Wait until the AssetManager has loaded all resources, then load the skeletons.
	if (assetManager.isLoadingComplete() && typeof introAnimation !== 'undefined') {
		spineData = loadSpineData(false);
		interactionLoad();

		introLine();

		// Plays BGM (if set)
		bgm = new Audio(bgmfile);
		bgm.volume = bgmvolume;
		bgm.play();
		bgm.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);

		lastFrameTime = Date.now() / 1000;

		resize();
		requestAnimationFrame(render); // Loading is done, call render every frame.
	} else {
		setTimeout(function(){
			requestAnimationFrame(load);
		}, 250);
	}
}

function loadSpineData(premultipliedAlpha) {
	// Load the texture atlas from the AssetManager.
	let atlas = assetManager.get(ATLAS_PATH);

	// Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
	let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

	// Create a SkeletonBinary instance for parsing the .skel file.
	let skeletonBinary = new spine.SkeletonBinary(atlasLoader);

	// Set the scale to apply during parsing, parse the file, and create a new skeleton.
	skeletonBinary.scale = 1;
	let skeletonData = skeletonBinary.readSkeletonData(assetManager.get(BINARY_PATH));
	let skeleton = new spine.Skeleton(skeletonData);
	let bounds = calculateSetupPoseBounds(skeleton);
	skeleton.x = characterOffset.x;
	skeleton.y = characterOffset.y;

	// Create an AnimationState, and set the initial animation in looping mode.
	let animationStateData = new spine.AnimationStateData(skeleton.data);
	animationStateData.defaultMix = 0.5;
	let animationState = new spine.AnimationState(animationStateData);

	// Pack everything up and return to caller.
	return { skeleton: skeleton, state: animationState, bounds: bounds, premultipliedAlpha: premultipliedAlpha };
}

function calculateSetupPoseBounds(skeleton) {
	skeleton.setToSetupPose();
	skeleton.updateWorldTransform();
	let offset = new spine.Vector2();
	let size = new spine.Vector2();
	skeleton.getBounds(offset, size, []);
	return { offset: offset, size: size };
}

function render() {
	let now = Date.now() / 1000;
	let delta = now - lastFrameTime;

	lastFrameTime = now;

	gl.clearColor(bufferColor[0], bufferColor[1], bufferColor[2], 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	sceneRenderer.begin();
	sceneRenderer.drawTexture(assetManager.get(BG_PATH), ((2880 * customScale * (1 / transpose)) / -2), ((2025 * customScale * (1 / transpose)) / -2), (2880 * customScale * (1 / transpose)), (2025 * customScale * (1 / transpose)));
	sceneRenderer.end();

	// Apply the animation state based on the delta time.
	let skeleton = spineData.skeleton;
	let state = spineData.state;
	let premultipliedAlpha = spineData.premultipliedAlpha;
	state.update(delta);
	state.apply(skeleton);
	skeleton.updateWorldTransform();

	// Bind the shader and set the texture and model-view-projection matrix.
	shader.bind();
	shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
	shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);

	// Start the batch and tell the SkeletonRenderer to render the active skeleton.
	batcher.begin(shader);
	skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
	skeletonRenderer.draw(batcher, skeleton);
	skeleton.x = characterOffset.x;
	skeleton.y = characterOffset.y;

	batcher.end();

	shader.unbind();

	// throttle fps
	let elapsed = Date.now() / 1000 - now;
	let targetFrameTime = 1 / targetFps;
	let delay = Math.max(targetFrameTime - elapsed, 0) * 1000;

	setTimeout(() => {
		requestAnimationFrame(render);
	}, delay);
}

function resize() {
	let w = canvas.clientWidth;
	let h = canvas.clientHeight;
	if (canvas.width != w || canvas.height != h) {
		canvas.width = w;
		canvas.height = h;
	}

	// Calculations to center the skeleton in the canvas.
	let centerX = 0;
	let centerY = 900;
	let wr = canvas.width / 2880;
	let hr = canvas.height / 1620;
	let width = (2880 / customScale);
	let height = (1620 / customScale);

	if (wr < hr) {
		width = height * (canvas.width / canvas.height);

		transpose = 1620 / canvas.height;
	}
	else if (wr > hr) {
		height = width * (canvas.height / canvas.width);

		transpose = 2880 / canvas.width;
	}
	else {
		transpose = 1620 / canvas.height;
	}

	mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
	gl.viewport(0, 0, canvas.width, canvas.height);
}

init();
