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
var clearScene;							//クリアー画面
var gameoverScene;						//ゲームオーバー画面
var secondScene;

// FPS計測用
var lastTime = new Date();
var frameNo;
var pframeNo;

// 仮想世界の設定
var worldAABB = new b2AABB();						// Box2Dの空間を作成
worldAABB.minVertex.Set(-1000, -1000);				// 空間の大きさを設定
worldAABB.maxVertex.Set(1000, 1000);				// 空間の大きさを設定
var gravity = new b2Vec2(0, 100);					// 仮想世界に働く重力を定義
var world = new b2World(worldAABB, gravity, true);	// 仮想世界を作成

var m = 0;
var stage;
var target;
var bool1 = true;
var CCnt = 0;
var resetCnt = 3;
var mb = -5;
var hCnt = 0;
//--------------------------------------------------------------------------------------------------
// 画像を物体として追加する関数
//--------------------------------------------------------------------------------------------------
function addBoxImage(scene, imageName, x, y, width, height, params)
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

    var box = world.CreateBody(boxBd);

    // enchant.jsの画像を作成する
    var sprite		= new Sprite(width, height);
    sprite.x		= x - width/2;
    sprite.y		= y - height/2;
    sprite.image	= game.assets[imageName];

    // 画像をシーンに追加する
    scene.addChild(sprite);

    // 物体オブジェクトの「sprite」プロパティに画像を設定する
    box.sprite = sprite;

    // 「box2dobj」プロパティに物体を設定し、画像を返す
    sprite.box2dobj = box;

    return sprite;
}

//-------------------------------------------------------------------------------------------------
// 画像を物体(Circle)として追加する関数
//-------------------------------------------------------------------------------------------------
function addCircleImage(scene, imageName, x, y, rad, params)
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
var sprite = new Sprite(rad, rad);
sprite.x = x - rad/2;
sprite.y = y - rad/2;
sprite.image = game.assets[imageName];

// 画像をシーンに追加する
scene.addChild(sprite);

//衝突判定
sprite.addEventListener(
'enterframe',
function()
{
 if(sprite.intersect(target))
 	{
 	CCnt++;
 	world.DestroyBody(sprite.box2dobj);
	stage.removeChild(sprite);
 	}
 	
 if(sprite.y >= 320)
 	{
 	world.DestroyBody(sprite.box2dobj);
	stage.removeChild(sprite);
	}
 });

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
		'res/img/box.png',				// ボックス
		'res/img/bool.png',				//ボール
		'res/img/brock.png',			//ブロック
		'res/img/bar.png',				//棒
		'res/img/kabe.png',				//壁
		'res/img/reset.png',			//リセットボタン
		'res/img/target.png',			//ターゲット
		'res/img/hanabi123.png',		//花火アニメ
		'res/img/hanabi456.png',		//花火アニメ（太）
		'res/img/waku.png'				//囲い	
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
	startImg.y 		= 140-48*2;

	// タイトルシーンを生成し、描画オブジェクトを追加
	titleScene 		= new Scene();

	titleScene.addChild(titleImg);			// 背景
	titleScene.addChild(startImg);			// START

	// 「START」 にイベント追加
	titleImg.addEventListener(
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
	'enterframe',function()
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

	// 背景画像設定
	var bgImg	 		= new Sprite(320,320);
	bgImg.image 		= game.assets['res/img/bg.png'];
	bgImg.x 			= 0;
	bgImg.y 			= 0;
	

	// FPS用ラベル
	var fpsLabel		= new Label("");
	fpsLabel.x			= 285;
	fpsLabel.y			= 0;
	fpsLabel.color		= 'white';
	lastTime			= new Date();

	// 残り時間
	var Time			= 30;
	var timeLabel		= new Label("");
	timeLabel.x			= 0;
	timeLabel.y			= 0;
	timeLabel.text		= "あと"+Time+"秒";
	timeLabel.font		= "20px sans-serif";
	timeLabel.color		= 'white';
	
	//リセットラベル
	var resetlabel   = new Label("");
	resetlabel.x     = 15;
	resetlabel.y     = 45;
	resetlabel.text  = resetCnt;
	resetlabel.font  = "20px sans-serif";
	resetlabel.color = 'green';
	
	var ax = 4;
	target =  new Sprite(30,30);
	target.image = game.assets['res/img/target.png'];
	target.x = 120;
	target.y = 280;
	
	var rndx = 60+(Math.floor(Math.random() * 180));
	var rndy = 100+(Math.floor(Math.random() * 150));
	
	stage.addChild(bgImg);				// 背景追加

    // 床の追加
    //floor = addBoxImage(stage, 'res/img/floor.png', 160, 320, 320, 80, {});
    kabe = addBoxImage(stage, 'res/img/kabe.png',    0, 140, 80, 260, {"friction":0.2,"restitution":1.0});
    kabe1 = addBoxImage(stage, 'res/img/kabe.png', 320, 140, 80, 260, {"friction":0.2,"restitution":1.0});
	
    // 箱の追加
    var box = new Array;
    do{
    var bool = false;
    var j = 0; 
    box[0] = addBoxImage(stage, 'res/img/brock.png', rndx= 60+(Math.floor(Math.random() * 200)), 
    			rndy= 100+(Math.floor(Math.random() * 150)), 20, 20, {"friction":0.2,"restitution":0.8});
    box[1] = addBoxImage(stage, 'res/img/brock.png', rndx= 60+(Math.floor(Math.random() * 200)),  
    			rndy= 100+(Math.floor(Math.random() * 150)), 20, 20, {"friction":0.2,"restitution":0.8});
    box[2] = addBoxImage(stage, 'res/img/brock.png', rndx= 60+(Math.floor(Math.random() * 200)),
    			rndy= 100+(Math.floor(Math.random() * 150)), 20, 20, {"friction":0.2,"restitution":0.8});
    box[3] = addBoxImage(stage, 'res/img/brock.png', rndx= 60+(Math.floor(Math.random() * 200)), 
    			rndy= 100+(Math.floor(Math.random() * 150)), 20, 20, {"friction":0.2,"restitution":0.8});
    box[4] = addBoxImage(stage, 'res/img/bar.png',     rndx= 70+(Math.floor(Math.random() * 180)), 
    			rndy= 100+(Math.floor(Math.random() * 150)), 60, 10, {"friction":0.2,"restitution":0.8});
    box[5] = addBoxImage(stage, 'res/img/bar.png',     rndx= 70+(Math.floor(Math.random() * 180)), 
    			rndy= 100+(Math.floor(Math.random() * 150)), 60, 10, {"friction":0.2,"restitution":0.8});
    box[6] = addBoxImage(stage, 'res/img/box.png',     rndx= 60+(Math.floor(Math.random() * 200)), 
    			rndy= 100+(Math.floor(Math.random() * 150)), 30, 30, {"friction":0.2,"restitution":0.8});
    box[7] = addBoxImage(stage, 'res/img/box.png',     rndx= 60+(Math.floor(Math.random() * 200)), 
    			rndy= 100+(Math.floor(Math.random() * 150)), 30, 30, {"friction":0.2,"restitution":0.8});
    box[8] = addBoxImage(stage, 'res/img/box.png',     rndx= 60+(Math.floor(Math.random() * 200)), 
    			rndy= 100+(Math.floor(Math.random() * 150)), 30, 30, {"friction":0.2,"restitution":0.8});
    	
    		for(var d = 0;d <= 7;d++)
		    	{
			    	for(var w = d+1;w <= 8;w++)
			    	{
			    	 if(box[d].intersect(box[w]))
				    	 {
				    	 bool = true;
				    	 break;
				    	 }
			    	}
			    	if(bool == true)
				    	 {
				    	 for(j = 0;j <= 8;j++)
							{
							world.DestroyBody(box[j].box2dobj);
							stage.removeChild(box[j]);
							}
				    	 break;
				    	 }
		    	}
    	}while(bool);//やり直し処理

	//円の追加	
	var circle1 = new Array; 
		stage.addEventListener(
		Event.TOUCH_START,function(e)
		{
			if(m <= 1)
			{ 
				for(var h = 1;h <= 16;h++)
				{
			 	 	circle1[h] = addCircleImage(stage, 'res/img/bool.png',((h * 10)+30), 20, 20,{"density":0.1,"friction":0.2,"restitution":0.8});
			 		m++;
			 	}
	 		}
		});
		
	
	//stage.addChild(fpsLabel);			// FPSの追加
	//stage.addChild(timeLabel);			// 残り時間の追加
	stage.addChild(target);				// ターゲット
	stage.addChild(resetlabel);			//リセットラベル	

	//リセットボタン
	var reset = new Sprite(30,30);
	reset.image = game.assets['res/img/reset.png'];
	reset.x = 5;
	reset.y = 40;
	
	//リセットイベント
	 reset.addEventListener(
	    Event.TOUCH_END,function()
	    {
			//BOXを消す
			for(var j = 0;j <= 8;j++)
			{
			world.DestroyBody(box[j].box2dobj);
			stage.removeChild(box[j]);
			}
			//ボールを消す
			for(var q = 1;q <= 16;q++)
			{
			world.DestroyBody(circle1[q].box2dobj);
			stage.removeChild(circle1[q]);
			}
			//ボール数初期化
			m = 0;
			
			resetCnt--;
			if(resetCnt < 0)
			{
			//BOXを消す
			for(var j = 0;j <= 8;j++)
			{
			world.DestroyBody(box[j].box2dobj);
			stage.removeChild(box[j]);
			}
			//ボールを消す
			for(var q = 1;q <= 16;q++)
			{
			world.DestroyBody(circle1[q].box2dobj);
			stage.removeChild(circle1[q]);
			}
			//ボール数初期化
			m = 0;
			initGameoverScene();
			game.replaceScene(gameoverScene);
			}else{
			initPlayScene();				// プレイシーン初期化へ
			game.replaceScene(playScene);
			}
		});

	// ステージグループのイベント
	stage.addEventListener(
		'enterframe',
		function()
		{
		
		if (bool1 == true)  
	 	  {
		 	  if(0 > target.x | target.x > 290)
		 	  {
	          ax *= -1;
	          target.x += ax;	
	          }
	          else
	          {
	          target.x += ax;	 	
	          }	
	       }
          
          stage.addEventListener(
          Event.TOUCH_START,function(e)
          {
            ax *= -1;
         	bool1 = false;
         	
         	stage.addEventListener(
         	Event.TOUCH_MOVE,function(e)
         	{
         	target.moveTo(e.localX,(320-40));
         	});
          });
          stage.addEventListener(
          Event.TOUCH_END,function()
          {
           ax *= -1;
          bool1 = true;
          });
          
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
				fpsLabel.text	= pframeNo + "fps";
				lastTime 		= nowTime;
				
				// カウントダウン
				if(Time > 0)
				{
					Time--;
					timeLabel.text	= "あと" + Time + "秒";
				}

				// クリアー判定
				if(CCnt >= 10)
				{
					//BOXを消す
					for(var j = 0;j <= 8;j++)
					{
					world.DestroyBody(box[j].box2dobj);
					stage.removeChild(box[j]);
					}
					//ボールを消す
					for(var q = 1;q <= 16;q++)
					{
					world.DestroyBody(circle1[q].box2dobj);
					stage.removeChild(circle1[q]);
					}
					//ボール数初期化
					m = 0;
				initSecondScene();
				game.replaceScene(secondScene);
				}

			}
		}
	);
	
	//プレイシーン生成
	playScene = new Scene();

	// stageグループに登録されているオブジェクトをまとめてシーンに登録
	playScene.addChild(stage);

	// プレイシーンの背景黒
	// playScene.backgroundColor = 'black';
	stage.addChild(reset);

}
//-----------------------------------------------------------------------------------------------------
//2ndシーン
function initSecondScene()
{

	var stage3 = new Group(320,320);
	
	// 背景画像設定
	var bgImg 	= new Sprite(320,320);
	bgImg.image 	= game.assets['res/img/bg.png'];
	bgImg.x 		= 0;
	bgImg.y 		= 0;
	
	//玉の画像
	var tama = new Sprite(20,20);
	tama.image = game.assets['res/img/bool.png'];
	tama.x = (320 - 20)/2;
	tama.y = 320;
	
	//囲いの画像
	var waku = new Sprite(30,30);
	waku.image = game.assets['res/img/waku.png'];
	waku.x = (320-30)/2;
	waku.y = (320-30)/2; 
	
	// 「花火1」画像設定
	var myChar4Img 		= new Sprite(200,200);
	myChar4Img.image 		= game.assets['res/img/hanabi456.png'];
	myChar4Img.x 			= (320-200)/2;
	myChar4Img.y 			= (320-200)/2;
	
	// タイトルシーンを生成し、描画オブジェクトを追加
	secondScene 		= new Scene();

	stage3.addChild(bgImg);			// 背景
	stage3.addChild(tama);			//玉
	stage3.addChild(waku);			//囲い
	
	var AniCnt4 = 0;
	var K4 = 0;
	
	
	stage3.addEventListener(
	'enterframe',function()
	{
		//玉を上へ
		tama.moveBy(0,mb);
		
		if(tama.within(waku,10))
		{
			stage3.addEventListener(
			Event.TOUCH_END,function()
			{
				stage3.removeChild(waku);
				stage3.removeChild(tama);
				mb = 0;
				hCnt = 1;	
				stage3.addChild(myChar4Img);	//花火
			});
		}
		
		//GAMEOVER
		if(tama.y <= 120)
		{
		initGameoverScene();
		game.replaceScene(gameoverScene);
		}
		
		//花火を上げる
		if(hCnt == 1)
		{
		AniCnt4++;
		if(AniCnt4 == 3)
			{
			// アニメーションのコマを進める
			myChar4Img.frame = K4;
			K4++;
			AniCnt4 = 0;
		    if(K4 >= 8)
				{
				K4 = 0;
				initClearScene();
				game.replaceScene(clearScene);
				}
			}
		}
	});
	
	secondScene.addChild(stage3);

	game.pushScene(titleScene);				// titleSceneに移行する

}
//----------------------------------------------------------------------------------------------------
//CLAERシーン
function initClearScene()
{
	var stage1 = new Group(320,320);
	
	// 「Clear」画像設定
	var bg1Img 		= new Sprite(320,320);
	bg1Img.image 		= game.assets['res/img/bg.png'];
	bg1Img.x 			= 0;
	bg1Img.y 			= 0;
	stage1.addChild(bg1Img);			// 背景
	
		// 「Clear」画像設定
	var clear1Img 		= new Sprite(270,100);
	clear1Img.image 		= game.assets['res/img/clear.png'];
	clear1Img.x 			= (320-270)/2;
	clear1Img.y 			= (320-100)/2;
	stage1.addChild(clear1Img);
	
	// 「花火1」画像設定
	var myCharImg 		= new Sprite(60,60);
	myCharImg.image 		= game.assets['res/img/hanabi123.png'];
	myCharImg.x 			= 60;
	myCharImg.y 			= 256;
	stage1.addChild(myCharImg);			// 自キャラ
	// 「花火2」画像設定
	var myChar1Img 		= new Sprite(60,60);
	myChar1Img.image 		= game.assets['res/img/hanabi123.png'];
	myChar1Img.x 			= 100;
	myChar1Img.y 			= 80;
	stage1.addChild(myChar1Img);			// 自キャラ
	// 「花火3」画像設定
	var myChar2Img 		= new Sprite(60,60);
	myChar2Img.image 		= game.assets['res/img/hanabi123.png'];
	myChar2Img.x 			= 200;
	myChar2Img.y 			= 190;
	stage1.addChild(myChar2Img);			// 自キャラ

	var AniCnt = 0;
	var AniCnt1 = 0;
	var AniCnt2 = 0;
	var K = 0;
	var K1 = 0;
	var K2 = 0;
	
	var TT = 50;
	stage1.addEventListener(
	'enterframe',function()
	{
		AniCnt++;
		AniCnt1++;
		AniCnt2++;
		TT--;
		
			if(AniCnt == 3)
			{
			// アニメーションのコマを進める
			myCharImg.frame = K;
			K++;
			AniCnt = 0;
		    if(K >= 4)
				{
				K = 0;
				}
			}
			
			if(AniCnt1 == 4)
			{
			// アニメーションのコマを進める
			myChar1Img.frame = K1;
			K1++;
			AniCnt1 = 0;
		    if(K1 >= 4)
				{
				K1 = 0;
				}
			}
			
			if(AniCnt2 == 5)
			{
			// アニメーションのコマを進める
			myChar2Img.frame = K2;
			K2++;
			AniCnt2 = 0;
		    if(K2 >= 4)
				{
				K2 = 0;
				}
			}
		if(TT <= 0)
		{
		// 「Clear」のイベント追加
			clear1Img.addEventListener(
			Event.TOUCH_END,
			function(e)
			{
				//数値初期化
				CCnt = 0;
				resetCnt = 3;
				m = 0;
				mb = -3;
				hCnt = 0;
				initTitleScene();
				game.replaceScene(titleScene);	// タイトルシーンに移行
			});
		}
	});
			
	
	
	clearScene 		= new Scene();
	clearScene.addChild(stage1);
	
		// 「START」のアニメーション
	var titleCnt		= 0;				// アニメーションカウンター
	clearScene.addEventListener(
	'enterframe',function()
		{
			titleCnt += 6;
			if(titleCnt>100)
			{
				titleCnt=0;
			}
			clear1Img.opacity = 1.0 - titleCnt / 100.0;
		}
	);

	game.pushScene(titleScene);				// titleSceneに移行する

}
//-------------------------------------------------------------------------------------------------------
//GAMEOVERシーン
function initGameoverScene()
{
	var stage2 = new Group(320,320);
	
	// 「Clear」画像設定
	var bg2Img 		= new Sprite(320,320);
	bg2Img.image 		= game.assets['res/img/bg.png'];
	bg2Img.x 			= 0;
	bg2Img.y 			= 0;
	stage2.addChild(bg2Img);		// 背景
	
	
	// 「GameOver」画像設定
	var gameoverImg 	= new Sprite(270,100);
	gameoverImg.image 	= game.assets['res/img/gameover.png'];
	gameoverImg.x 		= (320-270)/2;
	gameoverImg.y 		= (320-100)/2;
	stage2.addChild(gameoverImg);
	
	//画面の停止
	var TT = 50;
	stage2.addEventListener(
	'enterframe',function()
	{
		TT--;
		if(TT <= 0)
		{
		// 「GameOver」のイベント追加
		gameoverImg.addEventListener(
			Event.TOUCH_END,
			function(e)
			{
				//数値初期化
				CCnt = 0;
				resetCnt = 3;
				m = 0;
				mb = -3;
				hCnt = 0;
				initTitleScene();
				game.replaceScene(titleScene);	// タイトルシーンに移行
			});
		}
	});
	
		// タイトルシーンを生成し、描画オブジェクトを追加
	gameoverScene 		= new Scene();
	gameoverScene.addChild(stage2);
	
		// 「GAMEOVER」のアニメーション
	var titleCnt		= 0;				// アニメーションカウンター
	gameoverScene.addEventListener(
	'enterframe',function()
		{
			titleCnt += 3;
			if(titleCnt>100)
			{
				titleCnt=0;
			}
			gameoverImg.opacity = 1.0 - titleCnt / 100.0;
		}
	);

	game.pushScene(titleScene);				// titleSceneに移行する
}
