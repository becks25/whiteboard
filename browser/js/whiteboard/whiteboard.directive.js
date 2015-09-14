app.directive('colorSelect', function () {

    return {
        restrict: 'E',
        template: '<div></div>',
        link: function(scope, elem, attr){
          attr.$set('style', 'background-color: '+attr.id);
          // console.log(elem.text(attr.id));
          elem.addClass('marker');

          elem.on('click', function(){
            document.querySelector('.selected').classList.remove('selected');
            this.classList.add('selected');
            $('.ui-widget-header').css('background-color', this.id);
            $('.ui-state-default').css('background-color', this.id);
            $('#square').css('border-color', this.id);
            $('#diagonal').css('border-bottom-color', this.id);
            $('#circle').css('border-color', this.id);

          });
        }
    };

});

app.directive('slider', function(Whiteboard){

  return{
    restrict: 'E',
    template:'<div id="slider"></div>',
    link: function(scope, elem, attr){

      $( "#slider" ).slider({
        range: "min",
        value: 5,
        min: 1,
        max: 10,
        slide: function( event, ui ) {
         Whiteboard.width = ui.value;
        }
      });


    }
  }
});

app.directive('line', function(){
  return{
    restrict: 'E',
    template: '<div id="line"><div id="diagonal"></div></div>',
    link: function(scope, elem, attr){
      elem.on('click', function(){
        document.querySelector('.selectedShape').classList.remove('selectedShape');
        this.classList.add('selectedShape');
      });
    }
  }
});

app.directive('square', function(Whiteboard){

  return{
    restrict: 'E',
    template:'<div id="square"></div>',
    link: function(scope, elem, attr){
      elem.on('click', function(){
        document.querySelector('.selectedShape').classList.remove('selectedShape');
        this.classList.add('selectedShape');
      });


    }
  }
});

app.directive('circle', function(Whiteboard){

  return{
    restrict: 'E',
    template:'<div id="circle"></div>',
    link: function(scope, elem, attr){
      elem.on('click', function(){
        document.querySelector('.selectedShape').classList.remove('selectedShape');
        this.classList.add('selectedShape');
      });

    }
  }
});


