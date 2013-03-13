if(!H){
   H = {}
}

H.createEnemy = function(initial, speed, sightRadius, hearingRadius, rngStart, rngEnd){
   var tile = Constants.MAP_OBJ.placeTile(initial, function(){
      return ROT.RNG.getRandom(rngEnd, rngStart) 
   }, null, 25)

   Crafty.e("2D, DOM, enemy, OnMap, Moves, Enemy")
   .attr({
      x: tile.x*32,
      y: tile.y*32,
      z:2
   })
   .onMap(tile)
   .moves()
   .enemy(speed, sightRadius, hearingRadius)
}

H.addEnemies = function(){
   var lightPasses = function(x,y){
      if(Constants.MAP[x] && Constants.MAP[x][y]){
         return Constants.MAP[x][y] === 0
      }
      return false
   }

   var soundPasses = function(x,y){
      if(Constants.MAP[x] && Constants.MAP[x][y]){
         return true
      }
      return false
   }

   Crafty.c("Enemy", {
      _speed: 1,
      _sight: 5,
      _hearing: 3,
      _alerted: false,
      _takeTurn: function(){
         var pos = this.getPosition()
         //check sight
         Constants.FOV.compute(pos.x, pos.y, this.getSight(), this._checkSense)

         //check hearing
         Constants.FOV.compute(pos.x, pos.y, this.getHearing(), this._checkSense)

         console.log("["+this[0]+"] " + (this._alerted ? "is alerted" : "is not alerted"))
         
         //move
         //check for player kill
      },
      _checkSense: function(x, y, r, visibility){
         var heroPos = Constants.HERO.getPosition()
         if(heroPos.x === x && heroPos.y === y && visibility > 0){
            this._alerted = true
         }
      },
      "enemy": function(speed, sightRadius, hearingRadius){
         this.requires("OnMap")
         this._speed = speed || 1
         this._sight = sightRadius || 5
         this._hearing = hearingRadius || 3
         return this.bind("Turn", this._takeTurn)
      },
      getSpeed: function(){
         return this._speed
      },
      getHearing: function(){
         return this._hearing
      },
      getSight: function(){
         return this._sight
      }
   })

   Constants.FOV = new ROT.FOV.PreciseShadowcasting(lightPasses)
   Constants.FOH = new ROT.FOV.PreciseShadowcasting(soundPasses)
}
