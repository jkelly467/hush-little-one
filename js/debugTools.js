if(!H){
   H = {}
}

H.addDebugTools = function(){
   Crafty.c("DebugTools", {
      "init": function(){
         this._pointerDisplay = Crafty.e("2D, DOM, Text").attr({
            w:600,
            h:20,
            x:100,
            y:0
         }).bind("ViewportMoved", function(moveData){
            this.x -= moveData.x
            this.y -= moveData.y
         })
      },
      "debug": function(){
         return this.requires("Mouse").bind("MouseMove", function(mouseData){
            this._pointerDisplay.text("X: "+mouseData.realX+" Y: "+ mouseData.realY)
         })
      }
   })
}
