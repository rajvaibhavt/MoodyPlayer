 var  ImageKit  =  require ( 'imagekit' ) ;
 require('dotenv').config();
 var mongoose = require('mongoose');

 var  imagekit  =  new  ImageKit ( {
     publicKey : process.env.IMAGEKIT_PUBLIC_KEY ,
     privateKey : process.env.IMAGEKIT_PRIVATE_KEY ,
        urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
    } ) ;

    function uploadToImageKit ( file ) {
        return new Promise ( ( resolve , reject )  =>  {
            imagekit . upload ( {
                file : file . buffer ,
                fileName :  new mongoose . Types . ObjectId ( ) .toString(),
                folder : 'audio-files' ,
    }, function ( error , result )  {
        if ( error )  {
            console . log ( error ) ;
            reject ( error ) ;
        } else  {
            console . log ( result ) ;
            resolve ( result ) ;
        }
    })
        } ) ;
    }
    module.exports = uploadToImageKit;