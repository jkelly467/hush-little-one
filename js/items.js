if(!H){
   H = {}
}

H.createItem = function(initial, rngStart, rngEnd){
   var tile = Constants.MAP_OBJ.placeTile(initial, function(){
      return ROT.RNG.getRandom(rngEnd, rngStart) 
   })

   var type
   switch(ROT.RNG.getRandom(1)){
      case 0:
         type = "PassageStone"
      break
      case 1:
         type = "OilOfVanishing"
      break
   }

   return Crafty.e("2D, DOM, OnMap,"+type)
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
         this.visible = false
      }
   })

   Crafty.c("PassageStone", {
      init: function(){
         this.requires("Item, passagestone")
         this.item("Passage Stone")
      },
      use: function(mother, child){
         var loc = Constants.MAP_OBJ.placeTile(2, function(){
            return ROT.RNG.getRandom(3,-3)
         })
         var boyLoc = Constants.FUNCTIONS.findBoyStart(loc)
         child.moveTo(boyLoc.x, boyLoc.y, false)
         mother.moveTo(loc.x, loc.y, true)
      }
   })

   Crafty.c("OilOfVanishing", {
      init: function(){
         this.requires("Item, oilofvanishing")
         this.item("Oil Of Vanishing")
      },
      use: function(mother, child){
         console.log("TODO")
      }
   })
}
