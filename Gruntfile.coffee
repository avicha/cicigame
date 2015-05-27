path = require 'path'
fs = require 'fs'
module.exports = (grunt)->
    #项目配置
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        #requirejs模块化并合并压缩js
        requirejs:
            #合并首页js
            game:
                options:
                    baseUrl: "assets/js"
                    out: "assets/js/game.js"
                    name: 'app/init'
    # Load the plugin that provides the "uglify" task.
    
    grunt.loadNpmTasks('grunt-contrib-requirejs')

    # Default task(s). 上线前一次性构建一次
    grunt.registerTask('default', ['requirejs'])