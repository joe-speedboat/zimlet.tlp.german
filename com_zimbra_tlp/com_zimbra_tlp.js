//Constructor
function com_zimbra_tlp_HandlerObject() {
};


com_zimbra_tlp_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_tlp_HandlerObject.prototype.constructor = com_zimbra_tlp_HandlerObject;

com_zimbra_tlp_HandlerObject.prototype.toString =
function() {
   return "com_zimbra_tlp_HandlerObject";
};

/** 
 * Creates the Zimlet, extends {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html ZmZimletBase}.
 * @class
 * @extends ZmZimletBase
 *  */
var TLPZimlet = com_zimbra_tlp_HandlerObject;

/** Add sensitivity buttons to the toolbar in the compose tab. 
  * This method is called by the Zimlet framework when application toolbars are initialized.
  * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html#initializeToolbar ZmZimletBase.html#initializeToolbar}
  * 
  * @param	{ZmApp}				app				the application
  * @param	{ZmButtonToolBar}	toolbar			the toolbar
  * @param	{ZmController}		controller		the application controller
  * @param	{string}			   viewId			the view Id
 * */

TLPZimlet.prototype.initializeToolbar =
function(app, toolbar, controller, viewId) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_tlp').handlerObject;
   // bug fix #7192 - disable detach toolbar button
   toolbar.enable(ZmOperation.DETACH_COMPOSE, false);   
   
   if(viewId.indexOf("COMPOSE") >=0){
      if (toolbar.getButton('TLPZimletBtn'))
      {
         //button already defined
         return;
      }
      var buttonArgs = {
         text: zimletInstance.getMessage('TLPZimlet_menuItem'),
         index: 1,
         showImageInToolbar: false,
         showTextInToolbar: true
      };
      var button = toolbar.createOp("TLPZimletBtn", buttonArgs);
      button.addSelectionListener(new AjxListener(zimletInstance, zimletInstance.askSendOptions, controller));
   }
};

TLPZimlet.prototype.askSendOptions =
function(controller) {    
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_tlp').handlerObject;
   zimletInstance._dialog = new ZmDialog( { title:zimletInstance.getMessage('TLPZimlet_sensitivityBtn'), parent:this.getShell(), standardButtons:[DwtDialog.CANCEL_BUTTON,DwtDialog.OK_BUTTON], disposeOnPopDown:true } );
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:125px;">'+
   '<br><span>'+zimletInstance.getMessage('TLPZimlet_tlpDescription')+' <a href="'+zimletInstance.getMessage('TLPZimlet_tlpHelpLink')+'" target="blank">'+zimletInstance.getMessage('TLPZimlet_tlpHelpLink')+'</a>'+
   '<br><br><select id="TLPZimletsensitivity"> <option value="[TLP:RED]">'+zimletInstance.getMessage('TLPZimlet_redLabel')+'</option><option value="[TLP:AMBER]">'+zimletInstance.getMessage('TLPZimlet_amberLabel')+'</option><option value="[TLP:GREEN]">'+zimletInstance.getMessage('TLPZimlet_greenLabel')+'</option><option value="[TLP:WHITE]">'+zimletInstance.getMessage('TLPZimlet_whiteLabel')+'</option></select></div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance.setSensitivity, [controller]));
   zimletInstance._dialog.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn, [controller]));
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   zimletInstance._dialog.popup(); 
}

TLPZimlet.prototype.setSensitivity =
function(controller) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_tlp').handlerObject;

   var composeView = appCtxt.getCurrentView();
   var mode = composeView.getHtmlEditor().getMode();   
   var content = composeView.getHtmlEditor().getContent();
   var contentRegex = /<div><span style=".*?">\[TLP:.*?\] .*?<\/span><\/div>/g
   content = content.replace(contentRegex, "");
   contentRegex = /\[TLP:.*\] .*\n/m
   content = content.replace(contentRegex, "");

   if (mode == Dwt.TEXT)
   {
      switch (document.getElementById('TLPZimletsensitivity').value)
      {
         case "[TLP:RED]":
            composeView.getHtmlEditor().setContent(zimletInstance.getMessage('TLPZimlet_redDescription').replace(/<br>/g, "\r\n") + "\r\n" + content);
            break;
         case "[TLP:AMBER]":
            composeView.getHtmlEditor().setContent(zimletInstance.getMessage('TLPZimlet_amberDescription').replace(/<br>/g, "\r\n") + "\r\n" + content);
            break;
         case "[TLP:GREEN]":
            composeView.getHtmlEditor().setContent(zimletInstance.getMessage('TLPZimlet_greenDescription').replace(/<br>/g, "\r\n") + "\r\n" + content);
            break;
         case "[TLP:WHITE]":
            composeView.getHtmlEditor().setContent(content);   
            break;
      }
   }
   else
   {
      switch (document.getElementById('TLPZimletsensitivity').value)
      {
         case "[TLP:RED]":
            composeView.getHtmlEditor().setContent("<span style='color: #ff0033; background: #000; padding:3px;'>" + zimletInstance.getMessage('TLPZimlet_redDescription') + "</span>" + content);
            break;
         case "[TLP:AMBER]":
            composeView.getHtmlEditor().setContent("<span style='color: #ffc000; background: #000; padding:3px;'>" + zimletInstance.getMessage('TLPZimlet_amberDescription') + "</span>" + content);
            break;
         case "[TLP:GREEN]":
            composeView.getHtmlEditor().setContent("<span style='color: #3f0; background: #000; padding:3px;'>" + zimletInstance.getMessage('TLPZimlet_greenDescription') + "</span>" + content);
            break;
         case "[TLP:WHITE]":
            composeView.getHtmlEditor().setContent(content);   
            break;
      }
   }

   var redSubject = zimletInstance.getMessage('TLPZimlet_redSubject');
   var amberSubject = zimletInstance.getMessage('TLPZimlet_amberSubject');
   var greenSubject = zimletInstance.getMessage('TLPZimlet_greenSubject');

   redSubject = redSubject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // escape special characters
   amberSubject = amberSubject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // escape special characters
   greenSubject = greenSubject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // escape special characters
   var subjectRegex = new RegExp(redSubject + '\\s|' + amberSubject + '\\s|' + greenSubject + '\\s', 'gm');
   var subject = appCtxt.getCurrentView()._subjectField.value;
   subject = subject.replace(subjectRegex, "");

   switch (document.getElementById('TLPZimletsensitivity').value)
   {
      case "[TLP:RED]":
         appCtxt.getCurrentView()._subjectField.value = zimletInstance.getMessage('TLPZimlet_redSubject') + " " + subject;
         break;
      case "[TLP:AMBER]":
         appCtxt.getCurrentView()._subjectField.value = zimletInstance.getMessage('TLPZimlet_amberSubject') + " " + subject;
         break;
      case "[TLP:GREEN]":
         appCtxt.getCurrentView()._subjectField.value = zimletInstance.getMessage('TLPZimlet_greenSubject') + " " + subject;
         break;
      case "[TLP:WHITE]":
         appCtxt.getCurrentView()._subjectField.value = subject;
         break;
   }

   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {}
};


/** This method is called when the dialog "CANCEL" button is clicked.
 * It pops-down the current dialog.
 * 
 * Cancel also means no sensitivity is set on this email.
 */
TLPZimlet.prototype._cancelBtn =
function(controller) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_tlp').handlerObject;
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {}
};
