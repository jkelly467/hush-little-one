if(!H){
   H = {}
}

H.Child = function(){
   Crafty.c("Child", {
      _speed: 1,
      _sight: 5,
      _mother: null,
      _canSeeMother: true,
      _waiting: false,
      _panic: 0,
      _basePanic: 1,
      _panicThreshold: 80,
      _panicCounter: 0,
      _panicType: null,
      _panicking: false,
      _path: [],
      _dead: false,
      _deathCooldown: 5,
      _panicSpeech: [
         'MOMMY!!?',
         'WHERE ARE YOU?',
         "I'M SCARED, MOMMY!",
         "I DON'T SEE YOU!"
      ],
      _takeTurn: function(e){
         if(this._dead){
            if(this._deathCooldown){
               this._deathCooldown--
            }else{
               this.setPosition({x:-50,y:-50})
            }
            return
         }
         this.clearSpeech()
         var pos = this.getPosition()
         var panicked = false

         this._canSeeMother = false
         Constants.FOV.compute(pos.x, pos.y, this._sight, this._checkSense.bind(this)) 
         if(!this._panicking){
            if(!this._canSeeMother){
               this._incrementPanic()
               panicked = true
            }
            if(!this._waiting && e.moved){
               this._path = []
               var motherPos = this._mother.getPosition()
               var astar = new ROT.Path.AStar(motherPos.x, motherPos.y, Constants.FUNCTIONS.walkThrough)
               astar.compute(pos.x, pos.y, this._pathing.bind(this))
               for(var i = 1; i < this._speed+1; i++){
                  var coord = this._path[i]
                  if(coord && (coord.x !== motherPos.x || coord.y !== motherPos.y)){
                     this.nextMove(this._getDirFromCoords(this._path[i]),false)
                  }
               }
            }
         }
         if(e.childMessage && this._canSeeMother){
            switch(e.childMessage){
               case ChildMessage.WAIT:
                  this._waiting = true 
               break
               case ChildMessage.COMFORT:
                  this._decrementPanic()
               break
               case ChildMessage.FOLLOW:
                  this._waiting = false
               break
            }
         }
         
         if(this._panicking){
            this._actPanic()
         }
         if(!panicked && this._panic > 0){
            this._decrementPanic()
         }
      },
      _incrementPanic: function(){
         if(this._panicCounter+this._basePanic+ROT.RNG.getRandom(2) > 5){
            this._panicCounter = 0
            this._basePanic++
         }else{
            this._panicCounter++
         }
         this._panic += this._basePanic+ROT.RNG.getRandom(3)
         if(this._panic > this._panicThreshold){
            this._panicking = true
         }
      },
      _decrementPanic: function(){
         this._panicCounter = 0;
         this._basePanic = Math.max(this._basePanic-1, 1)
         this._panic -= (Math.max(5-this._basePanic, 1) + 1 + ROT.RNG.getRandom(2))
         if(this._panic <= 0){
            this._panic = 0
            this._panicking = false
            this._panicType = null
         }
      },
      _actPanic: function(){
         if(!this._panicType){
            this._panicType = ROT.RNG.getRandom(2,1)
         }
         switch(this._panicType){
            case 1:
               this.nextMove(Constants.FUNCTIONS.randomDir(), false)
            break
            case 2:
               //generate noise which will alert all enemies within a radius
               this._generateNoise(10)
            break
         }
         this.speak(this._panicSpeech[ROT.RNG.getRandom(3)])
      },
      _generateNoise: function(radius){
         var enemies = Crafty("Enemy")
         var enemy
         for(var i = 0; i < enemies.length; i++){
            Crafty(enemies[i]).generatedNoiseCheck(radius)
         }
      },
      _checkSense: function(x,y,r,v){
         var motherPos = this._mother.getPosition()
         if(motherPos.x === x && motherPos.y ===y && v > 0){
            this._canSeeMother = true
         }
      },
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
      _pathing: function(x,y){
         this._path.push({x:x, y:y})
      },
      _killed: function(victim){
         if(victim === 'boy'){
            this._dead = true
            this.removeComponent("boy").addComponent("boydead")
         }
      },
      child: function(mother){
         this._mother = mother
         this._mother.setChild(this)

         return this.bind("Turn", this._takeTurn)
                  .bind("Kill", this._killed)
      }
   })
}
