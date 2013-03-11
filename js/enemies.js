if(!H){
   H = {}
}

H.addEnemies = function(){
   Crafty.c("Enemy", {
      _deathCounter: 0,
      _deathFlickerPoint: 18,
      _deathTimer: 60,
      _dying: false,
      _health: 1,
      _invinCounter: 0,
      _invinTimer: 30,
      _gift: 30,
      "_dyingAnim": function(){
         if(this._deathCounter % this._deathFlickerPoint === 0){
            this._deathFlickerPoint = this._deathFlickerPoint-2
            this.visible = !this.visible
         }
         if(this._deathCounter === this._deathTimer){
            this.destroy()
         }else{
            this._deathCounter++
         }
      },
      "_invincibleFrames": function(){
         if(this._invinCounter === this._invinTimer){
            this._invincible = false
            this.unbind("EnterFrame", this._invincibleFrames)
         }else{
            this._invinCounter++
         }
      },
      "isInFrame": function(){
         var edge = this.edgeOfScreen()
         if((this._x < edge.left - 64) || (this._x > edge.right + 64)){
            H.Global.overseer.decrementEnemies()
            this.destroy()
         }
      },
      "isHit": function(){
         return this._dying || this._invincible
      },
      "isDying": function(){
         return this._dying
      },
      "edgeOfScreen": function(){
         var left = -Crafty.viewport.x
         return {
            left: left,
            right: left + Constants.VP_WIDTH
         }
      },
      "enemy": function(health){
         if(typeof health === 'number'){
            this._health = health
         }
         return this.onHit("Heroic", function(colliders){
            var collider = colliders[0].obj
            if(this._invincible || !collider.getHeroism()){
               return
            }
            this._health -= collider.getHeroicPower()
            if(this._health <= 0){
               this._invincible = true
               this._dying = true
            }else{
               this._invinCounter = 0
               this._invincible = true
               this.bind("EnterFrame", this._invincibleFrames)
            }
            if(this._dying){
               this.bind("EnterFrame", this._dyingAnim)
               H.Global.overseer.decrementEnemies()
               collider.giftHealth(this._gift)
               this._dying = true
            }
         }).bind("EnterFrame", this.isInFrame)
      }
   })

   Crafty.c("MannyAI", {
      _walkCounter: 0,
      _extreme: 32,
      _increment: -1,
      _speed: 3,
      _kickstart: false,
      _baseGift: 10,
      "randomize": function(){
         this._speed = Math.floor(Math.random() * 5) + 1 //random speed between 1 and 5
         this._gift = this._baseGift * this._speed
         return this.attr({
            x: this.edgeOfScreen().right,
            y: Constants.MAP_HEIGHT-32,
            z: 1
         })
      },
      "mannyAI": function(speed){
         if(typeof speed === 'number'){
            this._speed = speed
         }
         this.requires("SpriteAnimation, Collision, Grid")
         .animate("walk", 0,0,5)
         .bind("EnterFrame", function(){
            if(this.isHit()){
               if(this.isPlaying("walk")){
                  this._kickstart = true
                  this.stop()
               }
               return
            }else if(this._kickstart){
               this.animate("walk", 16, -1)
               this._kickstart = false
            }
            if(this._walkCounter === this._extreme){
               this._increment = -1
               this.unflip("X")
            }else if(this._walkCounter === -this._extreme){
               this._increment = 1
               this.flip("X")
            }
            this._walkCounter += this._increment
            this.x += (this._increment * this._speed)
         })
         this.stop().animate("walk", 16, -1)
         return this
      }
   })

   Crafty.c("WalkyAI", {
      _increment: -1,
      _speed: 3,
      _kickstart: false,
      _baseGift: 5,
      "randomize": function(){
         this._speed = Math.floor(Math.random() * 5) + 1 //random speed between 1 and 5
         this._gift = this._baseGift * this._speed
         this.attr({
            x: this.edgeOfScreen().right,
            y: Constants.MAP_HEIGHT-32,
            z: 1
         })
      },
      "walkyAI": function(speed){
         if(typeof speed === 'number'){
            this._speed = speed
         }
         this.requires("SpriteAnimation, Collision, Grid")
         .animate("walk", 0,0,1)
         .bind("EnterFrame", function(){
            if(this.isHit()){
               if(this.isPlaying("walk")){
                  this._kickstart = true
                  this.stop()
               }
               return
            }else if(this._kickstart){
               this.animate("walk", 8, -1)
               this._kickstart = false
            }
            this.x -= this._speed
         })
         this.stop().animate("walk", 8, -1)
         return this
      }
   })

   Crafty.c("FlappyAI", {
      _increment: -1,
      _speed: {
         horz: 2,
         vert: 2
      },
      _flyCounter: 0,
      _flyExtremes: {
         up: 24,
         down: 32
      },
      _kickstart: false,
      _baseGift: 7,
      "randomize": function(){
         var xSpeed = Math.floor(Math.random() * 5) + 1 //random speed between 1 and 5
         var ySpeed = Math.floor(Math.random() * 5) + 1 //random speed between 1 and 5
         var yOffset = Math.floor(Math.random() * ((Constants.MAP_HEIGHT-32) - 150)) + 150
         this._gift = this._baseGift * (xSpeed + ySpeed)
         this._speed = {
            horz: xSpeed,
            vert: ySpeed
         }
         this.attr({
            x: this.edgeOfScreen().right,
            y: Constants.MAP_HEIGHT-yOffset,
            z: 1
         })
      },
      "doFrame": function(){
         var vert = this._speed.vert;
         var limit;
         if(vert >= 0){
            //flying down
            limit = this._flyExtremes.down;
         }else{
            limit = this._flyExtremes.up;
         }

         if(this._flyCounter === limit){
            this._speed.vert = -vert;
            this._flyCounter = 0;
         }

         this.x -= this._speed.horz;
         this.y += vert;
         this._flyCounter++;
      },
      "flappyAI": function(speed, extremes){
         if(typeof speed === 'number'){
            this._speed = {
               horz: speed,
               vert: speed
            }
         }else if(typeof speed === 'object'){
            this._speed = speed;
         }
         
         if(typeof extremes === 'number'){
            this._flyExtremes = {
               up: extremes,
               down: extremes
            }
         }else if(typeof extremes === 'object'){
            this._flyExtremes = extremes
         }

         this.requires("SpriteAnimation, Collision, Grid")
         .animate("walk", 0,0,5)
         .bind("EnterFrame", function(){
            if(this.isHit()){
               if(this.isPlaying("walk")){
                  this._kickstart = true
                  this.stop()
               }
               return
            }else if(this._kickstart){
               this.animate("walk", 16, -1)
               this._kickstart = false
            }
            this.doFrame()
         })
         this.stop().animate("walk", 16, -1)
         return this
      }
   })
}
