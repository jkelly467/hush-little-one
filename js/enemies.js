if(!H){
   H = {}
}

H.createEnemy = function(initial, speed, sightRadius, hearingRadius, rngStart, rngEnd){
   var tile = Constants.MAP_OBJ.placeTile(initial, function(){
      return ROT.RNG.getRandom(rngEnd, rngStart) 
   }, null, 25)

   return Crafty.e("2D, DOM, enemy, OnMap, Moves, Enemy")
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
   Crafty.c("Enemy", {
      _speed: 1,
      _sight: 5,
      _hearing: 3,
      _alerted: false,
      _motherPath: [],
      _boyPath: [],
      _getDirFromCoords: function(coord){
         var pos = this.getPosition()
         var diffX = coord.x - pos.x
         var diffY = coord.y - pos.y

         if(diffX === 0 && diffY < 0){
            return "N"
         }else if(diffX > 0 && diffY < 0){
            return "NE"
         }else if(diffX > 0 && diffY === 0){
            return "E"
         }else if(diffX > 0 && diffY > 0){
            return "SE"
         }else if(diffX === 0 && diffY > 0){
            return "S"
         }else if(diffX < 0 && diffY > 0){
            return "SW"
         }else if(diffX < 0 && diffY === 0){
            return "W"
         }else if(diffX < 0 && diffY < 0){
            return "NW"
         }
      },
      _takeTurn: function(){
         this._alerted = false
         var i
         var pos = this.getPosition()
         //check sight
         Constants.FOV.compute(pos.x, pos.y, this.getSight(), this._checkSense.bind(this))

         //check hearing
         Constants.FOV.compute(pos.x, pos.y, this.getHearing(), this._checkSense.bind(this))

         //move
         if(this._alerted){
            //find path toward player if player is spotted
            this._motherPath = []
            this._boyPath = []
            var heroPos = Constants.HERO.getPosition()
            var boyPos = Constants.BOY.getPosition()

            var astar = new ROT.Path.AStar(heroPos.x, heroPos.y, Constants.FUNCTIONS.walkThrough)
            astar.compute(pos.x, pos.y, this._motherPathing.bind(this))

            astar = new ROT.Path.AStar(boyPos.x, boyPos.y, Constants.FUNCTIONS.walkThrough)
            astar.compute(pos.x, pos.y, this._boyPathing.bind(this))

            var path = (this._motherPath.length < this._boyPath.length) ? this._motherPath : this._boyPath

            //first coordinate returned by astar is the current enemy position
            //so we shift up one to get the next set of points
            for(i = 1 ; i < this.getSpeed()+1; i++){
               if(path[i]){
                  this.nextMove(this._getDirFromCoords(path[i]), false)
               }
            }
         }else{
            //move randomly
            for(i = 0 ; i < this.getSpeed(); i++){
               this.nextMove(Constants.FUNCTIONS.randomDir(), false)
            }
         }
         this._updatePosition()
         //check for player kill
      },
      _updatePosition:function(){
         Constants.ENEMY_POSITIONS[this[0]] = this.getPosition()
      },
      _checkSense: function(x, y, r, visibility){
         var heroPos = Constants.HERO.getPosition()
         var boyPos = Constants.BOY.getPosition()
         if(((heroPos.x === x && heroPos.y === y) ||
            (boyPos.x === x && boyPos.y === y)) &&
            visibility > 0)
         {
            this._alerted = true
         }
      },
      _motherPathing: function(x,y){
         this._motherPath.push({x:x,y:y})
      },
      _boyPathing: function(x,y){
         this._boyPath.push({x:x,y:y})
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

   Constants.FOV = new ROT.FOV.PreciseShadowcasting(Constants.FUNCTIONS.lightPasses)
   Constants.FOH = new ROT.FOV.PreciseShadowcasting(Constants.FUNCTIONS.soundPasses)
}
