if(!H){
   H = {}
}

H.Components = {
   heroComponents: ['2D', 
      'DOM', 
      'mother',
      'OnMap',
      'Mother', 
      'ViewportFollow'],
   generateComponents: function(debug){
      H.Controls()
      H.Child()

      Crafty.c("Mother", {
         _child: null,
         init: function() {
            this.requires('CustomControls, Keyboard, Controllable')
         },
         mother: function() {
            this.customControls()
            return this
         },
         setChild: function(child){
            this._child = child
         },
         getChild: function(){
            return this._child
         }
      })

      Crafty.c("OnMap", {
         _currentPosition: {x:0,y:0},
         onMap: function(position){
            this._currentPosition = position
            return this
         },
         getPosition: function(){
            return this._currentPosition
         },
         setPosition: function(position){
            this._currentPosition = position
            return this
         },
         getTileOnMap: function(x,y){
            return Constants.MAP[x][y]
         }
      })

      Crafty.c("Moves", {
         init: function(){
            this.requires("OnMap")
         },
         moves: function(){
            return this
         },
         checkMovement: function(x,y){
            if(Constants.MAP[x] && Constants.MAP[x][y]){
               switch(Constants.MAP[x][y]){
                  case 0:
                  case 3:
                     return false
                  default:
                     return true
               }
            }else{
               return false
            }
         },
         moveTo: function(newX,newY,isPlayer){
            var from = {x:this._x, y:this._y}
            this.x = newX*32
            this.y = newY*32
            this.setPosition({
               x: newX,
               y: newY
            })
            if(isPlayer){
               Crafty.trigger("Moved", from)
               Crafty.trigger("Turn", {moved: true})
            }
            return this 
         },
         nextMove: function(director, isPlayer){
            var move, x, y, checkX, checkY, check
            var position = this.getPosition()
            x = checkX = position.x
            y = checkY = position.y
            if(typeof director === 'function'){
               //call director to see where to go next
               move = director()
            }else{
               //otherwise director is a direction string
               move = director
            }
            switch(move.toUpperCase()){
               case "N":
                  checkY--
               break
               case "NE":
                  checkX++
                  checkY--
               break
               case "E":
                  checkX++
               break
               case "SE":
                  checkX++
                  checkY++
               break
               case "S":
                  checkY++
               break
               case "SW":
                  checkX--
                  checkY++
               break
               case "W":
                  checkX--
               break
               case "NW":
                  checkX--
                  checkY--
               break
            }
            if(this.checkMovement(checkX, checkY)){
               this.moveTo(checkX, checkY, isPlayer) 
            }
         }
      })

      Crafty.c("Dangerous", {
         _damage: 1,
         "dangerous": function(baseDamage){
            if(baseDamage){
               this._damage = baseDamage
            }
            return this
         },
         "setDamage": function(newDamage){
            this._damage = newDamage
         },
         "getDamage": function(){
            return this._damage
         }
      })

      H.addEnemies()
      // if(debug){
      //    H.addDebugTools()
      // }
   },
   generateSprites: function(){
      Crafty.sprite(32, assetify('tiles.png'),{
         'grass': [0,0],
         'wall':[0,1],
         'road':[0,2],
         'water':[0,3],
         'mother':[0,4],
         'boy':[0,5],
         'enemy':[0,6]
      })
   }
}
