if (!H){
   H = {}
}

H.defineGlobalComponents = function(){
   Crafty.c('GeneratesEnemies', {
      _enemyList: [
         'manny',
         'walky',
         'flappy'
      ],
      _activeEnemies: 0,
      _enemyCap: 15,
      _spitInterval: 1000,
      _spitBlocked: false,
      enemySpitter: function(enemyName){
         var resultEnemy
         switch(enemyName){
            case "manny":
               resultEnemy = Crafty.e('2D,DOM,manny,Enemy,MannyAI,Dangerous,Gravity')
                  .mannyAI()
                  .enemy(1)
                  .dangerous()
                  .gravity("solid")
                  .randomize()
               break
            case "walky":
               resultEnemy = Crafty.e('2D, DOM, walky, Enemy, WalkyAI, Dangerous')
                  .walkyAI(1)
                  .enemy(1)
                  .dangerous()
                  .randomize()
               break
            case "flappy":
               resultEnemy = Crafty.e('2D, DOM, flappy, Enemy, FlappyAI, Dangerous')
                  .flappyAI()
                  .enemy(1)
                  .dangerous()
                  .randomize()
               break
            default:
               console.log("No such enemy defined")
            return resultEnemy
         }
      },
      modifyDifficulty: function(){
         var modifier = H.Global.hero.getHealth()
         var newInterval = 2000 - modifier

         this.setEnemyCap(Math.floor(modifier / 100))
         this.setSpitInterval(newInterval < 100 ? 100 : newInterval)
         console.log("Enemies: " +this._activeEnemies+ "/" + this._enemyCap + ", Spit Interval: " + this._spitInterval)
      },
      spitEnemy: function(){
         if(this._activeEnemies < this._enemyCap && !this._spitBlocked){
            var index = Math.floor(Math.random() * (this._enemyList.length))
            this.enemySpitter(this._enemyList[index])
            this.incrementEnemies()
         }
         this.delay(this.spitEnemy, this.generateNextInterval())
      },
      disableGeneration: function(){
         this._spitBlocked = true;
      },
      enableGeneration: function(){
         this._spitBlocked = false;
      },
      incrementEnemies: function(){
         this._activeEnemies++
         console.log(this._activeEnemies)
      },
      decrementEnemies: function(){
         this._activeEnemies--
         console.log(this._activeEnemies)
      },
      setEnemyCap: function(newCap){
         if(typeof newCap === 'number'){
            this._enemyCap = newCap
         }
      },
      setSpitInterval: function(newInterval){
         if(typeof newInterval === 'number'){
            this._spitInterval = newInterval
         }
      },
      generateNextInterval: function(){
         return this._spitInterval 
      },
      generatesEnemies: function(){
         this.requires('Delay')
           .delay(this.spitEnemy, this.generateNextInterval())  
         this.bind("HealthChanged", this.modifyDifficulty)
         return this
      }
   })
}
