#OMM - The Object Markup Mapper#
##An oject to markup mapper to keep plain html out of your JavaScript code##

``Version 0.96``

Licensed under the MIT license

This class enables you to create Simple json objects and parse them to HTML MArkup at runtime.
The currently complete HTML tag reference including their complete attributes is build in this class.
It's also possible to extend the given configuration and/or override complete tags with own templates (e.g. for custom attributes).

**EXAMPLE:**

**1) Create a link:**

``new Template({
    A : {
      ID : 'myLink',
      CLASS : 'a b c',
      HREF : '#',
      INSERT : 'My first link using this Templateengine'
   }
}).toHtml()``

Produces:

`` <a href="#" class="a b c" id="myLink">My first link using this Templateengine</a>``

Create a custom template (partial):

``var oTpl = new Template().extTpls({IMGLINK : "<a href=\"{IMAGEURL}\" class=\"imagelink\" id=\"{IMGLINK}\"><img scr=\"{IMAGEURL}\" alt=\"{ALTTEXT}\"/></a>"});
oTpl.setConfig({
  IMGLINK : {
      IMGLINKID : 'myId',
      IMAGEURL : 'url_to_my_image',
      ALTTEXT : 'an image'
  }
}).toHtml();``

Also this type of writing is possible:

``new Template()
    .extTpls({IMGLINK : '<a href="{IMAGEURL}" class="imagelink" id="{IMGLINK}"><img scr="{IMAGEURL}" alt="{ALTTEXT}"/></a>'})
    .setConfig({IMGLINK : {IMGLINKID : 'myId',IMAGEURL : 'url_to_my_image',ALTTEXT : 'an image'}})
    .toHtml();`

Produces:

``<a href="url_to_my_image" class="imagelink"><img scr="url_to_my_image" alt="an image"/></a>``