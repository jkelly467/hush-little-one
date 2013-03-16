if(!H){
   H = {}
}

H.Controls = function(){
   Crafty.c("CustomControls", {
      _speed: 1,
      _keydown: function (e) {
         switch(e.key){
            case Crafty.keys['K']:
            case Crafty.keys['UP_ARROW']:
               this.nextMove("N",true)
            break
            case Crafty.keys['L']:
            case Crafty.keys['RIGHT_ARROW']:
               this.nextMove("E",true)
            break
            case Crafty.keys['H']:
            case Crafty.keys['LEFT_ARROW']:
               this.nextMove("W",true)
            break
            case Crafty.keys['J']:
            case Crafty.keys['DOWN_ARROW']:
               this.nextMove("S",true)
            break
            case Crafty.keys['Y']:
               this.nextMove("NW",true)
            break
            case Crafty.keys['U']:
               this.nextMove("NE",true)
            break
            case Crafty.keys['B']:
               this.nextMove("SW",true)
            break
            case Crafty.keys['N']:
               this.nextMove("SE",true)
            break
            case Crafty.keys['PERIOD']:
            case Crafty.keys['S']:
               if(this._choosingAction){
                  Crafty.trigger("Turn", {moved:false, childMessage:ChildMessage.WAIT})
                  this.speak("Stay here, little one")
               }else{
                  Crafty.trigger("Turn", {moved:false})
               }
            break
            case Crafty.keys['T']:
               this._choosingAction = true
               this.speak('What should I say?\ns:Stay\nf:Follow\nc:Comfort')
            break
            case Crafty.keys["ENTER"]:
               if(this._dead){
                  clearInterval(Constants.DEATHINTERVAL)
                  Constants.ENEMY_POSITIONS = {}
                  H.Global.clearItemUi()
                  Crafty.scene("main")
               }    
            break
            case Crafty.keys["G"]:
               this._acquireItem()
            break
            case Crafty.keys["C"]:
               if(this._choosingAction){
                  Crafty.trigger("Turn", {moved:false, childMessage:ChildMessage.COMFORT})
                  this.speak("Hush, little one")
               }
            break
            case Crafty.keys["F"]:
               if(this._choosingAction){
                  Crafty.trigger("Turn", {moved:false, childMessage:ChildMessage.FOLLOW})
                  this.speak("Stay close, little one")
               }
            break
         }
      },
      customControls: function () {
         return this.requires("Moves").bind("KeyDown", this._keydown)
      }
   })
}
