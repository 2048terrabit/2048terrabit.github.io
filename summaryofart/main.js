window.onload = function () {

    var canvas = document.getElementById("canvas");
    //canvas.style.webkitFilter = "blur(1px)";
    var ctx = canvas.getContext("2d");
    ctx.canvas.width  = 250;
    ctx.canvas.height = 250;

    function DrawImageFromURL(url)
    {
        image = new Image();
        image.src = url;

        image.onload = function ()
        {
            ctx.drawImage(image,0,0);
        } 
    }

    DrawImageFromURL("http://upload.wikimedia.org/wikipedia/commons/c/c3/Aurora_as_seen_by_IMAGE.PNG");
    DrawImageFromURL("http://nuclearpixel.com/content/icons/2010-02-09_stellar_icons_from_space_from_2005/earth_128.png");

}