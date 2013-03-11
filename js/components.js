if(!H){
   H = {}
}

H.Components = {
   heroComponents: ['2D', 
      'DOM', 
      'mother', 
      'OnMap',
      'Controls', 
      'ViewportFollow'],
   generateComponents: function(debug){
      H.Controls()

      Crafty.c("Controls", {
         init: function() {
            this.requires('CustomControls, Keyboard, Controllable')
         },
         controls: function() {
            this.customControls()
            return this
         }
      })

      Crafty.c("OnMap", {
         _currentPosition: {x:0,y:0},
         onMap: function(position){
            this._currentPosition = position
         },
         getPosition: function(){
            return this._currentPosition
         },
         setPosition: function(position){
            this._currentPosition = position
            return this
         }
      })

      Crafty.c("Moves", {
         _speed: 1,
         init: function(){
            this.requires("OnMap")
         },
         moves: function(speed){
            this._speed = speed || 1
         },
         checkMovement: function(x,y){
            if(Constants.MAP[x] && Constants.MAP[x][y]){
               switch(Constants.MAP[x][y]){
                  case 0:
                  case 3:
                     return null
                     break
               }
            }else{
               return null 
            }
         },
         nextMove: function(director){
            var move, x, y, check
            var position = this.getPosition()
            x = position.x
            y = position.y
            if(typeof director === 'function'){
               //call director to see where to go next
            }else{
               //otherwise director is a direction string
               move = director
            }
            switch(move.toUpperCase()){
               case "N":
                  check = this.checkMovement(x, y-1) 
               break
               case "NE":
                  check = this.checkMovement(x+1, y-1)
               break
               case "E":
                  check = this.checkMovement(x+1, y)
               break
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

      // H.addEnemies()
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
