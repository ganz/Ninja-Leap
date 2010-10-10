package {
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.net.URLRequest;
	import flash.media.Sound;
	import flash.utils.Timer;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.utils.Dictionary;
	public class PlaySound extends Sprite {

	       private var sounds:Dictionary = new Dictionary();

	       public function PlaySound() {
			var display_txt:TextField = new TextField();
			display_txt.text = "Hello Worldadfsdf!";
			addChild(display_txt);	       	      

			if (ExternalInterface.available) {
	                   ExternalInterface.addCallback("loadSound", loadSound);
	                   ExternalInterface.addCallback("playSound", playSound);
			}
			function loadSound(filename:String):void
			{
			  var url:URLRequest = new URLRequest("sounds/" + filename);
			  sounds[filename] = new Sound(url);
			}
			function playSound(filename:String):void
			{
			  sounds[filename].play();
			}

			ExternalInterface.call("init");
	       }
	}
}
