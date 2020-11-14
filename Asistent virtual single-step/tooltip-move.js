
    var nextMax =4;
    var next = 1;
    var counterMax = 4;
    var counter = 1;
    function switchTooltip()
    {
        var tS= document.getElementById("tooltip-start");tS.style.display="none";
            ts=document.getElementById("tooltip");ts.style.display="block";
    }
    function start()
    {
        if(counter <= counterMax)
        {
            var firstP= document.getElementById("count-"+counter);
            firstP.style.display="none";
            counter++;
            if(counter <= counterMax)
             {   var nextP = document.getElementById("count-"+counter);
                nextP.style.display="block";}
            else
            {
                switchTooltip()
            } 

        }else
        {
            switchTooltip()
        }
    }

    function jswitchTooltip()
    {
        $("#tooltip-start").hide("fadeOut");
        $("#tooltip").show("fadeIn");
        $("#tooltip-next").show("fadeIn")
           
    }
    function jstart()
    {
        if(counter <= counterMax)
        {
           $("#count-"+counter).hide("fadeOut");
            
            counter++;
            if(counter <= counterMax)
             {  $("#count-"+counter).show();
        }  
            else
            {
                jswitchTooltip()
            } 

        }else
        {
            jswitchTooltip()
        }
    }

    $(document).ready(function(){

        $('#tooltip').hover(
  function () {
    $("#alte-detalii").show("fadeIn");
  }, 
  function () {
    $("#alte-detalii").hide("fadeOut");
  }
);

$(".next-btn").on("click", function(){
    $("#next-"+next).hide("fadeOut");
    next++;
    $("#next-"+next).show();
});
$(".prev-btn").on("click", function(){
    $("#next-"+next).hide();
    next--;
    $("#next-"+next).show();
});
$(".hide-btn").on("click", function(){
    $("#next-"+next).hide();
    next=1;
    $("#tooltip-next").hide("fadeOut");
})
      var init=  setInterval(function(){
        jstart();
        if(counter > counterMax)
        clearInterval(init);
    },3000);
});
    
    