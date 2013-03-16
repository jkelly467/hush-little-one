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
      'VIEWPORT_PADDING': 224,
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
 'assets': ['img/Child.png','img/Woman.png','img/Stonewall.png','img/Ground.png','img/Pond.png','img/Shortgrass.png','img/Tallgrass.png','img/tiles.png','img/Childdead.png','img/Womandead.png']
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

H.Game = function() {
   var hero,i,j
   var generateWorld = function() {
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
                  layTile('road',i,j)
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
       Constants.BOY = Crafty.e('2D, DOM, boy, OnMap, Moves, Speaks, Child').attr({
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

       for(i=0;i<8;i++){
          H.createItem(0, -1, 1)
       }
   }

   Crafty.init(Constants.MAP_WIDTH, Constants.MAP_HEIGHT)
   Crafty.scene('loading', function() {
      Crafty.load(H.config.assets, function() {
         Crafty.scene('main')
      })
      Crafty.e('2D, DOM, Text').attr({
         w: 100,
         h: 20,
         x: 150,
         y: 120
      }).text('Loading').css({
        'text-align': 'center'
      })
   })
   Crafty.scene('main', function() {
      var genMap = new ROT.Map.DrunkardWalk(50,75)
      genMap.create()
      var counter = 8
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(5,2),1,0)
      }
      counter = ROT.RNG.getRandom(7,2)
      while(counter--){
         genMap.findOpenSpace(1,1,3)
      }
      genMap.hollowBlocks(0,1)
      counter = ROT.RNG.getRandom(8,5)
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(6,2),1,4)
      }
      counter = ROT.RNG.getRandom(10,4)
      while(counter--){
         genMap.walk(0, genMap.findMapTile(1), 5)
         genMap.walk(3, genMap.findMapTile(1), 8)
      }

      Constants.MAP_OBJ = genMap
      Constants.MAP = genMap.getMap()
      H.Components.generateSprites()
      H.Components.generateComponents(true)
      generateWorld()
   })
   
   Crafty.scene('loading')
}

window.onload = function() {
   var game = new H.Game()
}
