var shell = require('shelljs');

module.exports = function (grunt) {
  grunt.initConfig ({     

        pkg: grunt.file.readJSON('package.json'),
    
        banner: '/*!\n' +
                  ' * Woben v<%= pkg.version %> by @yperezva\n' +
                  ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                  ' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
                  ' */\n',
    
        clean: {
          build: ['public/build/css', 'public/build/js']
        },

        concat: {
          options: {
            stripBanners: false
          },
          WobenProducts : {
            src : [
        				'public/app/products/init.js',
                'public/app/products/productService.js',	
                'public/app/products/categoryService.js',
                'public/app/products/notificationService.js',
        				'public/app/products/addCategoryController.js',
        				'public/app/products/addFeatureController.js',
        				'public/app/products/addProductController.js',        				
        				'public/app/products/notificationListController.js',        				
        				'public/app/products/productListController.js',
        				'public/app/products/publicProductController.js',
        				'public/app/products/updateProductController.js',
        				'public/app/products/viewPublicProductController.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.Products.js'
          },
          WobenCommon : {
            src : [
                'public/app/common/init.js',
                'public/app/common/checkboxDirective.js',
                'public/app/common/radioDirective.js',
                'public/app/common/errorDirective.js',
                'public/app/common/authInterceptor.js',
                'public/app/common/oDataInterceptor.js',
                'public/app/common/errorService.js',
                'public/app/common/offcanvasDirective.js',
                'public/app/common/utilsService.js',
                'public/app/common/fileUploadDirective.js',
                'public/app/common/loaderDirective.js',
                'public/app/common/loaderInterceptor.js',
                'public/app/common/selectDirective.js',
                'public/app/common/typeaheadDirective.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.Common.js'
          }, 
         WobenAccount : {
            src : [
                'public/app/account/init.js',
                'public/app/account/accountService.js',
                'public/app/account/changePasswordController.js',
                'public/app/account/confirmAccountController.js',
                'public/app/account/deleteAccountController.js',
                'public/app/account/forgetPasswordController.js',
                'public/app/account/loginController.js',
                'public/app/account/registerController',
                'public/app/account/resetPasswordController.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.Account.js'
          },  
         WobenDashboard : {
            src : [
        				'public/app/dashboard/init.js',																																											
        				'public/app/dashboard/dashboardAdditionalController.js',
        				'public/app/dashboard/dashboardController.js',
        				'public/app/dashboard/dashboardHeaderController.js',
        				'public/app/dashboard/dashboardMenuController.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.Dashboard.js'
          }, 
         WobenContact : {
            src : [
        				'public/app/contact/init.js',
        				'public/app/contact/messageService.js',                
        				'public/app/contact/contactController.js',
        				'public/app/contact/messageListController.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.Contact.js'
          },  
         WobenAbout : {
            src : [
        				'public/app/about/init.js',
        				'public/app/about/aboutController.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.About.js'
          }, 
         WobenHome : {
            src : [
                'public/app/home/init.js',
        				'public/app/home/homeController.js',
        				'public/app/home/headerController.js',
        				'public/app/home/footerController.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.Home.js'
          },
         WobenIndexInitializer : {
            src : [
                'public/app/index.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.HomeInitializer.js'
          },    
         WobenDashboardInitialize : {
            src : [
                'public/app/dashboard.js'              
            ],
            dest : 'public/build/js/<%= pkg.name %>.DashboardInitializer.js'
          }
        },

        less: {
          production: {
            options: {
              compress: true,
              yuicompress: true,
              optimization: 2
            },
            files: {
              // target.css file: source.less file
              "public/build/css/flat.min.css": "public/lib/flat-ui-pro/flat.less",
              "public/build/css/startup.min.css": "public/lib/startup/startup.less"
            }
          },        
          development: {
            files: {
              // target.css file: source.less file
              "public/build/css/flat.css": "public/lib/flat-ui-pro/flat.less",
              "public/build/css/startup.css": "public/lib/startup/startup.less"
            }
          }        
        },
    
        uglify: {
            WobenModules: {
              files: {
                'public/build/js/<%= pkg.name %>.Products.min.js': 'public/build/js/<%= pkg.name %>.Products.js',
                'public/build/js/<%= pkg.name %>.Common.min.js': 'public/build/js/<%= pkg.name %>.Common.js',
                'public/build/js/<%= pkg.name %>.Account.min.js': 'public/build/js/<%= pkg.name %>.Account.js',
                'public/build/js/<%= pkg.name %>.Dashboard.min.js': 'public/build/js/<%= pkg.name %>.Dashboard.js',
                'public/build/js/<%= pkg.name %>.Home.min.js': 'public/build/js/<%= pkg.name %>.Home.js',
                'public/build/js/<%= pkg.name %>.Contact.min.js': 'public/build/js/<%= pkg.name %>.Contact.js',
                'public/build/js/<%= pkg.name %>.HomeInitializer.min.js': 'public/build/js/<%= pkg.name %>.HomeInitializer.js',
                'public/build/js/<%= pkg.name %>.DashboardInitializer.min.js': 'public/build/js/<%= pkg.name %>.DashboardInitializer.js',
                'public/build/js/<%= pkg.name %>.Contact.min.js': 'public/build/js/<%= pkg.name %>.Contact.js',
                'public/build/js/<%= pkg.name %>.About.min.js': 'public/build/js/<%= pkg.name %>.About.js'
              }
            }
        },
    
        watch: {
          styles: {
            // Which files to watch (all .less files recursively in the less directory)
            files: ['public/lib/flat-ui-pro/*.less'],
            tasks: ['less:development'],
            options: {
              nospawn: true
            }
          },
          scripts: {
            // Which files to watch (all js files recursively in the scripts directory)
            files: ['public/app/*.js'],
            tasks: ['concat'],
            options: {
              nospawn: true
            }
          }        
        },
 /*       
        cssmin : {
            site: {
                files : {
                    'docs/public/Content/styles.css': [
                    'docs/public/Content/bootstrap.css', 
                    'docs/public/Content/bootstrap-responsive.css', 
                    'docs/public/Content/durandal.css', 
                    'docs/public/Content/font-awesome.css',
                    'docs/public/Content/font-awesome-ie7.css', 
                    'docs/public/Content/prettify.css', 
                    'docs/public/Content/ie10mobile.css', 
                    'docs/public/Scripts/durandal/css/durandal.css', 
                    'docs/public/Content/Stashy.css', 
                    'docs/public/Content/app.css' 
                    ]
                }
            }
        },
  */
  /*          
        usebanner: {
         stashyCSS: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: true
                },
                files: {
                    src: [ 'dist/css/Stashy.css', 'dist/css/Stashy.min.css', 'dist/js/Stashy.js', 'dist/js/Stashy.min.js'   ]
                }
            }
        },
   */
   /*   
        shell: {
            optimizeDurandal: {
                command: [
                    'cd docs/public/',
                    'weyland build',
                    'cd ../../'
                ].join(';')
            }
        } 
    */     
  });
 
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-banner');
  
  // Clean
  grunt.registerTask('cleandir', ['clean']);  

  // Build
  grunt.registerTask('distribute', ['concat','less']);  
    
  // Copy others
  //grunt.registerTask('copyfiles', ['copy']);

  // CSS and JS dist
  grunt.registerTask('uglifyfiles', ['uglify']);
  
  // Add banners
  //grunt.registerTask('banners', ['usebanner']);
                                 
  // Site optimizer
  //grunt.registerTask('optimizesiteassets', ['uglify:site']);        
    
  // Build Durandal site
  //grunt.registerTask('builddurandalsite', "Build Durandal site", function() {
  //    shell.exec('weyland build');
  //});    
    
  // Default. Excute task in order
  grunt.registerTask('default', ['cleandir','distribute','uglifyfiles']);

};