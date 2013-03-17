if(!H){
   H = {}
}

H.createScenes = function(){
   Crafty.scene('loading', function() {
      Crafty.load(H.config.assets, function() {
         H.Components.generateSprites()
         H.Components.generateComponents()
         H.Components.generateAudio()
         $('.ready').text("Click anywhere to begin")
      })
      var opProp = {'opacity':1}

      $('.line1').animate(opProp, 2000, 'linear', function(){
         $('.line2').animate(opProp,2000, 'linear', function(){
            $('.line3').animate(opProp,2000,'linear',function(){
               $('.line4').animate(opProp,2000,'linear',function(){
                  $('.line5').animate(opProp,2000,'linear',function(){
                     $('.title').animate(opProp,2000,'linear')
                  })
               })
            })
         })
      })

      $('.active-area').on('click', function(){
         if($('.ready').text() !== 'Click anywhere to begin') return
         $('.ready').text("Generating map...")
         Crafty.scene('field')
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
      counter = ROT.RNG.getRandom(12,7)
      while(counter--){
         genMap.walk(0, genMap.findMapTile(1), ROT.RNG.getRandom(8,5))
         genMap.walk(3, genMap.findMapTile(1), ROT.RNG.getRandom(9,6))
      }

      Constants.MAP_OBJ = genMap
      Constants.MAP = genMap.getMap()
      $('.opening-screen').hide()
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
         genMap.findOpenSpace(ROT.RNG.getRandom(5,2),1,0)
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
      counter = ROT.RNG.getRandom(16,9)
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
      var tile
      var genMap = new ROT.Map.DrunkardWalk(35,35)
      genMap.create()

      var counter = 20
      while(counter--){
         genMap.placeMapTile(1,4)
      }
      genMap.walk(3, genMap.findMapTile(1), 30)
      var map = genMap.getMap()
      for(var i = 0 ; i < 35; i++){
         for(var j = 0; j < 35;j++){
            if((i===0 || j===0 || i===34 || j===34) && map[i][j] !== 3){
               map[i][j] = 0 
            }
         }
      }

      Constants.MAP_OBJ = genMap
      Constants.MAP = map 
      H.GeneratorFunctions.generateEnding()
   })
}
