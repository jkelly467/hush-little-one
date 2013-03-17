if (!H){
   H = {}
}

H.Global = function(){

   $(document).on('click','.item', function(){
      Constants.HERO.useItem(this.classList[1])
   })

   function modifyItemUi(itemName, offset){
      var el = $('.'+itemName).find('span')
      var amount = el.text()
      amount = Number(amount.replace("x",""))+offset
      el.text('x'+amount) 
   }

   return {
      incrementItemUi: function(itemName){
         modifyItemUi(itemName, 1)
      },
      decrementItemUi: function(itemName){
         modifyItemUi(itemName, -1)
      },
      clearItemUi: function(){
         $('.item:not(.header)').each(function(){
            $(this).find('span').text("x0")
         })
      },
      changeScene: function(reset){
         Constants.ENEMY_POSITIONS = {}
         Constants.ITEM_POSITIONS = {}
         $(Crafty.audio.sounds[Constants.CURRENT_SCENE+"Music"].obj).animate({volume:0},1000, 'swing', function(){
            Crafty.audio.stop(Constants.CURRENT_SCENE+"Music")
            Constants.HERO.removeComponent('ViewportFollow')
            if(reset){
               clearInterval(Constants.DEATHINTERVAL)
               H.Global.clearItemUi()
               Crafty.scene("field")
            }else{
               Crafty.scene(Constants.NEXT_SCENE)
            }
         })
      }
   }
}()
