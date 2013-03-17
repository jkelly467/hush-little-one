/*
 * Tile Types:
 * 0: Wall
 * 1: Normal terrain
 * 2: Road
 * 3: Water
 *
*/
var H, Constants, ChildMessage

var assetify = function(assetName) {
   var asset, _i, _len, _ref
   _ref = H.config.assets
   for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      asset = _ref[_i]
      if (asset.search(assetName) > -1) {
         return asset
      }
   }
   return "img/"+assetName
}

if (!H) {
   H = {}
}
if (!Constants){
   Constants = {
      'WIDTH':50,
      'HEIGHT':75,
      'MAP_WIDTH': 1600,
      'MAP_HEIGHT': 2400,
      'VP_WIDTH': 800,
      'VP_HEIGHT': 800,
      'MAP': [],
      'VIEWPORT_PADDING': 256,
      'ENEMY_POSITIONS':{},
      'ITEM_POSITIONS':{},
      'FUNCTIONS':{
         lightPasses: function(x,y){
            if(Constants.MAP[x] && Constants.MAP[x][y]){
               return Constants.MAP[x][y] !== 0
            }
            return false
         },
         walkThrough: function(x,y){
            if(Constants.MAP[x] && Constants.MAP[x][y]){
               return (Constants.MAP[x][y] !== 0 && Constants.MAP[x][y] !== 3)
            }
            return false
         },
         soundPasses: function(x,y){
            if(Constants.MAP[x] && Constants.MAP[x][y]){
               return true
            }
            return false
         },
         objInPath: function(obj, x,y){
            var inPath = null
            var pos
            Object.keys(obj).forEach(function(key){
               pos = obj[key]
               if(pos.x === x && pos.y===y){
                  inPath = key 
               }
            })
            return inPath
         },
         closestPosition: function(obj, x, y){
            var closest, closeVal
            var currentClosest = Infinity
            Object.keys(obj).forEach(function(key){
               closeVal = Math.max(Math.abs(obj[key].x-x), Math.abs(obj[key].y-y))
               if(/^boss/.test(key) && closeVal <= 8){
                  closest = Constants.BOSS[0]
                  currentClosest = 0
               }
               if(closeVal < currentClosest){
                  currentClosest = closeVal
                  closest = key
               }
            })
            if(typeof closest !== 'number'){
               closest = Number(closest)
            }

            return {
               id: closest,
               distance: currentClosest
            }

         },
         randomDir: function(){
            switch(ROT.RNG.getRandom(7)){
               case 0:
                  return "N"
               case 1:
                  return "NE"
               case 2:
                  return "E"
               case 3:
                  return "SE"
               case 4:
                  return "S"
               case 5:
                  return "SW"
               case 6:
                  return "W"
               case 7:
                  return "NW"
            }
         },
         findBoyStart: function(coord){
            var bad = [0,3]
            if(bad.indexOf(Constants.MAP[coord.x+1][coord.y]) === -1){
               coord.x++
               return coord
            }else if(bad.indexOf(Constants.MAP[coord.x-1][coord.y]) === -1){
               coord.x--
               return coord
            }else if(bad.indexOf(Constants.MAP[coord.x][coord.y-1]) === -1){
               coord.y--
               return coord
            }else if(bad.indexOf(Constants.MAP[coord.x+1][coord.y-1]) === -1){
               coord.x++
               coord.y--
               return coord
            }else if(bad.indexOf(Constants.MAP[coord.x-1][coord.y-1]) === -1){
               coord.x--
               coord.y--
               return coord
            }
         }
      }
   }
}

if(!ChildMessage){
   ChildMessage = {
      WAIT: 1,
      COMFORT: 2,
      FOLLOW: 3
   }
}

H.config = {
 'assets': ['img/Child.png','img/Woman.png','img/Childdead.png','img/Womandead.png',
            'img/Soldier.png','img/Captain.png','img/Hellhound.png','img/Imp.png','img/Devil.png','img/Golem.png',
            'img/Stonewall.png','img/Ground.png','img/Pond.png','img/Shortgrass.png','img/Tallgrass.png',
            'img/Forestfloor.png','img/Tree.png','img/Underbrush.png','img/Stream.png',
            'img/Rock.png','img/Snow.png','img/Spring.png',
            'img/bellofunsounding.png', 'img/divineswiftness.png', 'img/maskofstillness.png','img/oilofvanishment.png','img/shroudofconcealment.png','img/warpstone.png','img/holydagger.png',
            'img/Danza.png','img/Cerberus.png','img/Abomination.png'
           ]
}  

function layTile(tileSprite, x, y){
   Crafty.e("2D, DOM,"+ tileSprite)
      .attr({
         x: x*32,
         y: y*32,
         z:1
      })
}

function findStartingBlock(){
   for(var i = 0 ; i < Constants.WIDTH; i++){
      if(Constants.MAP[i][Constants.HEIGHT-1] === 2){
         return i
      }
   }
}

function findGoalBlock(){
   for(var i = 0 ; i < Constants.WIDTH; i++){
      if(Constants.MAP[i][0] === 2){
         return i
      }
   }
}

H.GeneratorFunctions = {
   generateField: function(){
      Crafty.viewport.init(Constants.VP_WIDTH, Constants.VP_HEIGHT)

      for(i = 0; i < Constants.WIDTH; i++){
         for(j = 0; j < Constants.HEIGHT; j++){
            switch(Constants.MAP[i][j]){
               case 0:
                  layTile('wall',i,j)
               break
               case 1:
                  layTile('grass',i,j)
               break
               case 2:
                  layTile('ground',i,j)
               break
               case 3: 
                  layTile('water',i,j)
               break
               case 4: 
                  layTile('tallgrass',i,j)
               break
            }
         }
      }

      Constants.VIEWPORT_MAP_BOUNDS = new Crafty.polygon(
         [0,0], [Constants.MAP_WIDTH, 0],
         [Constants.MAP_WIDTH, Constants.MAP_HEIGHT], [0, Constants.MAP_HEIGHT]
      )

      Constants.GOAL = {
         x: findGoalBlock(),
         y:0
      }
      var startingBlock = findStartingBlock()
      Constants.HERO = Crafty.e(H.Components.heroComponents.join(',')).attr({
         x: startingBlock*32,
         y: (Constants.HEIGHT-1)*32,
         z: 3
      })
      .onMap()
      .mother()
      .viewportFollow(Constants.VIEWPORT_PADDING, Constants.VIEWPORT_MAP_BOUNDS)
      .moveTo(startingBlock, (Constants.HEIGHT-1), true)

       startingBlock = Constants.FUNCTIONS.findBoyStart(Constants.HERO.getPosition())
       Constants.BOY = Crafty.e('2D, DOM, boy, OnMap, Moves, Speaks, Child, Persist').attr({
         x: startingBlock.x*32,
         y: startingBlock.y*32,
         z:3
       })
       .onMap(startingBlock)
       .moves()
       .child(Constants.HERO)

       for(i=0;i<4;i++){
          H.createEnemy(2,1,5,3,-5,5,'soldier')
       }
       for(i=0;i<2;i++){
          H.createEnemy(0,1,5,3,-5,5,'soldier')
       }
       for(i=0;i<2;i++){
          H.createEnemy(3,2,6,2,-5,5,'captain')
       }

       Constants.BOSS = H.createBoss('danza', Constants.GOAL.x, Constants.GOAL.y)

       for(i=0;i<10;i++){
          H.createItem(0, -1, 1)
       }
       for(i=0;i<2;i++){
          H.createItem(0, -1, 1, 'HolyDagger')
       }

       Constants.CURRENT_SCENE = 'field'
       Constants.NEXT_SCENE = 'forest'
       Crafty.audio.play("fieldMusic",-1)

   },
   generateForest: function(){
      for(i = 0; i < Constants.WIDTH; i++){
         for(j = 0; j < Constants.HEIGHT; j++){
            switch(Constants.MAP[i][j]){
               case 0:
                  layTile('tree',i,j)
               break
               case 1:
                  layTile('forestfloor',i,j)
               break
               case 2:
                  layTile('ground',i,j)
               break
               case 3: 
                  layTile('stream',i,j)
               break
               case 4: 
                  layTile('underbrush',i,j)
               break
            }
         }
      }

      Constants.GOAL = {
         x: findGoalBlock(),
         y:0
      }
      Crafty.viewport.reset()
      var startingBlock = findStartingBlock()
      Constants.HERO
      .addComponent('ViewportFollow')
      .viewportFollow(Constants.VIEWPORT_PADDING, Constants.VIEWPORT_MAP_BOUNDS)
      .moveTo(startingBlock, (Constants.HEIGHT-1), true)

      if(!Constants.BOY._dead){
         startingBlock = Constants.FUNCTIONS.findBoyStart(Constants.HERO.getPosition())
         Constants.BOY.moveTo(startingBlock.x, startingBlock.y, false)
      }else{
         Constants.BOY.visible = false
      }

      for(i=0;i<2;i++){
         H.createEnemy(2,1,5,3,-5,5,'soldier')
      }
      for(i=0;i<3;i++){
         H.createEnemy(0,1,6,1,-5,5,'imp')
      }
      for(i=0;i<2;i++){
         H.createEnemy(2,1,6,1,-5,5,'imp')
      }
      for(i=0;i<1;i++){
         H.createEnemy(1,2,6,2,-5,5,'captain')
      }
      for(i=0;i<2;i++){
         H.createEnemy(3,2,2,7,-5,5,'hellhound')
      }

      Constants.BOSS = H.createBoss('cerberus', Constants.GOAL.x, Constants.GOAL.y)

      for(i=0;i<9;i++){
         H.createItem(0, -1, 1)
      }
      for(i=0;i<2;i++){
         H.createItem(0, -1, 1, 'HolyDagger')
      }

      Constants.CURRENT_SCENE = 'forest'
      Constants.NEXT_SCENE = 'mountain'
      Crafty.audio.play("forestMusic",-1)
   },
   generateMountain: function(){
      for(i = 0; i < Constants.WIDTH; i++){
         for(j = 0; j < Constants.HEIGHT; j++){
            switch(Constants.MAP[i][j]){
               case 0:
                  layTile('rock',i,j)
               break
               case 1:
                  layTile('wall',i,j)
               break
               case 2:
                  layTile('ground',i,j)
               break
               case 3: 
                  layTile('spring',i,j)
               break
               case 4: 
                  layTile('snow',i,j)
               break
            }
         }
      }

      Constants.GOAL = {
         x: findGoalBlock(),
         y:0
      }
      var startingBlock = findStartingBlock()
      Constants.HERO
      .addComponent('ViewportFollow')
      .viewportFollow(Constants.VIEWPORT_PADDING, Constants.VIEWPORT_MAP_BOUNDS)
      .moveTo(startingBlock, (Constants.HEIGHT-1), true)
      
      if(!Constants.BOY._dead){
         startingBlock = Constants.FUNCTIONS.findBoyStart(Constants.HERO.getPosition())
         Constants.BOY.moveTo(startingBlock.x, startingBlock.y, false)
      }else{
         Constants.BOY.visible = false
      }

      for(i=0;i<1;i++){
         H.createEnemy(2,1,5,3,-5,5,'soldier')
      }
      for(i=0;i<2;i++){
         H.createEnemy(0,1,6,1,-5,5,'imp')
      }
      for(i=0;i<1;i++){
         H.createEnemy(1,2,6,2,-5,5,'captain')
      }
      for(i=0;i<2;i++){
         H.createEnemy(0,2,2,7,-5,5,'hellhound')
      }
      for(i=0;i<2;i++){
         H.createEnemy(0,2,8,1,-5,5,'golem')
      }
      for(i=0;i<2;i++){
         H.createEnemy(2,2,8,1,-5,5,'golem')
      }
      for(i=0;i<2;i++){
         H.createEnemy(1,2,8,5,-5,5,'devil')
      }

      Constants.BOSS = H.createBoss('abomination', Constants.GOAL.x, Constants.GOAL.y)

      for(i=0;i<7;i++){
         H.createItem(0, -1, 1)
      }
      for(i=0;i<1;i++){
         H.createItem(0, -1, 1, 'HolyDagger')
      }
      
      Constants.CURRENT_SCENE = 'mountain'
      Constants.NEXT_SCENE = 'ending'
      Crafty.audio.play("mountainMusic",-1)
   },
   generateEnding: function(){
      for(i = 0; i < 35; i++){
         for(j = 0; j < 35; j++){
            switch(Constants.MAP[i][j]){
               case 0:
                  layTile('wall',i,j)
               break
               case 1:
                  layTile('grass',i,j)
               break
               case 2:
                  layTile('ground',i,j)
               break
               case 3: 
                  layTile('pond',i,j)
               break
               case 4: 
                  layTile('tree',i,j)
               break
            }
         }
      }

      var startingBlock = Constants.MAP_OBJ.findMapTile(1)
      var boydead = Constants.BOY._dead
      Crafty.audio.play("fieldMusic",-1)

      Constants.HERO
      .addComponent('ViewportFollow')
      .viewportFollow(Constants.VIEWPORT_PADDING, Constants.VIEWPORT_MAP_BOUNDS)
      .moveTo(startingBlock.w, startingBlock.h, true)
      
      if(!boydead){
         startingBlock = Constants.FUNCTIONS.findBoyStart(Constants.HERO.getPosition())
         Constants.BOY.moveTo(startingBlock.x, startingBlock.y, false)
         $('.ending-screen').css("background-color","rgba(0,0,255,0)")
      }else{
         Constants.BOY.visible = false
         $('.ending-screen').css("background-color","rgba(0,0,255,0.1)")
      }
     
      $('.ending-screen').show()
      var opProp = {opacity:1}
      var optLine = function(){
         $('.eline2').animate(opProp,2000,'linear')
      }
      setTimeout(function(){
         $('.eline1').animate(opProp,2000,'linear',boydead ? optLine : function(){})
      },3000)
   }
}

H.Game = function() {
   var hero,i,j

   Crafty.init(Constants.MAP_WIDTH, Constants.MAP_HEIGHT)

   H.createScenes()
   
   Crafty.scene('loading')
}

window.onload = function() {
   var game = new H.Game()
}
