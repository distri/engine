Engine
======

    Engine = (I={}, self=Bindable(I)) ->
      defaults I,
        FPS: 60
        paused: false

      frameAdvance = false

      running = false
      startTime = +new Date()
      lastStepTime = -Infinity
      animLoop = (timestamp) ->
        timestamp ||= +new Date()
        msPerFrame = (1000 / I.FPS)

        delta = timestamp - lastStepTime
        remainder = delta - msPerFrame

        if remainder > 0
          lastStepTime = timestamp - Math.min(remainder, msPerFrame)
          step()

        if running
          window.requestAnimationFrame(animLoop)

      update = (elapsedTime) ->
        self.trigger "beforeUpdate", elapsedTime
        self.trigger "update", elapsedTime
        self.trigger "afterUpdate", elapsedTime

      draw = ->
        return unless canvas = I.canvas

        self.trigger "beforeDraw", canvas
        self.trigger "draw", canvas
        self.trigger "overlay", canvas

      step = ->
        if !I.paused || frameAdvance
          elapsedTime = (1 / I.FPS)
          update(elapsedTime)

        draw()

      self.extend

Start the game simulation.

>     engine.start()

@methodOf Engine#
@name start

        start: ->
          unless running
            running = true
            window.requestAnimationFrame(animLoop)

          return self

Stop the simulation.

>     engine.stop()

@methodOf Engine#
@name stop

        stop: ->
          running = false

          return self

Pause the game and step through 1 update of the engine.

>     engine.frameAdvance()

@methodOf Engine#
@name frameAdvance

        frameAdvance: ->
          I.paused = true
          frameAdvance = true
          step()
          frameAdvance = false

Resume the game.

>     engine.play()

@methodOf Engine#
@name play

        play: ->
          I.paused = false

Toggle the paused state of the simulation.

>     engine.pause()

@methodOf Engine#
@name pause
@param {Boolean} [setTo] Force to pause by passing true or unpause by passing false.

        pause: (setTo) ->
          if setTo?
            I.paused = setTo
          else
            I.paused = !I.paused


Query the engine to see if it is paused.

>     engine.pause()
>     engine.paused() # true
>
>     engine.play()
>     engine.paused() # false

@methodOf Engine#
@name paused

        paused: ->
          I.paused

Change the framerate of the game. The default framerate is 60 fps.

>     engine.setFramerate(60)

@methodOf Engine#
@name setFramerate

        setFramerate: (newFPS) ->
          I.FPS = newFPS
          self.stop()
          self.start()

        update: update
        draw: draw

      Engine.defaultModules.each (module) ->
        self.include module

      self.trigger "init"

      return self

    Engine.defaultModules = [
      "age"
      "engine/background"
      "engine/collision"
      "engine/game_state"
      "engine/finder"
      "engine/keyboard"
      "engine/mouse"
      "engine/options"
      "timed_events"
    ].map (name) ->
      require "./modules/#{name}"

    module.exports = Engine