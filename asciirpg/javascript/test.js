// Generated by CoffeeScript 1.10.0
(function() {
  var cc, dispatcher;

  cc = (function() {
    function cc(c, img) {
      this.c = c;
      this.ctx = c.getContext('2d');
      this.image = img;
    }

    cc.prototype.clear = function() {
      this.ctx.fillStyle = "#fff";
      return this.ctx.fillRect(0, 0, this.c.width, this.c.height);
    };

    cc.prototype.tile = function(tx, ty, cx, cy) {
      return this.ctx.drawImage(this.image, tx * 16, ty * 16, 16, 16, cx * 16, cy * 16, 16, 16);
    };

    return cc;

  })();

  dispatcher = new WebSocketRails('78.47.206.129/websocket');

  dispatcher.on_open = function(data) {
    var test_channel;
    console.log('Connection has been established');
    test_channel = dispatcher.subscribe('test');
    test_channel.bind('test_method', function(test_msg) {
      console.log('BINDING: public channgel subscribing');
      return console.log(test_msg);
    });
    return $(function() {
      var ac, animtick, curPlayer, frame2, handlePlayer, player_data, t, uid, updateTile;
      ac = new cc(document.getElementById("canvas"), document.getElementById("tiles"));
      ac.clear();
      dispatcher.trigger('level.map', 'nothing', function(map) {
        var i, results, x, y;
        results = [];
        for (x = i = 0; i <= 19; x = ++i) {
          results.push((function() {
            var j, results1;
            results1 = [];
            for (y = j = 0; j <= 19; y = ++j) {
              if (map[x][y] === 1) {
                ac.tile(0, 0, x, y);
              }
              if (map[x][y] === 0) {
                results1.push(ac.tile(1, 0, x, y));
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })());
        }
        return results;
      });
      frame2 = true;
      updateTile = function(tile, pos) {
        if (frame2) {
          ac.tile(1, 0, curPlayer.pos.x, curPlayer.pos.y);
          return ac.tile(tile[0], tile[1], curPlayer.pos.x, curPlayer.pos.y);
        } else {
          ac.tile(1, 0, curPlayer.pos.x, curPlayer.pos.y);
          return ac.tile(tile[0] + 1, tile[1], curPlayer.pos.x, curPlayer.pos.y);
        }
      };
      curPlayer = null;
      animtick = function() {
        if (curPlayer) {
          updateTile([8, 0], curPlayer.pos);
          return frame2 = !frame2;
        }
      };
      setInterval(animtick, 500);
      handlePlayer = function(ply) {
        console.log(ply);
        curPlayer = ply;
        return ac.tile(8, 0, curPlayer.pos[0], curPlayer.pos[1]);
      };
      if (uid = localStorage.getItem('player_uid')) {
        player_data = {
          uid: uid
        };
        dispatcher.trigger('player.sign_in', player_data, function(player) {
          console.log('existed user signed in');
          return handlePlayer(player);
        }, function(error_msg) {
          console.log('something wrong:');
          return console.log(error_msg);
        });
      } else {
        dispatcher.trigger('player.create', '', function(player) {
          console.log('new user created successfully');
          handlePlayer(player);
          return localStorage.setItem('player_uid', player.uid);
        }, function(error_msg) {
          console.log('User was not created by some reasons: ');
          return console.log(error_msg);
        });
      }
      t = 0;
      $(document).bind("keydown", function(e) {
        var dir, dirx, diry;
        dir = null;
        dirx = 0;
        diry = 0;
        if (e.keyCode === 37) {
          dir = "left";
        }
        if (e.keyCode === 38) {
          dir = "up";
        }
        if (e.keyCode === 39) {
          dir = "right";
        }
        if (e.keyCode === 40) {
          dir = "down";
        }
        if (dir) {
          e.preventDefault();
          if (t - new Date().getTime() < 0) {
            dispatcher.trigger('player.move', {
              player_uid: curPlayer.uid,
              direction: dir
            }, function(obj) {
              console.log(obj);
              ac.tile(1, 0, curPlayer.pos.x, curPlayer.pos.y);
              curPlayer.pos = obj.pos;
              return updateTile([8, 0], curPlayer.pos);
            }, function(error_msg) {
              return console.log(error_msg);
            });
            return t = new Date().getTime() + 300;
          }
        }
      });
      return $('#reqmap').on('click', function() {
        return dispatcher.trigger('level.map', 'nothing', function(map) {
          var i, j, x, y;
          console.log(map);
          for (x = i = 0; i <= 19; x = ++i) {
            for (y = j = 0; j <= 19; y = ++j) {
              if (map[x][y] === 1) {
                ac.tile(0, 0, x, y);
              }
              if (map[x][y] === 0) {
                ac.tile(1, 0, x, y);
              }
            }
          }
          return $('#map').text("test");
        });
      });
    });
  };

}).call(this);
