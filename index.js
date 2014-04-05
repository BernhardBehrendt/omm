/*global log*/
/*global alert*/
var Omm=null;
(function () {
    "use strict";
    /**
     * OMM - The Object Markup Mapper
     *
     * Version 0.96
     *
     * Licensed under the MIT license
     *
     * This class enables you to create Simple json objects and parse them to HTML MArkup at runtime.
     * The currently complete HTML tag reference including their complete attributes is build in this class.
     * It's also possible to extend the given configuration and/or override complete tags
     * with own templates (e.g. for custom attributes).
     *
     * EXAMPLES:
     *
     * 1) CREATE A LINK:
     * new Omm({
     *       A : {
     *         ID : 'myLink',
     *         CLASS : 'a b c',
     *         HREF : '#',
     *         INSERT : 'My first link using this Ommengine'
     *      }
     *    }).toHtml()
     *
     * Produces:
     * <a href="#" class="a b c" id="myLink">My first link using this Ommengine</a>

     *
     * CREATE A CUSTOM TEMPLATE (LINK WITH IMAGE)
     * var oTpl = new Omm().extTpls({
     *             IMGLINK : '<a href="{IMAGEURL}" class="imagelink" id="{IMGLINK}"><img scr="{IMAGEURL}" alt="{ALTTEXT}"/></a>'
     *            });
     *
     * oTpl.setConfig({
     *   IMGLINK : {
     *      IMGLINKID : 'myId',
     *      IMAGEURL : 'url_to_my_image',
     *      ALTTEXT : 'an image'
     *   }
     * }).toHtml();
     *
     * Also this type of writing is possible:
     * new Omm()
     *     .extTpls({IMGLINK : '<a href="{IMAGEURL}" class="imagelink" id="{IMGLINK}"><img scr="{IMAGEURL}" alt="{ALTTEXT}"/></a>'})
     *     .setConfig({IMGLINK : {IMGLINKID : 'myId',IMAGEURL : 'url_to_my_image',ALTTEXT : 'an image'}})
     *     .toHtml();
     *
     * Produces:
     * <a href="url_to_my_image" class="imagelink"><img scr="url_to_my_image" alt="an image"/></a>
     *
     *
     *
     *
     * @author    Bernhard Bezdek
     *
     * @class Omm
     * @constructor
     * @param {Object} config the template configuration to be rendered
     * @param {Boolean} debug determine if the debugger output is enabled (log function required required)
     */
    Omm = function (config, debug) {
        // the Storage for the HTML Omm Strings
        this.oTpls = false;
        // Determine if there should come any debug messages
        this.debug = ( debug === undefined || debug !== true) ? false : debug;

        // Detect if logging is enabled if a function log is available
        if (this.debug === true && log instanceof Function) {
            alert('FOR DEBUGGING A FUNCTION NAMED LOG IS REQUIRED [function log(message, msgtype);]');
            this.debug = false;
        }

        // The data to be rendered as a template
        this.config = false;

        // Set the configuration for current HTML Code generation
        if (config !== undefined) {
            this.setConfig(config);
        }

        // Set default HTML Teplateset (override is possible)
        if (!this.getTpls()) {
            // A (hopefully) complete HTML Reference
            // But extends are posible of cours via extend method
            this.setTpls({
                "ABBR": "<abbr accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</abbr>",
                "ADDRESS": "<address accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</address>",
                "AREA": "<area alt=\"{ALT}\" coords=\"{COORDS}\" shape=\"{SHAPE}\" href=\"{HREF}\" target=\"{TARGET}\" ping=\"{PING}\" rel=\"{REL}\" media=\"{MEDIA}\" hreflang=\"{HREFLANG}\" type=\"{TYPE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "A": "<a href=\"{HREF}\" target=\"{TARGET}\" ping=\"{PING}\" rel=\"{REL}\" media=\"{MEDIA}\" hreflang=\"{HREFLANG}\" type=\"{TYPE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</a>",
                "ARTICLE": "<article accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</article>",
                "ASIDE": "<aside accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</aside>",
                "AUDIO": "<audio src=\"{SRC}\" crossorigin=\"{CROSSORIGIN}\" preload=\"{PRELOAD}\" autoplay=\"{AUTOPLAY}\" mediagroup=\"{MEDIAGROUP}\" loop=\"{LOOP}\" controls=\"{CONTROLS}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</audio>",
                "B": "<b accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</b>",
                "BASE": "<base />",
                "BDI": "<bdi none*=\"{NONE*}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</bdi>",
                "BDO": "<bdo dir*=\"{DIR*}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</bdo>",
                "BLOCKQUOTE": "<blockquote cite=\"{CITE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</blockquote>",
                "BODY": "<body >{INSERT}</body>",
                "BR": "<br accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "BUTTON": "<button autofocus=\"{AUTOFOCUS}\" disabled=\"{DISABLED}\" form=\"{FORM}\" formaction=\"{FORMACTION}\" formenctype=\"{FORMENCTYPE}\" formmethod=\"{FORMMETHOD}\" formnovalidate=\"{FORMNOVALIDATE}\" formtarget=\"{FORMTARGET}\" name=\"{NAME}\" type=\"{TYPE}\" value=\"{VALUE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</button>",
                "CANVAS": "<canvas >{INSERT}</canvas>",
                "CAPTION": "<caption accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</caption>",
                "CITE": "<cite accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</cite>",
                "CODE": "<code accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</code>",
                "COL": "<col span=\"{SPAN}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</col>",
                "COLGROUP": "<colgroup span=\"{SPAN}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</colgroup>",
                "COMMAND": "<command type=\"{TYPE}\" label=\"{LABEL}\" icon=\"{ICON}\" disabled=\"{DISABLED}\" checked=\"{CHECKED}\" radiogroup=\"{RADIOGROUP}\" command=\"{COMMAND}\" title=\"{TITLE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "DATA": "<data value=\"{VALUE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</data>",
                "DATAGRID": "<datagrid disabled=\"{DISABLED}\" multiple=\"{MULTIPLE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</datagrid>",
                "DATALIST": "<datalist data=\"{DATA}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</datalist>",
                "DD": "<dd accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</dd>",
                "DEL": "<del cite=\"{CITE}\" datetime=\"{DATETIME}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</del>",
                "DFN": "<dfn None, but the title attribute has special semantics for this element. If the <dfn> tag has a title attribute, then the exact value of that attribute is the term being defined.=\"{NONE, BUT THE TITLE ATTRIBUTE HAS SPECIAL SEMANTICS FOR THIS ELEMENT. IF THE <DFN> TAG HAS A TITLE ATTRIBUTE, THEN THE EXACT VALUE OF THAT ATTRIBUTE IS THE TERM BEING DEFINED.}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</dfn>",
                "DL": "<dl accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</dl>",
                "DETAILS": "<details open=\"{OPEN}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</details>",
                "DIV": "<div accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</div>",
                "DT": "<dt accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</dt>",
                "EM": "<em accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</em>",
                "EVENTSOURCE": "<eventsource src=\"{SRC}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "EMBED": "<embed src=\"{SRC}\" type=\"{TYPE}\" width=\"{WIDTH}\" height=\"{HEIGHT}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "FIELDSET": "<fieldset disabled=\"{DISABLED}\" form=\"{FORM}\" name=\"{NAME}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</fieldset>",
                "FIGCAPTION": "<figcaption accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</figcaption>",
                "FIGURE": "<figure accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</figure>",
                "FOOTER": "<footer >{INSERT}</footer>",
                "FORM": "<form accept-charset=\"{ACCEPT-CHARSET}\" action=\"{ACTION}\" autocomplete=\"{AUTOCOMPLETE}\" enctype=\"{ENCTYPE}\" method=\"{METHOD}\" name=\"{NAME}\" novalidate=\"{NOVALIDATE}\" target=\"{TARGET}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</form>",
                "H1": "<h1 accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</h1>",
                "H2": "<h2 accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</h2>",
                "H3": "<h3 accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</h3>",
                "H4": "<h4 accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</h4>",
                "H5": "<h5 accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</h5>",
                "H6": "<h6 accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</h6>",
                "HEAD": "<head >{INSERT}</head>",
                "HEADER": "<header >{INSERT}</header>",
                "HGROUP": "<hgroup >{INSERT}</hgroup>",
                "HR": "<hr accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "HTML": "<html >{INSERT}</html>",
                "I": "<i accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</i>",
                "IFRAME": "<iframe src=\"{SRC}\" srcdoc=\"{SRCDOC}\" name=\"{NAME}\" sandbox=\"{SANDBOX}\" seamless=\"{SEAMLESS}\" width=\"{WIDTH}\" height=\"{HEIGHT}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</iframe>",
                "IMG": "<img alt=\"{ALT}\" src=\"{SRC}\" crossorigin=\"{CROSSORIGIN}\" ismap=\"{ISMAP}\" usemap=\"{USEMAP}\" width=\"{WIDTH}\" height=\"{HEIGHT}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "INS": "<ins cite=\"{CITE}\" datetime=\"{DATETIME}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</ins>",
                "INPUT": "<input accept=\"{ACCEPT}\" alt=\"{ALT}\" autocomplete=\"{AUTOCOMPLETE}\" autofocus=\"{AUTOFOCUS}\" checked=\"{CHECKED}\" disabled=\"{DISABLED}\" dirname=\"{DIRNAME}\" form=\"{FORM}\" formaction=\"{FORMACTION}\" formenctype=\"{FORMENCTYPE}\" formmethod=\"{FORMMETHOD}\" formnovalidate=\"{FORMNOVALIDATE}\" formtarget=\"{FORMTARGET}\" height=\"{HEIGHT}\" list=\"{LIST}\" max=\"{MAX}\" maxlength=\"{MAXLENGTH}\" min=\"{MIN}\" multiple=\"{MULTIPLE}\" name=\"{NAME}\" pattern=\"{PATTERN}\" placeholder=\"{PLACEHOLDER}\" readonly=\"{READONLY}\" required=\"{REQUIRED}\" size=\"{SIZE}\" src=\"{SRC}\" step=\"{STEP}\" type=\"{TYPE}\" value=\"{VALUE}\" width=\"{WIDTH}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "KBD": "<kbd accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</kbd>",
                "KEYGEN": "<keygen autofocus=\"{AUTOFOCUS}\" challenge=\"{CHALLENGE}\" disabled=\"{DISABLED}\" form=\"{FORM}\" keytype=\"{KEYTYPE}\" name=\"{NAME}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "LABEL": "<label for=\"{FOR}\" form=\"{FORM}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</label>",
                "LEGEND": "<legend none=\"{NONE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</legend>",
                "LI": "<li value=\"{VALUE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</li>",
                "MARK": "<mark accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</mark>",
                "LINK": "<link />",
                "MAP": "<map name=\"{NAME}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</map>",
                "MENU": "<menu type=\"{TYPE}\" label=\"{LABEL}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</menu>",
                "META": "<meta />",
                "METER": "<meter value=\"{VALUE}\" min=\"{MIN}\" low=\"{LOW}\" high=\"{HIGH}\" max=\"{MAX}\" optimum=\"{OPTIMUM}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</meter>",
                "NOSCRIPT": "<noscript accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</noscript>",
                "NAV": "<nav accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</nav>",
                "OBJECT": "<object data=\"{DATA}\" type=\"{TYPE}\" typemustmatch=\"{TYPEMUSTMATCH}\" name=\"{NAME}\" usemap=\"{USEMAP}\" form=\"{FORM}\" width=\"{WIDTH}\" height=\"{HEIGHT}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</object>",
                "OL": "<ol reversed=\"{REVERSED}\" start=\"{START}\" type=\"{TYPE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</ol>",
                "OPTGROUP": "<optgroup disabled=\"{DISABLED}\" label=\"{LABEL}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</optgroup>",
                "OPTION": "<option disabled=\"{DISABLED}\" label=\"{LABEL}\" selected=\"{SELECTED}\" value=\"{VALUE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</option>",
                "P": "<p accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</p>",
                "OUTPUT": "<output for=\"{FOR}\" form=\"{FORM}\" name=\"{NAME}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "PARAM": "<param name=\"{NAME}\" value=\"{VALUE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "PRE": "<pre accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</pre>",
                "PROGRESS": "<progress value=\"{VALUE}\" max=\"{MAX}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</progress>",
                "Q": "<q cite=\"{CITE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</q>",
                "RUBY": "<ruby none=\"{NONE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</ruby>",
                "RP": "<rp none=\"{NONE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</rp>",
                "RT": "<rt none=\"{NONE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</rt>",
                "S": "<s accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</s>",
                "SAMP": "<samp accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</samp>",
                "SCRIPT": "<script src=\"{SRC}\" async=\"{ASYNC}\" defer=\"{DEFER}\" type=\"{TYPE}\" charset=\"{CHARSET}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</script>",
                "SECTION": "<section accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</section>",
                "SELECT": "<select autofocus=\"{AUTOFOCUS}\" disabled=\"{DISABLED}\" form=\"{FORM}\" multiple=\"{MULTIPLE}\" name=\"{NAME}\" size=\"{SIZE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</select>",
                "SMALL": "<small accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</small>",
                "SOURCE": "<source src=\"{SRC}\" type=\"{TYPE}\" media=\"{MEDIA}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "SPAN": "<span accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</span>",
                "STRONG": "<strong accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</strong>",
                "STYLE": "<style >{INSERT}</style>",
                "SUB": "<sub accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</sub>",
                "SUMMARY": "<summary accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</summary>",
                "SUP": "<sup accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</sup>",
                "TABLE": "<table border=\"{BORDER}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</table>",
                "TBODY": "<tbody accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</tbody>",
                "TD": "<td colspan=\"{COLSPAN}\" rowspan=\"{ROWSPAN}\" headers=\"{HEADERS}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</td>",
                "TEXTAREA": "<textarea autofocus=\"{AUTOFOCUS}\" disabled=\"{DISABLED}\" dirname=\"{DIRNAME}\" form=\"{FORM}\" maxlength=\"{MAXLENGTH}\" name=\"{NAME}\" placeholder=\"{PLACEHOLDER}\" readonly=\"{READONLY}\" required=\"{REQUIRED}\" rows=\"{ROWS}\" cols=\"{COLS}\" wrap=\"{WRAP}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</textarea>",
                "TFOOT": "<tfoot accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</tfoot>",
                "TH": "<th colspan=\"{COLSPAN}\" rowspan=\"{ROWSPAN}\" headers=\"{HEADERS}\" scope=\"{SCOPE}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</th>",
                "THEAD": "<thead accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</thead>",
                "TIME": "<time datetime=\"{DATETIME}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</time>",
                "TITLE": "<title >{INSERT}</title>",
                "TR": "<tr accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</tr>",
                "TRACK": "<track kind=\"{KIND}\" src=\"{SRC}\" srclang=\"{SRCLANG}\" label=\"{LABEL}\" default=\"{DEFAULT}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />",
                "U": "<u accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</u>",
                "UL": "<ul accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</ul>",
                "VAR": "<var accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</var>",
                "VIDEO": "<video src=\"{SRC}\" crossorigin=\"{CROSSORIGIN}\" poster=\"{POSTER}\" preload=\"{PRELOAD}\" autoplay=\"{AUTOPLAY}\" mediagroup=\"{MEDIAGROUP}\" loop=\"{LOOP}\" muted=\"{MUTED}\" controls=\"{CONTROLS}\" width=\"{WIDTH}\" height=\"{HEIGHT}\" accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" >{INSERT}</video>",
                "WBR": "<wbr accesskey=\"{ACCESSKEY}\" hidden=\"{HIDDEN}\" itemtype=\"{ITEMTYPE}\" class=\"{CLASS}\" id=\"{ID}\" lang=\"{LANG}\" contenteditable=\"{CONTENTEDITABLE}\" inert=\"{INERT}\" spellcheck=\"{SPELLCHECK}\" contextmenu=\"{CONTEXTMENU}\" itemid=\"{ITEMID}\" style=\"{STYLE}\" dir=\"{DIR}\" itemprop=\"{ITEMPROP}\" tabindex=\"{TABINDEX}\" draggable=\"{DRAGGABLE}\" itemref=\"{ITEMREF}\" title=\"{TITLE}\" dropzone=\"{DROPZONE}\" itemscope=\"{ITEMSCOPE}\" translate=\"{TRANSLATE}\" />"
            });
        }
    };

    /**
     * Set a new Omm object instead of the Standard HTML Tags with its Attributes
     * @method setTpls
     * @param {Object} oTpls an object containing a KEY:TEMPLATE Structure
     * @return {Object}    self reference
     */
    Omm.prototype.setTpls = function (oTpls) {
        if (oTpls instanceof Object) {
            this.oTpls = oTpls;
        }
        return this;
    };
    /**
     * Return the current representation of the HTML Omm structure
     * @method getTpls
     * @return {Object} the value of the Omm storage
     */
    Omm.prototype.getTpls = function () {
        return this.oTpls;
    };
    /**
     * Extend custom html templates
     * @method extTpls
     * @param {Object} oExtends the object whith elements to extend
     * @param {Boolean} bForce (optional) if element already exists and force is set to true existing version is replaced
     * @chainable
     */
    Omm.prototype.extTpls = function (oExtends, bForce) {
        // Set bForce if there wasn't a definition given
        if (bForce === undefined || bForce !== true) {
            bForce = false;
        }

        // Start extending of the internal stored templatelist
        if (oExtends instanceof Object) {
            for (var sTag in oExtends) {
                if (this.oTpls[sTag] === undefined || bForce === true) {
                    this.oTpls[sTag] = oExtends[sTag];
                }
            }
        }
        return this;
    };
    /**
     * Render given configuration into HTML
     * @method toHtml
     * @return    {String} the finally generated HTML code
     */
    Omm.prototype.toHtml = function () {
        var i;
        var loca;
        var tplconf;
        var sReturn = '';

        try {
            for (tplconf in this.config) {
                if (this.config.hasOwnProperty(tplconf)) {
                    if (this.config[tplconf] instanceof Array) {
                        for (i = 0; i < this.config[tplconf].length; i += 1) {
                            sReturn += new Omm({}[tplconf] = this.config[tplconf][i]).setTpls(this.getTpls()).toHtml();

                        }
                    } else {
                        for (loca in this.config[tplconf]) {
                            if (this.config[tplconf].hasOwnProperty((loca))) {
                                if (typeof (this.config[tplconf][loca]) !== 'object') {
                                    continue;
                                }

                                this.config[tplconf][loca] = new Omm(this.config[tplconf][loca]).setTpls(this.getTpls()).toHtml();
                            }
                        }

                        // Create real HTML from raw data
                        sReturn += this.render(this.oTpls[tplconf], this.config[tplconf]);
                    }
                }
            }
            return this.cleanUp(sReturn);

        } catch (e) {
            if (this.debug) {
                log('HTML generate process failed with message: ' + e, 'error');
            }
        }
    };

    /**
     * Render the insertion data into the template
     * @method render
     * @param {Object} oOmm The template object
     * @param {Object} oInsert The replacements for template object
     * @return {String} a pre final HTML string containing unused loca strings and attributes
     */
    Omm.prototype.render = function (oOmm, oInsert) {
        var LOCA;
        var oRegExp;
        if (typeof (oInsert) === 'object') {
            for (LOCA in oInsert) {
                if (oInsert.hasOwnProperty(LOCA)) {
                    oRegExp = new RegExp('{' + LOCA + '}', 'g');
                    oOmm = oOmm.replace(oRegExp, oInsert[LOCA]);
                }
            }
        }

        if (this.debug) {
            log('Cant render data of type ' + typeof (oInsert), 'error');
        }

        return oOmm;
    };

    /**
     * Cleanup the generated HTML and remove unused LOCA strings and not used
     * attributes
     * @method cleanUp
     * @param {String} sPreOutput The HTML string containing nonrequired data
     * @return {String} the postfinal HTML string
     */
    Omm.prototype.cleanUp = function (sPreOutput) {
        // Remove unused locastrings
        sPreOutput = sPreOutput.replace(/{[A-Z_]*}/ig, '');
        // Remove unused attributes
        sPreOutput = sPreOutput.replace(/[a-z]+="\s*"/ig, '');
        // Remove multiple whitespaces
        sPreOutput = sPreOutput.replace(/\s{2,}/g, ' ');
        // Remove tag ending whitespaces
        sPreOutput = sPreOutput.replace(/ >/g, '>');

        // Return finally cleand string
        return sPreOutput.toString();
    };
    /**
     * Set the template configuration
     * @method setConfig
     * @param {Object} oConfig The data for later HTML rendering
     * @chainable
     */
    Omm.prototype.setConfig = function (oConfig) {
        if (oConfig instanceof Object) {
            this.config = oConfig;
        }
        else if (this.debug) {
            log('The given configuration was invalid (Object required)', 'notice');
        }
        return this;
    };

    /**
     * If config is an instance of an Oject the configuration is returned
     * If not an empty Object is returned
     * @method getConfig
     * @return {Object} the before given templateconfiguration
     */
    Omm.prototype.getConfig = function () {
        if (this.config instanceof Object) {
            return this.config;
        }

        if (this.debug) {
            log('Theres actually just an empty configuration', 'notice');
        }

        return {};
    };
})();

if(module!==undefined && module.exports !== undefined){
    module.exports = Omm;
}