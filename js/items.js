if(!H){
   H = {}
}

H.createItem = function(initial, rngStart, rngEnd, hardType){
   var tile = Constants.MAP_OBJ.placeTile(initial, function(){
      return ROT.RNG.getRandom(rngEnd, rngStart) 
   })

   var type = hardType
   if(!type){
      switch(ROT.RNG.getRandom(4)){
         case 0:
            type = "PassageStone"
         break
         case 1:
            type = "OilOfVanishing"
         break
         case 2:
            type = "ShroudOfShadows"
         break
         case 3:
            type = "BellOfUnsounding"
         break
         case 4:
            type = "MaskOfStillness"
         break
         case 4:
            type = "DivineSwiftness"
         break
      }
   }

   return Crafty.e("2D, DOM, OnMap, "+type)
   .attr({
      x: tile.x*32,
      y: tile.y*32,
      z:2
   })
   .onMap(tile)
   .setItemPosition()
}

H.addItems = function(){
   Crafty.c("Item", {
      _name: "",
      item: function(name){
         this.requires("OnMap")
         this._name = name
      },
      getName: function(){
         return this._name
      },
      setItemPosition: function(){
         Constants.ITEM_POSITIONS[this[0]] = this.getPosition()
         return this
      },
      removeFromBoard: function(){
         Constants.ITEM_POSITIONS[this[0]] = {x:-1, y:-1}
         this.addComponent("Persist")//this inventory item needs to stick around across scenes
         this.visible = false
      }
   })

   Crafty.c("PassageStone", {
      init: function(){
         this.requires("Item, passagestone")
         this.item("Passage Stone")
      },
      use: function(mother, child){
         var loc = Constants.MAP_OBJ.placeTile(0, function(){
            return ROT.RNG.getRandom(3,-3)
         })
         if(!child._dead){
            var boyLoc = Constants.FUNCTIONS.findBoyStart(loc)
            child.moveTo(boyLoc.x, boyLoc.y, false)
         }
         mother.moveTo(loc.x, loc.y, true)
         return true
      }
   })

   Crafty.c("DivineSwiftness", {
      init: function(){
         this.requires("Item, divineswiftness")
         this.item("Divine Swiftness")
      },
      use: function(mother, child){
         Crafty.trigger("ItemUsed", {
            swift: true,
            turns: ROT.RNG.getRandom(12,5)
         })
         return true
      }
   })

   Crafty.c("OilOfVanishing", {
      init: function(){
         this.requires("Item, oilofvanishing")
         this.item("Oil of Vanishing")
      },
      use: function(mother, child){
         Crafty.trigger("ItemUsed", {
            invisible: true,
            turns: ROT.RNG.getRandom(12,5)
         })
         return true
      }
   })

   Crafty.c("ShroudOfShadows", {
      init: function(){
         this.requires("Item, shroudofshadows")
         this.item("Shroud of Shadows")
      },
      use: function(mother, child){
         Crafty.trigger("ItemUsed", {
            invisible: true,
            moveTrigger:true
         })
         return true
      }
   })
   
   Crafty.c("BellOfUnsounding", {
      init: function(){
         this.requires("Item, bellofunsounding")
         this.item("Bell of Unsounding")
      },
      use: function(mother, child){
         Crafty.trigger("ItemUsed", {
            unheard: true,
            turns: ROT.RNG.getRandom(12,5)
         })
         return true
      }
   })
   
   Crafty.c("MaskOfStillness", {
      init: function(){
         this.requires("Item, maskofstillness")
         this.item("Mask of Stillness")
      },
      use: function(mother, child){
         Crafty.trigger("ItemUsed", {
            unheard: true,
            moveTrigger: true
         })
         return true
      }
   })

   Crafty.c("HolyDagger", {
      init: function(){
         this.requires("Item, holydagger")
         this.item("Holy Dagger")
      },
      _findClosestEnemy: function(x,y){
         var enemyPos
      },
      use: function(mother, child){
         var motherPos = mother.getPosition()
         var result = Constants.FUNCTIONS.closestPosition(Constants.ENEMY_POSITIONS, motherPos.x, motherPos.y)
         if(result.distance <= 8){
            Crafty(result.id).takeDagger()
            return true
         }else{
            mother.speak("I see no one...")
            return false
         }
      }
   })
}
