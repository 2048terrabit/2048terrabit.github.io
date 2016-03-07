

class cc
  constructor: (c, img) ->
    @c = c
    @ctx = c.getContext '2d'
    @image = img
  clear: ->
    @ctx.fillStyle = "#fff"
    @ctx.fillRect(0,0,@c.width,@c.height)
  tile: (tx,ty, cx,cy) ->
    @ctx.drawImage(@image, tx*16,ty*16,16,16,16+cx*16,16+cy*16,16,16)






dispatcher = new WebSocketRails('78.47.206.129/websocket')

dispatcher.on_open = (data) -> # если соединение с сервером происходит, то мы попадаем в тело функции
  console.log 'Connection has been established'

  $ ->
    # Global vars
    objectList = {}
    g_map = null


    #
    # Settup canvas class
    #
    ac = new cc( document.getElementById("canvas"), document.getElementById("tiles"))
    ac.clear()

    frame2 = true

    updateTile = (tile,pos) ->
      if frame2
        ac.tile 1, 0, pos.x, pos.y
        ac.tile tile[0], tile[1], pos.x, pos.y
      else
        ac.tile 1, 0, pos.x, pos.y
        ac.tile tile[0]+1, tile[1], pos.x, pos.y




    sign_channel = dispatcher.subscribe('player')
    sign_channel.bind 'signed_in', (msg) ->
      console.log "Player with id joined: " + msg.id
      console.log msg
      objectList[msg.id+""] = msg

    move_channel = dispatcher.subscribe('player')
    move_channel.bind 'move', (msg) ->
      #console.log "Player with id moved: " + msg.id
      #console.log msg
      if curPlayer.id == msg.id
        ac.tile 1, 0, curPlayer.pos.x, curPlayer.pos.y
        curPlayer.pos = msg.pos
        #updateTile( [8,0], curPlayer.pos)
        renderPlayers()
      else
        objectList[msg.id+""] = msg
    
    disconnect_channel = dispatcher.subscribe('player')
    disconnect_channel.bind 'disconnected', (msg) ->
      console.log "Disconnected message:"
      console.log msg








    #
    # Login or registration of player
    #
    curPlayer = null

    handlePlayer = (ply) ->
      console.log ply
      curPlayer = ply


      # Initial map loading & drawing
      dispatcher.trigger 'level.get_map', { player_uid: curPlayer.uid }, (map) ->
        g_map = map
        for x in [-1..20]
          # ...
          for y in [-1..20]
            # ...
            ac.tile 0, 0, x, y

        updateTile( [8,0], curPlayer.pos)


      # Get info about players on map
      dispatcher.trigger 'level.get_players', { player_uid: curPlayer.uid }, (players) ->
        console.log "Got players:"
        for x in players
          objectList[x.id+""] = x
        console.log objectList




    # Check for saved player id
    if uid = localStorage.getItem('player_uid')

      player_data = {
        uid: uid
      }

      # Ask server for login
      dispatcher.trigger 'player.sign_in', player_data, (player) ->
        console.log 'existed user signed in'

        handlePlayer(player)


        # login error handling
      , (error_msg) -> 
        console.log 'something wrong:'
        console.log error_msg
    else
      dispatcher.trigger 'player.create', '', (player) ->
        console.log 'new user created successfully'
        handlePlayer(player)

        localStorage.setItem('player_uid', player.uid)


      , (error_msg) ->
        console.log 'User was not created by some reasons: '
        console.log error_msg







    #
    # Animation & Scene Render
    #
    renderPlayers = ->
      # Update other players
      for k,v of objectList
        updateTile( [8,1], v.pos)

      # Update client player
      updateTile( [8,0], curPlayer.pos)


    checkMapTile = (x,y) ->
      if !(x >= 0 && x < 20) 
        return 1
      if !(y >= 0 && y < 20) 
        return 1
      return g_map[x][y]

    animtick = ->
      for x in [0..19]
        # ...
        for y in [0..19]
          # ...
          if g_map[x][y] == 1

            #middle
            ac.tile 0, 0, x, y

            # north
            if checkMapTile(x,y+1) == 0
              ac.tile 0, 1, x, y
            # east
            #if checkMapTile(x-1,y) == 0
            #  ac.tile 0, 2, x, y
            # south
            #if checkMapTile(x,y-1) == 0
            #  ac.tile 0, 3, x, y
            # west
            #if checkMapTile(x+1,y) == 0
            #  ac.tile 0, 4, x, y
          ac.tile 1, 0, x, y if g_map[x][y] == 0

      #if curPlayer
      renderPlayers() 

      frame2 = !frame2
    setInterval animtick, 500
    

    #
    # Arrow button movement
    #
    t = 0
    $(document).bind "keydown", (e) ->
      dir = null
      dirx = 0
      diry = 0

      if e.keyCode == 37
        dir = "left"
      if e.keyCode == 38
        dir = "up"
      if e.keyCode == 39
        dir = "right"
      if e.keyCode == 40
        dir = "down"


      if dir
        e.preventDefault()

        if t - new Date().getTime() < 0
          dispatcher.trigger 'player.move', { player_uid: curPlayer.uid, direction: dir }, (obj) ->
            console.log obj
            # clear last position
            #ac.tile 1, 0, curPlayer.pos.x, curPlayer.pos.y

            # update player
            #curPlayer.pos = obj.pos
            #updateTile([8,0], curPlayer.pos)

          , (error_msg) ->
            console.log error_msg

          t = new Date().getTime() + 300


    $('#reqmap').on 'click', ->
      dispatcher.trigger 'level.map', 'nothing', (map) ->
        console.log map
        for x in [0..19]
          # ...
          for y in [0..19]
            # wall
            if map[x][y] == 1
              ac.tile 0, 0, x, y
              ac.tile 0, 1, x, y+1
            # floor
            ac.tile 1, 0, x, y if map[x][y] == 0
        
        
        $('#map').text "test"