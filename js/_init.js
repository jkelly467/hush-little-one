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
 'assets': ['img/Child.png','img/Woman.png','img/Childdead.png','img/Womandead.png','img/tiles.png',
            'img/Stonewall.png','img/Ground.png','img/Pond.png','img/Shortgrass.png','img/Tallgrass.png',
            'img/Forestfloor.png','img/Tree.png','img/Underbrush.png','img/Stream.png',
            'img/Rock.png','img/Snow.png','img/Spring.png',
            'img/bellofunsounding.png', 'img/divineswiftness.png', 'img/maskofstillness.png','img/oilofvanishment.png','img/shroudofconcealment.png','img/warpstone.png'         
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

       for(i=0;i<6;i++){
          H.createEnemy(2,1,5,3,-5,5)
       }
       for(i=0;i<2;i++){
          H.createEnemy(0,1,5,3,-5,5)
       }
       for(i=0;i<2;i++){
          H.createEnemy(3,2,6,2,-5,5)
       }

       Constants.BOSS = H.createBoss('field', Constants.GOAL.x, Constants.GOAL.y)

       for(i=0;i<10;i++){
          H.createItem(0, -1, 1)
       }
       for(i=0;i<2;i++){
          H.createItem(0, -1, 1, 'HolyDagger')
       }

       Constants.NEXT_SCENE = 'forest'

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

      startingBlock = Constants.FUNCTIONS.findBoyStart(Constants.HERO.getPosition())
      Constants.BOY.moveTo(startingBlock.x, startingBlock.y, false)

      for(i=0;i<6;i++){
         H.createEnemy(2,1,5,3,-5,5)
      }
      for(i=0;i<2;i++){
         H.createEnemy(0,1,5,3,-5,5)
      }
      for(i=0;i<2;i++){
         H.createEnemy(3,2,6,2,-5,5)
      }

      Constants.BOSS = H.createBoss('forest', Constants.GOAL.x, Constants.GOAL.y)

      for(i=0;i<8;i++){
         H.createItem(0, -1, 1)
      }
      for(i=0;i<2;i++){
         H.createItem(0, -1, 1, 'HolyDagger')
      }

      Constants.NEXT_SCENE = 'mountain'
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
      
      startingBlock = Constants.FUNCTIONS.findBoyStart(Constants.HERO.getPosition())
      Constants.BOY.moveTo(startingBlock.x, startingBlock.y, false)

      for(i=0;i<6;i++){
         H.createEnemy(2,1,5,3,-5,5)
      }
      for(i=0;i<2;i++){
         H.createEnemy(0,1,5,3,-5,5)
      }
      for(i=0;i<2;i++){
         H.createEnemy(3,2,6,2,-5,5)
      }

      Constants.BOSS = H.createBoss('mountain', Constants.GOAL.x, Constants.GOAL.y)

      for(i=0;i<7;i++){
         H.createItem(0, -1, 1)
      }
      for(i=0;i<1;i++){
         H.createItem(0, -1, 1, 'HolyDagger')
      }

      Constants.NEXT_SCENE = 'ending'
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
