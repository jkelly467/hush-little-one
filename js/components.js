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
         _dead: false,
         _child: null,
         _items: {},
         init: function() {
            this.requires('CustomControls, Keyboard, Controllable, OnMap')
         },
         _killed: function(victim){
            if(victim === 'mother'){
               this.removeComponent("mother").addComponent("motherdead") 
               this.setPosition({x:-51,y:-51})
               this._dead = true
               Constants.DEATHINTERVAL = setInterval(function(){
                  Crafty.trigger("Turn", {moved:false})
               },1000)
            }/*else if(victim === "boy"){
               console.log("my son is dead")
            }*/
         },
         mother: function() {
            this.customControls()
            return this.bind("Kill", this._killed)
         },
         setChild: function(child){
            this._child = child
         },
         getChild: function(){
            return this._child
         },
         _acquireItem: function(){
            var pos = this.getPosition()
            var item = Constants.FUNCTIONS.objInPath(Constants.ITEM_POSITIONS, pos.x, pos.y)
         
            if(item){
               this._getItem(item)
            }
         },
         _getItem: function(itemId){
            itemId = Number(itemId)
            //class name in item-ui
            var itemName = Crafty(itemId).getName().replace(/\s/g, "").toLowerCase()
            if(!this._items[itemName]){
               this._items[itemName] = []
            }
            this._items[itemName].push(itemId)
            H.Global.incrementItemUi(itemName)
            Crafty(itemId).removeFromBoard()
         },
         useItem: function(itemName){
            if(this._items[itemName] && this._items[itemName].length){
               Crafty(this._items[itemName].pop()).use(this, this.getChild())
               H.Global.decrementItemUi(itemName)
            }
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
         checkMovement: function(x,y,isPlayer){
            var motherPos = Constants.HERO.getPosition()
            var boyPos = Constants.BOY.getPosition()
            if(Constants.FUNCTIONS.objInPath(Constants.ENEMY_POSITIONS, x, y)) return false
            if(((motherPos.x === x && motherPos.y === y) ||
               (boyPos.x === x && boyPos.y ===y))) 
            {
               if(isPlayer){
                  return "swap"
               }else{
                  return false
               }
            }
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
            var x, y, checkX, checkY, check
            var position = this.getPosition()
            x = checkX = position.x
            y = checkY = position.y
            switch(director.toUpperCase()){
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
            var check = this.checkMovement(checkX, checkY, isPlayer)
            if(typeof check === 'string' && check === 'swap'){
               this.getChild().moveTo(position.x, position.y, false)
            }
            if(check){
               this.moveTo(checkX, checkY, isPlayer) 
               return true
            }else{
               return false
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
      H.addItems()
      // if(debug){
      //    H.addDebugTools()
      // }
   },
   generateSprites: function(){
      Crafty.sprite(32, assetify('tiles.png'),{
         'enemy':[0,6],
         'passagestone':[0,5],
         'oilofvanishing':[0,4]
      })
      Crafty.sprite(32, assetify('Woman.png'),{
         'mother':[0,0]
      })
      Crafty.sprite(32, assetify('Womandead.png'),{
         'motherdead':[0,0]
      })
      Crafty.sprite(32, assetify('Child.png'),{
         'boy':[0,0]
      })
      Crafty.sprite(32, assetify('Childdead.png'),{
         'boydead':[0,0]
      })
      Crafty.sprite(32, assetify('Stonewall.png'),{
         'wall':[0,0]
      })
      Crafty.sprite(32, assetify('Ground.png'),{
         'road':[0,0]
      })
      Crafty.sprite(32, assetify('Pond.png'),{
         'water':[0,0]
      })
      Crafty.sprite(32, assetify('Shortgrass.png'),{
         'grass':[0,0]
      })
   }
}
