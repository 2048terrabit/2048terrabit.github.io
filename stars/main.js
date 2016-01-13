window.onload = function () {

    var canvas = document.getElementById("canvas");
    //canvas.style.webkitFilter = "blur(1px)";
    var ctx = canvas.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#fff";

    active = true;

    // Classes
    function dot () {
        this.x = 0;
        this.y = 0;
        this.color = "#ff0";
        this.speedx = 0.0;
        this.speedy = 0.0;
      
        this.update = function (ctx) {
            this.x += this.speedx;
            this.y += this.speedy;

            if(this.x > ctx.canvas.width-5)  this.speedx *= -1;
            if(this.x < 0)                                   this.speedx *= -1;
            if(this.y > ctx.canvas.height-5) this.speedy *= -1;
            if(this.y < 0)                                   this.speedy *= -1;

            ctx.fillStyle = this.color;
            ctx.fillRect(this.x,this.y,2,2);
        }
    }



    // Triangle
    function Triangle() {
        this.dots = null;
        this.interval = 10;
        this.dotsCount = 0;
        this.ar = null;

        this.update = function(loop) {
            if(this.dotsCount > 0) {
                if(loop % this.interval == 0) {
                    this.dots = PickRandomUnique( 1, 0, this.dotsCount);
                    //this.dots[0] = parseInt(this.dots[0]);
                    //this.dots[1] = parseInt(this.dots[1]);
                    //this.dots[2] = parseInt(this.dots[2]);
                    this.dots[0] = parseInt(this.dots[0]);
                    var a = CloseAr( this.dots[0], this.ar);
                    this.dots[1] = a[0];
                    this.dots[2] = a[1];
                }

                if( this.dots ) {
                    ctx.beginPath()
                    ctx.moveTo( this.ar[this.dots[0]].x+1, this.ar[this.dots[0]].y+1 );
                    ctx.lineTo( this.ar[this.dots[1]].x+1, this.ar[this.dots[1]].y+1 );
                    ctx.lineTo( this.ar[this.dots[2]].x+1, this.ar[this.dots[2]].y+1 );
                    ctx.lineTo( this.ar[this.dots[0]].x+1, this.ar[this.dots[0]].y+1 );
                    ctx.stroke();
                }
            }
        }
    }

    // Pick n random numbers
    function PickRandomUnique(n,min,max) {
        var ar = [];
      
      for(var i=0;i<n;i++) {
        var num = min + Math.random() * max;
        ar.push(num);
      }  

        return ar;
    }

    // Return array of closest dots
    function CloseAr( d, ar ) {
        result = [];

        for(var i=0;i<2;i++) {
            for(var j=0;j<ar.length;j++) {
                if(j != d) {
                    // Check for distance
                    if( Math.abs(ar[j].x - ar[d].x) < 100 && Math.abs(ar[j].y - ar[d].y) < 100 ) {
                        if( j != result[0] ) {
                            // If dot in bounds write to result
                            result.push(j);
                            break;
                        }
                    }

                    
                }
            }
        }

        if(result.length == 1) result[1] = d;
        if(result.length == 0) { result[0] = d; result[1] = d; }

        return result;
    }


    // Creating array of dots
    ar = [];

    n = (ctx.canvas.height+ctx.canvas.width) / 200;
    xoffset = ctx.canvas.width/2 - n*25;
    yoffset = ctx.canvas.height/2 - n*25;

    for (var x=0;x<n;x++)
    {
      for (var y=0;y<n;y++)
      {
        var d = new dot()
        d.x = Math.round(Math.random()*(ctx.canvas.width/10)*10);//xoffset + x*50;
        d.y = Math.round(Math.random()*(ctx.canvas.height/10)*10);//yoffset + y*50;
        d.speedx = parseInt(Math.random()*40)/10.0-2;
        d.speedy = parseInt(Math.random()*40)/10.0-2;

        ar.push(d);
      }
    }

    l = 0;

    // Create Triangles
    tris = [];
    for(var i=0;i<10;i++) {
        tris[i] = new Triangle();
        tris[i].dotsCount = n*n;
        tris[i].ar = ar;
        tris[i].interval = 14+i*3;
    }

    // Looping
    function loopingFunction() {

        ctx.fillStyle = "#000";
        ctx.fillRect(0,0,canvas.width,ctx.canvas.height);

        // Draw line
        for(var i=0;i<10;i++) {
            tris[i].update( l );
        }
      
      
        ar.forEach(function(a) {
            a.update(ctx);
        });

        if(active) {
            setTimeout(loopingFunction, 50);
        }

        l++;
    }



    loopingFunction();
}