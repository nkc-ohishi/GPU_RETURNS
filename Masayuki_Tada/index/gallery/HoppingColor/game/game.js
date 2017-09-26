//--------------------------------------------------------------------------------------------------
// ファイル名：game.js
// コメント　：テンプレート（Box_Touch）
// Copyright ：Ken.D.Ohishi ( Last Update 2012.05.21 )  
//--------------------------------------------------------------------------------------------------

// ライブラリの初期化
enchant();

// ゲームのメインループを管理するオブジェクト
var game;

// シーンオブジェクト（ シーン・・・画面の単位 ）
var titleScene;							// タイトル画面用
var playScene;							// プレー画面用

// FPS計測用
var lastTime = new Date();
var frameNo;
var pframeNo;

// 仮想世界の設定
var worldAABB = new b2AABB();						// Box2Dの空間を作成
worldAABB.minVertex.Set(-1000, -1000);				// 空間の大きさを設定
worldAABB.maxVertex.Set(1000, 1000);				// 空間の大きさを設定
var gravity = new b2Vec2(0, 70);					// 仮想世界に働く重力を定義
var world = new b2World(worldAABB, gravity, true);	// 仮想世界を作成

var stage;
var CCnt = 1;
var NEXTCnt	= 0;
var TC = 0;
var btc = new Array();
var boxCnt = new Array();
var boxflg = new  Array();
for(var i = 0;i < 13;i++)
{
	btc[i] = 2;
	boxCnt[i] = 0+(Math.floor(Math.random() * 3));
	boxflg[i] = false;
}
h = 0;
//--------------------------------------------------------------------------------------------------
// 画像を物体として追加する関数
//--------------------------------------------------------------------------------------------------
function addBoxImage(scene, imageName, x, y, width, height, params, flg)
{
    // Box2Dの物体を作成する
    var boxSd = new b2BoxDef();
    boxSd.extents.Set(width/2, height/2);
    for(var i in params)
	{
		boxSd[i] = params[i];
	}

    var boxBd = new b2BodyDef();
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x,y);

    var boxk = world.CreateBody(boxBd);

    // enchant.jsの画像を作成する
    var sprite		= new Sprite(width, height);
    sprite.x		= x - width/2;
    sprite.y		= y - height/2;
    sprite.image	= game.assets[imageName];
    sprite.frame = boxCnt[flg];
    sprite.addEventListener(
    Event.TOUCH_START,function()
    {
    	for(var i = 0;i < 10;i++)
    	{
		    if(boxflg[i] == true)
		    {
		    	sprite.frame = boxCnt[i];
		    }
    	}
    });

    // 画像をシーンに追加する
    scene.addChild(sprite);

    // 物体オブジェクトの「sprite」プロパティに画像を設定する
    boxk.sprite = sprite;

    // 「box2dobj」プロパティに物体を設定し、画像を返す
    sprite.box2dobj = boxk;
    
    return sprite;
}
//-------------------------------------------------------------------------------------------------
// 画像を物体(Circle)として追加する関数
//-------------------------------------------------------------------------------------------------
function addCircleImage(scene, imageName, x, y, rad, params, flg)
{
	// Box2DのCircleを作成する
	var circleSd = new b2CircleDef(); // 円 
	circleSd.radius = rad/2; // 半径
    for(var c in params)
	{
		circleSd[c] = params[c];
	}

	var circleBd = new b2BodyDef();
	circleBd.AddShape(circleSd);
	circleBd.position.Set(x,y);

	var circle = world.CreateBody(circleBd);

	// enchant.jsの画像を作成する
	var sprite 		= new Sprite(rad, rad);
	sprite.x 		= x - rad/2;
	sprite.y 		= y - rad/2;
	sprite.image 	= game.assets[imageName];
	sprite.frame = boxCnt[flg];
    sprite.addEventListener(
    Event.TOUCH_START,function()
    {
    	for(var i = 10;i < 13;i++)
    	{
		    if(boxflg[i] == true)
		    {
		    	sprite.frame = boxCnt[i];
		    }
    	}
    });

	// 画像をシーンに追加する
	scene.addChild(sprite);

	// 物体オブジェクトの「sprite」プロパティに画像を設定する
	circle.sprite = sprite;

	// 「box2dobj」プロパティに物体を設定し、画像を返す
	sprite.box2dobj = circle;

	return sprite;
}
//--------------------------------------------------------------------------------------------------
// ページ開始(エントリーポイント)
//--------------------------------------------------------------------------------------------------
window.onload = function()
{
	//Gameオブジェクトを320×320で生成
	game = new Game(320, 320);

	//game.fps = 15;						// フレームレートを１５に設定

	// 画像データの読み込み
	game.preload(
		'res/img/title.png',			// タイトル画面
		'res/img/bg.png',				// ゲーム画面背景
		'res/img/start.png',			// 「start」
		'res/img/gameover.png',			// 「gameover」
		'res/img/clear.png',			// 「clear」
		'res/img/floor.png',			// 床
		'res/img/kabe1.png',				//壁
		'res/img/boxC.png',				// ボックス
		'res/img/boalC.png',			//ボール
		'res/img/barC.png',				//バー
		'res/img/nextstep.png'			//「NEXTSTEP」
	);

	// Gameオブジェクトができたら以下を起動
	game.onload = function()
	{
		initTitleScene();				// タイトルシーン設定
	};

	game.start();						// ゲーム開始

};

//--------------------------------------------------------------------------------------------------
// タイトル画面設定
//--------------------------------------------------------------------------------------------------
function initTitleScene()
{
	// 背景画像設定
	var titleImg 	= new Sprite(320,320);
	titleImg.image 	= game.assets['res/img/title.png'];
	titleImg.x 		= 0;
	titleImg.y 		= 0;

	// スタート画像設定
	var startImg 	= new Sprite(236,48);
	startImg.image 	= game.assets['res/img/start.png'];
	startImg.x 		= (320-236)/2;
	startImg.y 		= 320-48*2;

	// タイトルシーンを生成し、描画オブジェクトを追加
	titleScene 		= new Scene();

	titleScene.addChild(titleImg);			// 背景
	titleScene.addChild(startImg);			// START

	// 「START」 にイベント追加
	startImg.addEventListener(
		enchant.Event.TOUCH_END,			// タッチ終了時
		function(e)
		{
			initPlayScene();				// プレイシーン初期化へ
			game.replaceScene(playScene);	// titleSceneをplaySceneにおきかえる
		}
	);

	// 「START」のアニメーション
	var titleCnt		= 0;				// アニメーションカウンター
	titleScene.addEventListener(
		'enterframe',
		function()
		{
			titleCnt += 5;			
			if(titleCnt>100)
			{
				titleCnt=0;
			}
			startImg.opacity = 1.0 - titleCnt / 100.0;
		}
	);

	game.pushScene(titleScene);				// titleSceneに移行する

}

//--------------------------------------------------------------------------------------------------
// プレイ画面設定
//--------------------------------------------------------------------------------------------------
function initPlayScene()
{
	stage = new Group(320,320);
	 
	for(var flg = 0;flg < 13;flg++)
	{
		boxCnt[flg] = 0+(Math.floor(Math.random() * 3));
	}

	// 背景画像設定
	var bgImg	 		= new Sprite(320,320);
	bgImg.image 		= game.assets['res/img/bg.png'];
	bgImg.x 			= 0;
	bgImg.y 			= 0;
	
	//「NEXTSTEP」画像設定
	var NEXTImg			= new Sprite(189,97);
	NEXTImg.image		= game.assets['res/img/nextstep.png'];
	NEXTImg.x			= (320 - 189)/2;
	NEXTImg.y			= (320 - 97)/2;
	
	// 「START」のアニメーション
	var nextCnt		= 0;				// アニメーションカウンター
	stage.addEventListener(
		'enterframe',
		function()
		{
			nextCnt += 5;
			if(nextCnt > 100)
			{
				nextCnt = 0;
			}
			NEXTImg.opacity = 1.0 - nextCnt / 100.0;
		});

	// 「Clear」画像設定
	var clearImg 		= new Sprite(267,48);
	clearImg.image 		= game.assets['res/img/clear.png'];
	clearImg.x 			= (320-267)/2;
	clearImg.y 			= (320-48)/2;
	
	// 「START」のアニメーション
	var clearCnt		= 0;				// アニメーションカウンター
	stage.addEventListener(
		'enterframe',
		function()
		{
			clearCnt += 5;
			if(clearCnt > 100)
			{
				clearCnt = 0;
			}
			clearImg.opacity = 1.0 - clearCnt / 100.0;
		});
		
	// 「Clear」のイベント追加
	clearImg.addEventListener(
		Event.TOUCH_END,
		function(e)
		{
			CCnt = 1;
			NEXTCnt = 0;
			TC = 0;
			for(var h = 0;h < 13;h++)
			{
				btc[h] = 2;
			}
			game.replaceScene(titleScene);	// タイトルシーンに移行
		}
	);

	// 「GameOver」画像設定
	var gameoverImg 	= new Sprite(189,97);
	gameoverImg.image 	= game.assets['res/img/gameover.png'];
	gameoverImg.x 		= (320-189)/2;
	gameoverImg.y 		= (320-97)/2;
	
	// 「START」のアニメーション
	var gameoverCnt		= 0;				// アニメーションカウンター
	stage.addEventListener(
		'enterframe',
		function()
		{
			gameoverCnt += 6;
			if(gameoverCnt > 100)
			{
				gameoverCnt = 0;
			}
			gameoverImg.opacity = 1.0 - gameoverCnt / 100.0;
		}
	);
	// 「GameOver」のイベント追加
	gameoverImg.addEventListener(
		Event.TOUCH_END,
		function(e)
		{
			NEXTCnt = 0;
			TC = 0;
			for(var h = 0;h < 13;h++)
			{
				btc[h] = 2;
			}
			game.replaceScene(titleScene);	// タイトルシーンに移行
		}
	);

	// FPS用ラベル
	var fpsLabel		= new Label("");
	fpsLabel.x			= 285;
	fpsLabel.y			= 0;
	fpsLabel.color		= 'white';
	lastTime			= new Date();

	// 残り時間
	var TimeC;
	//STEP1
	if(NEXTCnt == 0)
	{
		TimeC = 20;
	}
	//STEP2
	if(NEXTCnt == 1)
	{
		TimeC = 30;
	}
	//STEP3
	if(NEXTCnt == 2)
	{
		TimeC = 40;
	}
	
	//タイムラベル
	var Time			= TimeC;
	var timeLabel		= new Label("");
	timeLabel.x			= 0;
	timeLabel.y			= 0;
	timeLabel.text		= 'あと'+Time+'秒';
	timeLabel.font		= "20px sans-serif";
	timeLabel.color		= 'white';
	
	//タッチカウント
	var btcLabel 		= new Label("");
	btcLabel.x			= 1000;
	btcLabel.y			= 1000;
	btcLabel.text		= "あと"+btc[h]+"回";
	btcLabel.font		= "20px sans-serif";
	btcLabel.color		= 'white';
	
	stage.addChild(bgImg);				// 背景追加
	
	//座標
	var rndx;
	var rndy;

    // 床の追加
    floor  = addBoxImage(stage, 'res/img/floor.png',  180, 360, 640, 80, {"restitution":1.05});
    floor1 = addBoxImage(stage, 'res/img/floor.png',  180, -20, 640, 80, {"restitution":1.05});
    //壁の追加
    kabe = addBoxImage(stage, 'res/img/kabe1.png',     0,  160, 80, 640, {"restitution":1.05});
    kabe1 = addBoxImage(stage, 'res/img/kabe1.png',  400,  160, 80, 640, {"restitution":1.05});

    // 箱の追加
    var box = new Array;
    box[0] = addBoxImage(stage, 'res/img/boxC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
    	rndy= 100+(Math.floor(Math.random() * 150)), 40, 40, {"density":1.0,"friction":0.2,"restitution":1.1},0);
    box[1] = addBoxImage(stage, 'res/img/boxC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
    	rndy= 100+(Math.floor(Math.random() * 150)), 40, 40, {"density":1.0,"friction":0.2,"restitution":1.1},1);
    box[2] = addBoxImage(stage, 'res/img/boxC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
    	rndy= 100+(Math.floor(Math.random() * 150)), 40, 40, {"density":1.0,"friction":0.2,"restitution":1.1},2);
    	
    if(NEXTCnt >= 1)
    {
	    box[3] = addBoxImage(stage, 'res/img/boxC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
	    	rndy= 100+(Math.floor(Math.random() * 150)), 40, 40, {"density":1.0,"friction":0.2,"restitution":1.1},3);
	    box[4] = addBoxImage(stage, 'res/img/boxC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
	    	rndy= 100+(Math.floor(Math.random() * 150)), 40, 40, {"density":1.0,"friction":0.2,"restitution":1.1},4);
    }
    
    if(NEXTCnt >= 2)
    {
	    box[5] = addBoxImage(stage, 'res/img/boxC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
	    	rndy= 100+(Math.floor(Math.random() * 150)), 40, 40, {"density":1.0,"friction":0.2,"restitution":1.1},5);
	    box[6] = addBoxImage(stage, 'res/img/boxC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
    	rndy= 100+(Math.floor(Math.random() * 150)), 40, 40, {"density":1.0,"friction":0.2,"restitution":1.1},6);
    }
    
	//棒の追加
    box[7] = addBoxImage(stage, 'res/img/barC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
    	rndy= 100+(Math.floor(Math.random() * 150)), 30, 80, {"density":1.0,"friction":0.2,"restitution":1.1},7);
    
    if(NEXTCnt >= 1)
    {
	    box[8] = addBoxImage(stage, 'res/img/barC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
	    	rndy= 100+(Math.floor(Math.random() * 150)), 30, 80, {"density":1.0,"friction":0.2,"restitution":1.1},8);
    }
    
    if(NEXTCnt >= 2)
    {
	    box[9] = addBoxImage(stage, 'res/img/barC.png', rndx= 60+(Math.floor(Math.random() * 200)), 
	    	rndy= 100+(Math.floor(Math.random() * 150)), 30, 80, {"density":1.0,"friction":0.2,"restitution":1.1},9);
    }
    
    //玉の追加
    box[10] = addCircleImage(stage, 'res/img/boalC.png',rndx= 60+(Math.floor(Math.random() * 200)), 
    		rndy= 100+(Math.floor(Math.random() * 150)), 40,{"density":1.0,"friction":0.2,"restitution":1.11},10);
    
    if(NEXTCnt >= 1)
    {
	    box[11] = addCircleImage(stage, 'res/img/boalC.png',rndx= 60+(Math.floor(Math.random() * 200)), 
	    	    rndy= 100+(Math.floor(Math.random() * 150)), 40,{"density":1.0,"friction":0.2,"restitution":1.11},11);
	}
	
	if(NEXTCnt >= 2)
	{
		box[12] = addCircleImage(stage, 'res/img/boalC.png',rndx= 60+(Math.floor(Math.random() * 200)), 
    	    rndy= 100+(Math.floor(Math.random() * 150)), 40,{"density":1.0,"friction":0.2,"restitution":1.11},12);
    }
    
//	stage.addChild(fpsLabel);			// FPSの追加
	stage.addChild(timeLabel);			// 残り時間の追加
	
	//box0のイベント
	
	box[0].addEventListener(
	Event.TOUCH_START,function()
	{
		if(btc[0] > 0 )
		{
			btc[0]--;
			btcLabel.text		= "あと"+btc[0]+"回";
			btcLabel.x			= box[0].x;
			btcLabel.y			= box[0].y;
			boxflg[0] = true;
			boxCnt[0]++;
			if(boxCnt[0] >= 3)
			{
				boxCnt[0] = 0;
			}
			box[0].addEventListener(
			Event.TOUCH_END,function()
			{
				boxflg[0] = false;
			});
		}
	});

	//box1のイベント
	
	box[1].addEventListener(
	Event.TOUCH_START,function()
	{
		if(btc[1] > 0)
		{
			btc[1]--;
			btcLabel.text		= "あと"+btc[1]+"回";
			btcLabel.x			= box[1].x;
			btcLabel.y			= box[1].y;
			boxflg[1] = true;
			boxCnt[1]++;
			if(boxCnt[1] >= 3)
			{
				boxCnt[1] = 0;
			}
			box[1].addEventListener(
			Event.TOUCH_END,function()
			{
				boxflg[1] = false;
			});
		}
	});
	//box2のイベント
	
	box[2].addEventListener(
	Event.TOUCH_START,function()
	{
		if(btc[2] > 0)
		{
			btc[2]--;
			btcLabel.text		= "あと"+btc[2]+"回";
			btcLabel.x			= box[2].x;
			btcLabel.y			= box[2].y;
			boxflg[2] = true;
			boxCnt[2]++;
			if(boxCnt[2] >= 3)
			{
				boxCnt[2] = 0;
			}
			box[2].addEventListener(
			Event.TOUCH_END,function()
			{
				boxflg[2] = false;
			});
		}
	});
	
	if(NEXTCnt >= 1)
	{
		//box3のイベント
		box[3].addEventListener(
		Event.TOUCH_START,function()
		{
			if(btc[3] > 0)
			{
				btc[3]--;
				btcLabel.text		= "あと"+btc[3]+"回";
				btcLabel.x			= box[3].x;
				btcLabel.y			= box[3].y;
				boxflg[3] = true;
				boxCnt[3]++;
				if(boxCnt[3] >= 3)
				{
					boxCnt[3] = 0;
				}
				box[3].addEventListener(
				Event.TOUCH_END,function()
				{
					boxflg[3] = false;
				});
			}
		});
		//box4のイベント
		box[4].addEventListener(
		Event.TOUCH_START,function()
		{
			if(btc[4] > 0)
			{
				btc[4]--;
				btcLabel.text		= "あと"+btc[4]+"回";
				btcLabel.x			= box[4].x;
				btcLabel.y			= box[4].y;
				boxflg[4] = true;
				boxCnt[4]++;
				if(boxCnt[4] >= 3)
				{
					boxCnt[4] = 0;
				}
				box[4].addEventListener(
				Event.TOUCH_END,function()
				{
					boxflg[4] = false;
				});
			}
		});
	}
	
	if(NEXTCnt >= 2)
	{
		//box5のイベント
		
		box[5].addEventListener(
		Event.TOUCH_START,function()
		{
			if(btc[5] > 0)
			{
				btc[5]--;
				btcLabel.text		= "あと"+btc[5]+"回";
				btcLabel.x			= box[5].x;
				btcLabel.y			= box[5].y;
				boxflg[5] = true;
				boxCnt[5]++;
				if(boxCnt[5] >= 3)
				{
					boxCnt[5] = 0;
				}
				box[5].addEventListener(
				Event.TOUCH_END,function()
				{
					boxflg[5] = false;
				});
			}
		});
		//box6のイベント
		
		box[6].addEventListener(
		Event.TOUCH_START,function()
		{
			if(btc[6] > 0)
			{
				btc[6]--;
				btcLabel.text		= "あと"+btc[6]+"回";
				btcLabel.x			= box[6].x;
				btcLabel.y			= box[6].y;
				boxflg[6] = true;
				boxCnt[6]++;
				if(boxCnt[6] >= 3)
				{
					boxCnt[6] = 0;
				}
				box[6].addEventListener(
				Event.TOUCH_END,function()
				{
					boxflg[6] = false;
				});
			}
		});
	}
	//box7のイベント
	
	box[7].addEventListener(
	Event.TOUCH_START,function()
	{
		if(btc[7] > 0)
		{
			btc[7]--;
			btcLabel.text		= "あと"+btc[7]+"回";
			btcLabel.x			= box[7].x;
			btcLabel.y			= box[7].y;
			boxflg[7] = true;
			boxCnt[7]++;
			if(boxCnt[7] >= 3)
			{
				boxCnt[7] = 0;
			}
			box[7].addEventListener(
			Event.TOUCH_END,function()
			{
				boxflg[7] = false;
			});
		}
	});
	
	if(NEXTCnt >= 1)
	{
		//box8のイベント
		
		box[8].addEventListener(
		Event.TOUCH_START,function()
		{
			if(btc[8] > 0)
			{
				btc[8]--;
				btcLabel.text		= "あと"+btc[8]+"回";
				btcLabel.x			= box[8].x;
				btcLabel.y			= box[8].y;
				boxflg[8] = true;
				boxCnt[8]++;
				if(boxCnt[8] >= 3)
				{
					boxCnt[8] = 0;
				}
				box[8].addEventListener(
				Event.TOUCH_END,function()
				{
					boxflg[8] = false;
				});
			}
		});
	}
	
	if(NEXTCnt >= 2)
	{
		//box9のイベント
		
		box[9].addEventListener(
		Event.TOUCH_START,function()
		{
			if(btc[9] > 0)
			{
				btc[9]--;
				btcLabel.text		= "あと"+btc[9]+"回";
				btcLabel.x			= box[9].x;
				btcLabel.y			= box[9].y;
				boxflg[9] = true;
				boxCnt[9]++;
				if(boxCnt[9] >= 3)
				{
					boxCnt[9] = 0;
				}
				box[9].addEventListener(
				Event.TOUCH_END,function()
				{
					boxflg[9] = false;
				});
			}
		});
	}
	
	//box10のイベント
	box[10].addEventListener(
	Event.TOUCH_START,function()
	{
		if(btc[10] > 0)
		{
			btc[10]--;
			btcLabel.text		= "あと"+btc[10]+"回";
			btcLabel.x			= box[10].x;
			btcLabel.y			= box[10].y;
			boxflg[10] = true;
			boxCnt[10]++;
			if(boxCnt[10] >= 3)
			{
				boxCnt[10] = 0;
			}
			box[10].addEventListener(
			Event.TOUCH_END,function()
			{
				boxflg[10] = false;
			});
		}
	});
	
	if(NEXTCnt >= 1)
	{
		//box11のイベント
		box[11].addEventListener(
		Event.TOUCH_START,function()
		{
			if(btc[11] > 0)
			{
				btc[11]--;
				btcLabel.text		= "あと"+btc[11]+"回";
				btcLabel.x			= box[11].x;
				btcLabel.y			= box[11].y;
				boxflg[11] = true;
				boxCnt[11]++;
				if(boxCnt[11] >= 3)
				{
					boxCnt[11] = 0;
				}
				box[11].addEventListener(
				Event.TOUCH_END,function()
				{
					boxflg[11] = false;
				});
			}
		});
		
	}
	
	if(NEXTCnt >= 2)
	{
		//box12のイベント
		box[12].addEventListener(
		Event.TOUCH_START,function()
		{
			if(btc[12] > 0)
			{
				btc[12]--;
				btcLabel.text		= "あと"+btc[12]+"回";
				btcLabel.x			= box[12].x;
				btcLabel.y			= box[12].y;
				boxflg[12] = true;
				boxCnt[12]++;
				if(boxCnt[12] >= 3)
				{
					boxCnt[12] = 0;
				}
				box[12].addEventListener(
				Event.TOUCH_END,function()
				{
					boxflg[12] = false;
				});
			}
		});
	}
	
	stage.addChild(btcLabel);
	
	// ステージグループのイベント
	stage.addEventListener(
	'enterframe',
	function()
	{
		//「NEXTSTEP」イベント
		if(NEXTCnt != 2)
		{
			if(CCnt == 0)
			{
				for(var h = 0;h <= 12;h++)
				{
					btc[h] = 2;
				}
				TC++;
				if(TC >= 50)
				{
					CCnt = 1;
					NEXTCnt++;
					TC = 0;
					initPlayScene();
					game.replaceScene(playScene);
				}
			}
		}
		
		//clear判定
		//STEP1の時
		//赤の時
		if(NEXTCnt == 0)
		{
			if((boxCnt[0] == 0)&(boxCnt[1] == 0)&(boxCnt[2] == 0)&(boxCnt[7] == 0)&(boxCnt[10] == 0))
			{
				CCnt = 0;
			}
			//青の時
			if((boxCnt[0] == 1)&(boxCnt[1] == 1)&(boxCnt[2] == 1)&(boxCnt[7] == 1)&(boxCnt[10] == 1))
			{
				CCnt = 0;
			}
			//緑の時
			if((boxCnt[0] == 2)&(boxCnt[1] == 2)&(boxCnt[2] == 2)&(boxCnt[7] == 2)&(boxCnt[10] == 2))
			{
				CCnt = 0;
			}
		}
		//STEP2の時
		if(NEXTCnt == 1)
		{
			//赤の時
			if((boxCnt[0] == 0)&(boxCnt[1] == 0)&(boxCnt[2] == 0)&(boxCnt[3] == 0)&(boxCnt[4] == 0)&
				(boxCnt[7] == 0)&(boxCnt[8] == 0)&(boxCnt[10] == 0)&(boxCnt[11] == 0))
			{
				CCnt = 0;
			}
			//青の時
			if((boxCnt[0] == 1)&(boxCnt[1] == 1)&(boxCnt[2] == 1)&(boxCnt[3] == 1)&(boxCnt[4] == 1)&
				(boxCnt[7] == 1)&(boxCnt[8] == 1)&(boxCnt[10] == 1)&(boxCnt[11] == 1))
			{
				CCnt = 0;
			}
			//緑の時
			if((boxCnt[0] == 2)&(boxCnt[1] == 2)&(boxCnt[2] == 2)&(boxCnt[3] == 2)&(boxCnt[4] == 2)&
				(boxCnt[7] == 2)&(boxCnt[8] == 2)&(boxCnt[10] == 2)&(boxCnt[11] == 2))
			{
				CCnt = 0;
			}
		}
		//STEP3の時
		if(NEXTCnt == 2)
		{
			//赤の時
			if((boxCnt[0] == 0)&(boxCnt[1] == 0)&(boxCnt[2] == 0)&(boxCnt[3] == 0)&(boxCnt[4] == 0)&
				(boxCnt[5] == 0)&(boxCnt[6] == 0)&(boxCnt[7] == 0)&(boxCnt[8] == 0)&(boxCnt[9] == 0)&
				(boxCnt[10] == 0)&(boxCnt[11] == 0)&(boxCnt[12] == 0))
			{
				CCnt = 0;
			}
			//青の時
			if((boxCnt[0] == 1)&(boxCnt[1] == 1)&(boxCnt[2] == 1)&(boxCnt[3] == 1)&(boxCnt[4] == 1)&
				(boxCnt[5] == 1)&(boxCnt[6] == 1)&(boxCnt[7] == 1)&(boxCnt[8] == 1)&(boxCnt[9] == 1)&
				(boxCnt[10] == 1)&(boxCnt[11] == 1)&(boxCnt[12] == 1))
			{
				CCnt = 0;
			}
			//緑の時
			if((boxCnt[0] == 2)&(boxCnt[1] == 2)&(boxCnt[2] == 2)&(boxCnt[3] == 2)&(boxCnt[4] == 2)&
				(boxCnt[5] == 2)&(boxCnt[6] == 2)&(boxCnt[7] == 2)&(boxCnt[8] == 2)&(boxCnt[9] == 2)&
				(boxCnt[10] == 2)&(boxCnt[11] == 2)&(boxCnt[12] == 2))
			{
				CCnt = 0;
			}
		}
		
		//STEP1
		if(NEXTCnt == 0)
		{
			if(CCnt == 0)
			{
				for(var j = 0;j <= 2;j++)
				{
					world.DestroyBody(box[j].box2dobj);
					stage.removeChild(box[j]);
				}
				world.DestroyBody(box[7].box2dobj);
				stage.removeChild(box[7]);
				world.DestroyBody(box[10].box2dobj);
				stage.removeChild(box[10]);
				stage.addChild(NEXTImg);
				//CCnt = 1;
			}
			else
			{
				CCnt = 1;
			}
		}
		//STEP2
		if(NEXTCnt == 1)
		{
			if(CCnt == 0)
			{
				for(var j = 0;j <= 4;j++)
				{
					world.DestroyBody(box[j].box2dobj);
					stage.removeChild(box[j]);
				}
				world.DestroyBody(box[7].box2dobj);
				stage.removeChild(box[7]);
				world.DestroyBody(box[8].box2dobj);
				stage.removeChild(box[8]);
				world.DestroyBody(box[10].box2dobj);
				stage.removeChild(box[10]);
				world.DestroyBody(box[11].box2dobj);
				stage.removeChild(box[11]);
				stage.addChild(NEXTImg);
				//CCnt = 1;
			}
			else
			{
				CCnt = 1;
			}
		}
		//STEP3
		if(NEXTCnt == 2)
		{
			if(CCnt == 0)
			{
				for(var j = 0;j <= 12;j++)
				{
					world.DestroyBody(box[j].box2dobj);
					stage.removeChild(box[j]);
				}
				Time = -99;
				stage.addChild(clearImg);
			}
			else
			{
				CCnt = 1;
			}
		}		
	
		//----------------------------------------------------------------------
		// 物理シミュレーションを1ステップ実行する
		world.Step(game.fps/500, 10);

		// すべて物体に対して登録されているスプライトの表示を更新する
		for (var b = world.GetBodyList(); b; b = b.GetNext())
		{
			if("sprite" in b)
			{
				b.sprite.x = b.GetOriginPosition().x - b.sprite.image.width/2;
				b.sprite.y = b.GetOriginPosition().y - b.sprite.image.height/2;
				b.sprite.rotation = Math.round(b.GetRotation()/3.14159*180);
			}
		}
		//-----------------------------------------------------------------------

		// FPS表示
		frameNo++;
		var nowTime = new Date();
		if (lastTime.getSeconds() != nowTime.getSeconds())
		{

			pframeNo		= frameNo;
			frameNo			= 0;
			fpsLabel.text	= pframeNo + ' fps';
			lastTime 		= nowTime;
		
			// カウントダウン
			if(Time > 0)
			{
				Time--;
				timeLabel.text	= 'あと' + Time + '秒';
			}
			else if(CCnt == 1)
			{
				timeLabel.text	= 'そこまで';
				if(NEXTCnt == 0 && Time == 0)
				{
					for(var j = 0;j <= 2;j++)
					{
						world.DestroyBody(box[j].box2dobj);
						stage.removeChild(box[j]);
					}
					world.DestroyBody(box[7].box2dobj);
					stage.removeChild(box[7]);
					world.DestroyBody(box[10].box2dobj);
					stage.removeChild(box[10]);
				}
				if(NEXTCnt == 1 && Time == 0)
				{
					for(var j = 0;j <= 4;j++)
					{
						world.DestroyBody(box[j].box2dobj);
						stage.removeChild(box[j]);
					}
					world.DestroyBody(box[7].box2dobj);
					stage.removeChild(box[7]);
					world.DestroyBody(box[8].box2dobj);
					stage.removeChild(box[8]);
					world.DestroyBody(box[10].box2dobj);
					stage.removeChild(box[10]);
					world.DestroyBody(box[11].box2dobj);
					stage.removeChild(box[11]);
				}
				if(NEXTCnt == 2 && Time == 0)
				{
					for(var j = 0;j <= 12;j++)
					{
						world.DestroyBody(box[j].box2dobj);
						stage.removeChild(box[j]);
					}
				}
				stage.addChild(gameoverImg);		// gameover
			}
		}
	});

	//プレイシーン生成
	playScene = new Scene();

	// stageグループに登録されているオブジェクトをまとめてシーンに登録
	playScene.addChild(stage);

	// プレイシーンの背景黒
	// playScene.backgroundColor = 'black';

}
