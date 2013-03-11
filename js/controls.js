if(!H){
   H = {}
}

H.Controls = function(){
   Crafty.c("CustomControls", {
      _speed: 1,

      _up: false,
      _attacking: false,
      _atkLock: false,

      _keyup: function (e) {
         if (this._keys[e.key]) {
            this._movement.x = Math.round((this._movement.x - this._keys[e.key].x) * 1000) / 1000
            this._movement.y = Math.round((this._movement.y - this._keys[e.key].y) * 1000) / 1000
            this.trigger('NewDirection', this._movement)
         }
      },

      // _enterframe: function () {

      //    if(this.isDown("UP_ARROW")){
      //       this._up = true
      //    }
      //    if(this.isDown("SPACE")){
      //       if(!this._atkLock){
      //          this._attacking = true
      //          this._atkLock = true
      //       }              
      //    }else{
      //       this._atkLock = false
      //    }

      //    if (this._movement.x !== 0) {
      //       this.x += this._movement.x
      //       this.trigger('Moved', { x: this.x - this._movement.x, y: this.y })
      //    }
      //    if (this._movement.y !== 0) {
      //       this.y += this._movement.y
      //       this.trigger('Moved', { x: this.x, y: this.y - this._movement.y })
      //    }
      // },
      directionKeysDown: function(){
         var result = ""
         for (var k in this._keyDirection){
            if(Crafty.keydown[Crafty.keys[k]]){
               return k
            }
         }
         return result
      },
      customControls: function (speed, keys) {
         this._keyDirection = {}
         this._keys = {}
         this._movement = { x: 0, y: 0 }
         this._speed = { x: 3, y: 3 }

         if (keys) {
            if (speed.x && speed.y) {
               this._speed.x = speed.x
               this._speed.y = speed.y
            } else {
               this._speed.x = speed
               this._speed.y = speed
            }
         } else {
            keys = speed
         }

         this._keyDirection = keys
         this.speed(this._speed)

         this.bind("KeyUp", this._keyup)
         // .bind("EnterFrame", this._enterframe)

         return this
      },

      speed: function (speed) {
         for (var k in this._keyDirection) {
            var keyCode = Crafty.keys[k] || k
            this._keys[keyCode] = {
               x: Math.round(Math.cos(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.x) / 1000,
               y: Math.round(Math.sin(this._keyDirection[k] * (Math.PI / 180)) * 1000 * speed.y) / 1000
            }
         }
         return this
      }
   })
}
