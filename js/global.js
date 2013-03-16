if (!H){
   H = {}
}

// String.prototype.width = function(){
//    var o = $('<div>'+this+'</div>')
//             .css({'position':'absolute','float':'left','white-space':'nowrap', 'visibility':'hidden', 'font':'Gabriela 10px'})
//             .appendTo($('body'))
//    var w = o.width()
//    o.remove()
// 
//    return w
// }

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
         if(reset){
            clearInterval(Constants.DEATHINTERVAL)
            H.Global.clearItemUi()
            Crafty.scene("field")
         }else{
            Constants.HERO.removeComponent('ViewportFollow')
            Crafty.scene(Constants.NEXT_SCENE)
         }
      }
   }
}()
