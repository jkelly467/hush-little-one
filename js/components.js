if(!H){
   H = {}
}

H.Components = {
   heroComponents: ['2D', 
      'DOM', 
      'mother',
      'OnMap',
      'Mother', 
      'Speaks',
      'Persist'],
   generateComponents: function(){
      H.Controls()
      H.Child()

      Crafty.c("Mother", {
         _dead: false,
         _child: null,
         _items: {},
         _choosingAction: false,
         _invisible: false,
         _unheard: false,
         _moveDeactivate: false,
         _invisCounter: 0,
         _silenceCounter: 0,
         _swift: true,
         _swiftCounter: 0,
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
            }else if(victim === "boy" && !this._dead){
               this.speak("NOOOOOO!!!!")
            }
         },
         mother: function() {
            this.customControls()
            return this.bind("Kill", this._killed)
                     .bind("ItemUsed", this._itemEffects)
                     .bind("Turn", this._turnUpdate)
         },
         setChild: function(child){
            this._child = child
         },
         getChild: function(){
            return this._child
         },
         getInvisible: function(){
            return this._invisible
         },
         getUnheard: function(){
            return this._unheard
         },
         getSwift: function(){
            return this._swift
         },
         _turnUpdate: function(e){
            if(this.getPosition().x === Constants.GOAL.x &&
               this.getPosition().y === Constants.GOAL.y)
            {
               H.Global.changeScene()
            }
            this.clearSpeech()
            this._choosingAction = false
            if(this._invisCounter < 0) this._invisCounter = 0
            if(this._silenceCounter < 0) this._silenceCounter = 0
            if(this._swiftCounter < 0) this._swiftCounter = 0

            if(this._invisCounter){
               this._invisCounter--   
            }else if(this._invisible){
               if((this._moveDeactivate && e.moved) || !this._moveDeactivate){
                  this._endInvis()
               }
            }

            if(this._silenceCounter){
               this._silenceCounter--   
            }else if(this._unheard){
               if((this._moveDeactivate && e.moved) || !this._moveDeactivate){
                  this._endSilence()
               }
            }

            if(this._swiftCounter){
               this._swiftCounter--   
            }else if(this._swift){
               this._endSwift()
            }
         },
         _startInvis: function(){
            this._invisible = true
            this.css("opacity", "0.5")
            if(!this.getChild()._dead){
               this.getChild().css("opacity", "0.5")
            }
         },
         _endInvis: function(){
            this._invisible = false
            this._moveDeactivate = false
            this.css("opacity", "1")
            if(this.getChild()){
               this.getChild().css("opacity", "1")
            }
         },
         _startSilence: function(){
            this._unheard = true
            this.css("border", "solid 1px #FF30FF")
            if(!this.getChild()._dead){
               this.getChild().css("border", "solid 1px #FF30FF")
            }
         },
         _endSilence: function(){
            this._unheard = false
            this._moveDeactivate = false
            this.css("border", "none")
            if(this.getChild()){
               this.getChild().css("border", "none")
            }
         },
         _startSwift: function(){
            this._swift = true
            this.speak("Let us run, little one.")
         },
         _endSwift: function(){
            this._swift = false
            this.speak("We must be cautious now.")
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
         _itemEffects: function(e){
            if(e.invisible){
               this._startInvis()
               if(e.turns){
                  this._invisCounter += e.turns
               }
            }else if(e.unheard){
               this._startSilence()
               if(e.turns){
                  this._silenceCounter += e.turns
               }
            }else if(e.swift){
               this._startSwift()
               this._swiftCounter += e.turns
            }
            if(e.moveTrigger){
               this._moveDeactivate = true
            }
         },
         useItem: function(itemName){
            if(this._items[itemName] && this._items[itemName].length){
               var item = Crafty(this._items[itemName].pop())
               var used = item.use(this, this.getChild())
               item.removeComponent("Persist") //no longer in inventory, so it can be destroyed on scene change
               if(used) H.Global.decrementItemUi(itemName)
            }
         }
      })

      Crafty.c("Speaks", {
         _textBox: null,
         init: function(){
            this.requires("OnMap")
            this._textBox = Crafty.e("2D, DOM, Text, Persist")
         },
         speak: function(words){
            var numlines = words.split("\n").length
            this._textBox.attr({
               x: this._x,
               y: this._y-(numlines*20),
               z: 10
            }).text(words) 
            .textFont({size: '10px', weight: 'bold'})
            .textColor('#DDDDDD')
            .css({
               'background-color': '#444',
               'white-space': 'pre'
            })
         },
         clearSpeech: function(){
            this._textBox.text('')
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
               var multiplier = 1
               var oldPos = this.getPosition()
               var hindered = Constants.MAP[oldPos.x][oldPos.y]===4
               var swift = this.getSwift()
              
               if(swift && !hindered){
                  multiplier = 0.5
               }else if(hindered && !swift){
                  multiplier = 2
               }

               Crafty.trigger("Moved", from)
               Crafty.trigger("Turn", {moved: true, multiplier: multiplier})
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
   },
   generateAudio: function(){
     Crafty.audio.add({
        fieldMusic:['audio/Ruhefeld.ogg','audio/Ruhefeld.mp3'],
        forestMusic:['audio/Greyewood.ogg','audio/Greyewood.mp3'],
        mountainMusic:['audio/Eldermountain.ogg','audio/Eldermountain.mp3'] 
     })
   },
   generateSprites: function(){
      Crafty.sprite(32, assetify('bellofunsounding.png'),{
         'bellofunsounding':[0,0]
      })
      Crafty.sprite(32, assetify('holydagger.png'),{
         'holydagger':[0,0]
      })
      Crafty.sprite(32, assetify('divineswiftness.png'),{
         'divineswiftness':[0,0]
      })
      Crafty.sprite(32, assetify('maskofstillness.png'),{
         'maskofstillness':[0,0]
      })
      Crafty.sprite(32, assetify('oilofvanishment.png'),{
         'oilofvanishing':[0,0]
      })
      Crafty.sprite(32, assetify('shroudofconcealment.png'),{
         'shroudofshadows':[0,0]
      })
      Crafty.sprite(32, assetify('warpstone.png'),{
         'passagestone':[0,0]
      })
      Crafty.sprite(32, assetify('Soldier.png'),{
         'soldier':[0,0]
      })
      Crafty.sprite(32, assetify('Captain.png'),{
         'captain':[0,0]
      })
      Crafty.sprite(32, assetify('Hellhound.png'),{
         'hellhound':[0,0]
      })
      Crafty.sprite(32, assetify('Imp.png'),{
         'imp':[0,0]
      })
      Crafty.sprite(32, assetify('Devil.png'),{
         'devil':[0,0]
      })
      Crafty.sprite(32, assetify('Golem.png'),{
         'golem':[0,0]
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
         'ground':[0,0]
      })
      Crafty.sprite(32, assetify('Pond.png'),{
         'water':[0,0]
      })
      Crafty.sprite(32, assetify('Shortgrass.png'),{
         'grass':[0,0]
      })
      Crafty.sprite(32, assetify('Tallgrass.png'),{
         'tallgrass':[0,0]
      })
      Crafty.sprite(32, assetify('Forestfloor.png'),{
         'forestfloor':[0,0]
      })
      Crafty.sprite(32, assetify('Tree.png'),{
         'tree':[0,0]
      })
      Crafty.sprite(32, assetify('Underbrush.png'),{
         'underbrush':[0,0]
      })
      Crafty.sprite(32, assetify('Stream.png'),{
         'stream':[0,0]
      })
      Crafty.sprite(32, assetify('Rock.png'),{
         'rock':[0,0]
      })
      Crafty.sprite(32, assetify('Snow.png'),{
         'snow':[0,0]
      })
      Crafty.sprite(32, assetify('Spring.png'),{
         'spring':[0,0]
      })
      Crafty.sprite(64, assetify('Danza.png'),{
         'danza':[0,0]
      })
      Crafty.sprite(64, assetify('Cerberus.png'),{
         'cerberus':[0,0]
      })
      Crafty.sprite(64, assetify('Abomination.png'),{
         'abomination':[0,0]
      })
   }
}
