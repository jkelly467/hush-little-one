if(!H){
   H = {}
}

H.createScenes = function(){
   Crafty.scene('loading', function() {
      Crafty.load(H.config.assets, function() {
         Crafty.scene('field')
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

   Crafty.scene('field', function() {
      var genMap = new ROT.Map.DrunkardWalk(50,75)
      genMap.create()
      var counter = 8
      //wall blocks
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(5,2),1,0)
      }
      //water blocks
      counter = ROT.RNG.getRandom(7,2)
      while(counter--){
         genMap.findOpenSpace(1,1,3)
      }
      genMap.hollowBlocks(0,1)
      //tall grass
      counter = ROT.RNG.getRandom(8,5)
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(6,2),1,4)
      }
      //jags of water and wall
      counter = ROT.RNG.getRandom(10,4)
      while(counter--){
         genMap.walk(0, genMap.findMapTile(1), ROT.RNG.getRandom(8,5))
         genMap.walk(3, genMap.findMapTile(1), ROT.RNG.getRandom(9,6))
      }

      Constants.MAP_OBJ = genMap
      Constants.MAP = genMap.getMap()
      H.Components.generateSprites()
      H.Components.generateComponents(true)
      H.GeneratorFunctions.generateField()
   })

   Crafty.scene('forest', function() {
      var genMap = new ROT.Map.DrunkardWalk(50,75)
      genMap.create()
      var counter = 6
      //wall blocks
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(6,2),1,0)
      }
      //water blocks
      counter = ROT.RNG.getRandom(7,4)
      while(counter--){
         genMap.findOpenSpace(1,1,3)
      }
      genMap.hollowBlocks(0,1)
      //underbrush
      counter = ROT.RNG.getRandom(12,8)
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(6,3),1,4)
      }
      //jags of wall and water
      counter = ROT.RNG.getRandom(15,8)
      while(counter--){
         genMap.walk(0, genMap.findMapTile(1), ROT.RNG.getRandom(12,8))
         genMap.walk(3, genMap.findMapTile(1), ROT.RNG.getRandom(15,9))
      }

      Constants.MAP_OBJ = genMap
      Constants.MAP = genMap.getMap()
      H.GeneratorFunctions.generateForest()
   })

   Crafty.scene('mountain', function() {
      var genMap = new ROT.Map.DrunkardWalk(50,75)
      genMap.create()
      var counter = 20
      //wall blocks
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(4,2),1,0)
      }
      //water blocks
      counter = ROT.RNG.getRandom(3)
      while(counter--){
         genMap.findOpenSpace(1,1,3)
      }
      genMap.hollowBlocks(0,1)
      //snow
      counter = ROT.RNG.getRandom(8,6)
      while(counter--){
         genMap.findOpenSpace(ROT.RNG.getRandom(6,3),1,4)
      }
      //jags of wall
      counter = ROT.RNG.getRandom(15,8)
      while(counter--){
         genMap.walk(0, genMap.findMapTile(1), ROT.RNG.getRandom(15,7))
      }
      //jags of water
      counter = ROT.RNG.getRandom(5,2)
      while(counter--){
         genMap.walk(3, genMap.findMapTile(1), ROT.RNG.getRandom(7,3))
      }

      Constants.MAP_OBJ = genMap
      Constants.MAP = genMap.getMap()
      H.GeneratorFunctions.generateMountain()
   })

   Crafty.scene('ending', function(){
      Crafty.e('2D, DOM, Text').attr({
         w: 100,
         h: 20,
         x: 150,
         y: 120
      }).text('You Win!').css({
        'text-align': 'center'
      })

   })
}
