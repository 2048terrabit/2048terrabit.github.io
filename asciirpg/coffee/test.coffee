

class cc
  constructor: (c, img) ->
    @c = c
    @ctx = c.getContext '2d'
    @image = img
  clear: ->
    @ctx.fillStyle = "#fff"
    @ctx.fillRect(1,1,@c.width,@c.height)
  tile: (tx,ty, cx,cy) ->
    @ctx.drawImage(@image, tx*16,ty*16,16,16,cx*16,cy*16,16,16)






dispatcher = new WebSocketRails('78.47.206.129/websocket')

dispatcher.on_open = (data) -> # если соединение с сервером происходит, то мы попадаем в тело функции
  console.log 'Connection has been established' # прост уведомляем что все хорошо :)

  test_channel = dispatcher.subscribe('test') # то что мы передаем параметром - это название канала; каналы задаются сервером; test - это тестовый канал на серваке, просто будет отвечать сообщениями
  test_channel.bind 'test_method', (test_msg) -> # так мы биндимся на получение каких-то обновлений по определенному каналу, сервер сам будет решать когда что-то отправлять, при отправке данных по этому каналу будет срабатывать тело этой функции (это общая инфа для всех, если зайти в разных браузерах - инфа будет передана каждому подписанному на этот канал)
    console.log 'BINDING: public channgel subscribing'
    console.log test_msg # то что мы указывали в параметре функции - пришло с сервера, обычно это будут js объекты, но может быть все что угодно, в данном случае строка

  $ ->

    ac = new cc( document.getElementById("canvas"), document.getElementById("tiles"))
    ac.clear()
    ac.tile 0, 0, 3, 0
    #alert "krk"
    

    dispatcher.trigger 'level.map', 'nothing', (map) ->
      for x in [0..19]
        # ...
        for y in [0..19]
          # ...
          ac.tile 0, 0, x, y if map[x][y] == 1
          ac.tile 1, 0, x, y if map[x][y] == 0


    $('#testbut').on 'click', ->
      console.log 'send test msg from client'
      cc.test
      #ctx.fillRect(16,16,32,32)
      
    $('#reqmap').on 'click', ->
      dispatcher.trigger 'level.map', 'nothing', (map) ->
        console.log map
        for x in [0..19]
          # ...
          for y in [0..19]
            # ...
            ac.tile 0, 0, x, y if map[x][y] == 1
            ac.tile 1, 0, x, y if map[x][y] == 0
        
        
        $('#map').text "test"