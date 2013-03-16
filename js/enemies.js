if(!H){
   H = {}
}

H.createEnemy = function(initial, speed, sightRadius, hearingRadius, rngStart, rngEnd, sprite){
   var tile = Constants.MAP_OBJ.placeTile(initial, function(){
      return ROT.RNG.getRandom(rngEnd, rngStart) 
   }, null, 25)

   sprite = sprite || 'enemy'

   return Crafty.e("2D, DOM, enemy, OnMap, Moves, Enemy, "+sprite)
   .attr({
      x: tile.x*32,
      y: tile.y*32,
      z:3
   })
   .onMap(tile)
   .moves()
   .enemy(speed, sightRadius, hearingRadius)
}

H.createBoss = function(type, x, y){
   if(x === Constants.WIDTH-1){ 
      x -= 1
   }

   Constants.ENEMY_POSITIONS['boss1'] = {x:x, y:y}
   Constants.ENEMY_POSITIONS['boss2'] = {x:x+1, y:y}
   Constants.ENEMY_POSITIONS['boss3'] = {x:x, y:y+1}
   Constants.ENEMY_POSITIONS['boss4'] = {x:x+1,y: y+1}
   return Crafty.e("2D, DOM, OnMap, Boss, Color")
      .attr({
         x: x*32,
         y: y*32,
         w: 64,
         h: 64,
         z: 8
      })
      .color("#123456")
}

H.addEnemies = function(){
   Crafty.c("Boss", {
      takeDagger: function(){
         this.setPosition({x:-101, y:-101})
         Constants.ENEMY_POSITIONS['boss1'] = {x:-101, y:-101}
         Constants.ENEMY_POSITIONS['boss2'] = {x:-101, y:-101}
         Constants.ENEMY_POSITIONS['boss3'] = {x:-101, y:-101}
         Constants.ENEMY_POSITIONS['boss4'] = {x:-101 ,y:-101}
         this.visible = false
      }
   })


   Crafty.c("Enemy", {
      _speed: 1,
      _sight: 5,
      _hearing: 3,
      _alerted: false,
      _motherPath: [],
      _boyPath: [],
      _alertedCount: 0,
      _lastKnownBoyPos: null,
      _lastKnownMotherPos: null,
      _offTurn: false,
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
      generatedNoiseCheck: function(radius){
         if(Constants.HERO.getUnheard()) return
         var pos = this.getPosition()
         Constants.FOH.compute(pos.x, pos.y, radius, this._checkSenseAlt.bind(this))
         if(this._alerted){
            this._alertedCount = 5
         }
      },
      _takeTurn: function(e){
         if(this._alertedCount){
            this._alertedCount--
         }else{
            this._alerted = false
            this._lastKnownMotherPos = null
            this._lastKnownBoyPos = null
         }
         
         var effectiveSpeed = this.getSpeed()
         var i
         var pos = this.getPosition()
         if(e.multiplier){
            effectiveSpeed = Math.floor(effectiveSpeed * e.multiplier)
         }

         if(effectiveSpeed === 0){
            this._offTurn = !this._offTurn
            if(this._offTurn){
               return
            }else{
               effectiveSpeed = 1
            }
         }else{
            this._offTurn = false
         }

         //check sight
         if(!Constants.HERO.getInvisible()){
            Constants.FOV.compute(pos.x, pos.y, this.getSight(), this._checkSense.bind(this))
         }

         //check hearing
         if(!Constants.HERO.getUnheard()){
            Constants.FOV.compute(pos.x, pos.y, this.getHearing(), this._checkSense.bind(this))
         }

         //move
         var movementPotential = effectiveSpeed 
         if(this._alerted){
            //find path toward player if player is spotted
            this._motherPath = []
            this._boyPath = []
            var heroPos = this._lastKnownMotherPos || Constants.HERO.getPosition()
            var boyPos = this._lastKnownBoyPos || Constants.BOY.getPosition()

            var astar = new ROT.Path.AStar(heroPos.x, heroPos.y, Constants.FUNCTIONS.walkThrough)
            astar.compute(pos.x, pos.y, this._motherPathing.bind(this))

            astar = new ROT.Path.AStar(boyPos.x, boyPos.y, Constants.FUNCTIONS.walkThrough)
            astar.compute(pos.x, pos.y, this._boyPathing.bind(this))

            var path
            if(!this._boyPath.length){
               path = this._motherPath
            }else if(!this._motherPath.length){
               path = this._boyPath
            }else{
               path = (this._motherPath.length < this._boyPath.length) ? this._motherPath : this._boyPath
            }

            //first coordinate returned by astar is the current enemy position
            //so we shift up one to get the next set of points
            for(i = 1 ; i < effectiveSpeed+1; i++){
               if(path[i] && this.nextMove(this._getDirFromCoords(path[i]), false)){
                  movementPotential--
               }
            }
         }else{
            //move randomly
            for(i = 0 ; i < effectiveSpeed; i++){
               if(this.nextMove(Constants.FUNCTIONS.randomDir(), false)){
                  movementPotential--
               }
            }
         }
         if(movementPotential < effectiveSpeed){
            this._updatePosition()
         }
         
         //check for kill but only if enemy knows player is there
         if(movementPotential && this._alerted){
            var canKill = this._canKill()
            if(canKill){
               Crafty.trigger("Kill", canKill)
            }
         }
      },
      _updatePosition:function(){
         Constants.ENEMY_POSITIONS[this[0]] = this.getPosition()
      },
      _canKill: function(){
         var motherPos = Constants.HERO.getPosition()
         var boyPos = Constants.BOY.getPosition()
         var ourPos = this.getPosition()

         if(Math.abs(ourPos.x-boyPos.x) <= 1 && Math.abs(ourPos.y-boyPos.y) <=1){
            return "boy"
         }else if(Math.abs(ourPos.x - motherPos.x) <= 1 && Math.abs(ourPos.y-motherPos.y) <=1){
            return "mother"
         }
         return null
      },
      _checkSenseAlt: function(x,y,r,visibility){
         var heroPos = Constants.HERO.getPosition()
         var boyPos = Constants.BOY.getPosition()
         if(visibility > 0){
            if(heroPos.x === x && heroPos.y === y){
               this._alerted = true
               this._lastKnownMotherPos = heroPos
            }else if(boyPos.x === x && boyPos.y === y){
               this._alerted = true
               this._lastKnownBoyPos = boyPos
            }
         }
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
      },
      takeDagger: function(){
         this.setPosition({x:-101, y:-101})
         this._updatePosition()
         this.visible = false
         this.unbind('Turn', this._takeTurn)
      }
   })

   Constants.FOV = new ROT.FOV.PreciseShadowcasting(Constants.FUNCTIONS.lightPasses)
   Constants.FOH = new ROT.FOV.PreciseShadowcasting(Constants.FUNCTIONS.soundPasses)
}
