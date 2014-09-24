// This is for the Facebook SDK. Leave for now until we start working on this.
window.fbAsyncInit = function() {
	FB.init({
	  appId      : '702181949872529',
	  xfbml      : true,
	  version    : 'v2.1'
	});
};

(function(d, s, id){
	 var js, fjs = d.getElementsByTagName(s)[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement(s); js.id = id;
	 js.src = "//connect.facebook.net/en_US/sdk.js";
	 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));