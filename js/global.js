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
      }
   }
}()
