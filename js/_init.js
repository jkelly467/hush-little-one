/*
 * Tile Types:
 * 0: Wall
 * 1: Normal terrain
 * 2: Road
 * 3: Water
 *
*/
var H, Constants

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
      'WIDTH':/*50*/25,
      'HEIGHT':/*75*/25,
      'MAP_WIDTH': 1600,
      'MAP_HEIGHT': 2400,
      'VP_WIDTH': 800,
      'VP_HEIGHT': 800,
      'MAP': [],
      'VIEWPORT_PADDING': {
         top: 128,
         bottom: 128,
         right: 128,
         left: 128
      } 
   }
}

H.config = {
 'assets': ['img/tiles.png']
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
   for(var i = 0 ; i < Constants.HEIGHT; i++){
      if(Constants.MAP[i][Constants.WIDTH-1] === 2){
         return i
      }
   }
}

H.Game = function() {
   var hero,i,j
   var generateWorld = function() {

      for(i = 0; i < Constants.HEIGHT; i++){
         for(j = 0; j < Constants.WIDTH; j++){
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
               case 3: layTile('water',i,j)
               break
            }
         }
      }

      Constants.VIEWPORT_MAP_BOUNDS = new Crafty.polygon(
         [0,0], [Constants.MAP_WIDTH, 0],
         [Constants.MAP_WIDTH, Constants.MAP_HEIGHT], [0, Constants.MAP_HEIGHT]
      )

      hero = Crafty.e(H.Components.heroComponents.join(',')).attr({
         x: findStartingBlock()*32,
         y: Constants.VP_HEIGHT-32,
         z: 2
      })
      // .controls(2, 5)
      // .viewportFollow(Constants.VIEWPORT_PADDING, Constants.VIEWPORT_MAP_BOUNDS)
      
   }

   Crafty.init(Constants.VP_WIDTH, Constants.VP_HEIGHT)
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
      var genMap = new ROT.Map.DrunkardWalk(25,25)
      genMap.create()
      var counter = 6
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(4,1),1,0)
      }
      counter = 3
      while(counter--){
         genMap.findOpenSpace(1,1,3)
      }
      genMap.hollowBlocks(0,1)
      counter = 3
      while(counter--){
         genMap.walk(0, genMap.findMapTile(1), 5)
         genMap.walk(3, genMap.findMapTile(1), 8)
      }

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
