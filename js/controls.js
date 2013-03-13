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
               this.nextMove("N")
            break
            case Crafty.keys['L']:
            case Crafty.keys['RIGHT_ARROW']:
               this.nextMove("E")
            break
            case Crafty.keys['H']:
            case Crafty.keys['LEFT_ARROW']:
               this.nextMove("W")
            break
            case Crafty.keys['J']:
            case Crafty.keys['DOWN_ARROW']:
               this.nextMove("S")
            break
            case Crafty.keys['Y']:
               this.nextMove("NW")
            break
            case Crafty.keys['U']:
               this.nextMove("NE")
            break
            case Crafty.keys['B']:
               this.nextMove("SW")
            break
            case Crafty.keys['N']:
               this.nextMove("SE")
            break
         }
      },
      customControls: function () {
         return this.requires("Moves").bind("KeyDown", this._keydown)
      }
   })
}
