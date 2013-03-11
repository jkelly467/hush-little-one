if(!H){
   H = {}
}

H.Components = {
   heroComponents: ['2D', 
      'DOM', 
      'mother', 
      'Controls', 
      'ViewportFollow'],
   generateComponents: function(debug){
      H.Controls()

      Crafty.c("Controls", {
         _jump: null,
         init: function() {
            this.requires('CustomControls, Keyboard, Controllable')
         },
         controls: function(speed) {
            this.customControls(speed, {
               RIGHT_ARROW: 0,
               LEFT_ARROW: 180
            })

            if (speed){
               this._speed = speed
            }
            
            this.bind("EnterFrame", function() {
               if(this._up){
                  this.y -= this._jump
                  this._falling = true
               }
            })

            return this
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
