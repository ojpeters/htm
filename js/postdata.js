var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var imagedata="";
var email=comment=username=thesignature=rfq=contractorname=hours=beatno=streetno=streetaddress="";
 
document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}




// A button will call this function
//
function capturePhoto() {
    sessionStorage.removeItem('imagepath');
	//$('#takePicBtn').on('click',function (e){
		// e.preventDefault();
		// Take picture using device camera and retrieve image as base64-encoded string
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, encodingType : Camera.EncodingType.JPEG,
		targetWidth: 150,
		targetHeight: 150,
		destinationType: Camera.DestinationType.FILE_URI });
	//});
	showAlert("started");
}

function onPhotoDataSuccess(imageURI) { 
        // Uncomment to view the base64 encoded image data,
      		 
		   var imgProfile = document.getElementById('imgProfile');

        // Show the captured photo
        // The inline CSS rules are used to resize the image
        
        imgProfile.src = imageURI;
		sessionStorage.setItem('imagepath', imageURI);//store value in session 

		
}
// Called if something bad happens.
// 
function onFail(message) {
    showAlert('Failed because: ' + message);
}

function movePic(file){ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
} 

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry){ 
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "appfiles";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.moveTo(directory, newFileName,  successMove, resOnError);
                    },
                    resOnError);
                    },
    resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
    //Store imagepath in session for future use
    // like to store it in database
    sessionStorage.setItem('imagepath', entry.fullPath);
	//showAlert("starting upload to ofullpath"+entry.fullPath);	 
	uploadPhoto(entry.fullPath);
}

function resOnError(error) {
    showAlert(error.code);
}

///post form data
function postData() {

	
	var target="http://store.ojpeters.com/savedata/addexpense";
	//var target="http://localhost/remotemobile/index.php/savecomment"	
	//addTolocalDB();

		if(isErrorfree){
		
		alert("all clear,calling post");
		var formData = $("#expenseform").serialize();
				alert("Posting"+formData);
			$.ajax({
					type: "POST",
					url: target,
					cache: false,
					data: formData,
					beforeSend: function() {
							// This callback function will trigger before data is sent
							
							//$.mobile.showPageLoadingMsg(true); // This will show ajax spinner
							$.mobile.loading('show', {
								theme: "a",
								text: "wait while we process..",
								textonly: true,
								textVisible: true
							});
					},
					complete: function() {
							// This callback function will trigger on data sent/received complete
							//$.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
							//alert("completeing"+formData);
							$.mobile.loading("Cone and in Done");
					},
					success: function (result) {
						 
						//display result in another page
						$.mobile.changePage("#page2");
						$('#resultshow').html(result);
						//check if image is captured an dupload
							if (sessionStorage.getItem('imagepath') == null){
								// myValue was not set
								$("#resultshow").append("Image NOT set:"+imageURI);
							}else{
								// myValue was set			
								
								imageitem=sessionStorage.getItem('imagepath');
								$("#resultshow").append("Image captured:"+imageitem);
								var returnedresult=result.split(":");// we separated it
								newsid=returnedresult[1];
								uploadPhoto(imageitem,newsid);
								//movePic(imageitem);
								
							}					
						
					},
					error: function (request,error) {
						
										//display result in another page
						$.mobile.changePage("#page2");
						$('#resultshow').html("message: "+request.responseText+formData+"  ErrorFound: " + error);
						
						//alert(formData);
					}        

			});
		}else{alert("enter the required information");}
		
	/////

} 


///////////////
function uploadPhoto(imageURI,newsid) {
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="text/plain";

    var params = new Object();
	params.newsid=newsid;

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://store.ojpeters.com/savedata"), win, fail, options);
}

function isErrorfree(){
	var ferrors=title=costs=description="";
		title=$('#title').val();
		description=$('#desc').val();
		cost=$('#cost').val();	
	if(title !="" && description && cost !=""){
		return true;
	}else{
	return false;
	}
}
function win(r) {
    //showAlert("Code = " + r.responseCode+"Response = " + r.response+"Sent = " + r.bytesSent);
	$("#resultshow").append("Upload successful: code:"+r.responseCode+"Response = " + r.response+"Sent = " + r.bytesSent);
	//sessionStorage.getItem('imagepath') = null;
   
}

function fail(error) {
    showAlert("Upload failed:An error has occurred: Code = " + error.code+"upload error source " + error.source+"upload error target " + error.target);
	$("#resultshow").append("Upload failed:An error has occurred: Code = " + error.code+"upload error source " + error.source+"upload error target " + error.target);

    
}

/////////////////////////
function showAlert(message) {
        navigator.notification.alert(
            message,  // message
            alertDismissed,         // callback
            'Update',            // title
            'OK'                  // buttonName
        );
    }
function alertDismissed(){
//do nothing
}

//clean up
function cleanUp() {
		imagedata = "";
		$("#submit").removeAttr("disabled").button("refresh");
		$("#comment").val("");
		$("#takePicBtn").text("Add Pic").button("refresh");
	}
	
	function dotest(){
	
	
	 sessionStorage.setItem('imagepath', "c:\\image");
	
	}
	
	function testme(){
	
		if (sessionStorage.getItem('imagepath') == null){
			// myValue was not set
		}else{
			// myValue was set
			var imageitem=sessionStorage.getItem('imagepath');
			
			alert("Path was set:"+imageitem);
		}
		
	
	}
	