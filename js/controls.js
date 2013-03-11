if(!H){
   H = {}
}

H.Controls = function(){
   Crafty.c("CustomControls", {
      _speed: 1,
      _keyup: function (e) {
         switch(e.key){
            case Crafty.keys['UP_ARROW']:

         }
      },
      customControls: function () {
         this.bind("KeyUp", this._keyup)

         return this
      }
   })
}
