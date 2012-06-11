$(document).ready(function(){    
    $('#dragMe').dragIt({
        precision: 2,
        resolution: .33,
        range: [-30, 500]
    });
});
(function( $ ) {
  $.widget( "ui.dragIt", $.ui.mouse, {

    //widgetEventPrefix: "slide",
 
    // These options will be used as defaults
    options: {
        debug: false,
        resolution: 1,
        precision: 0,
        range:[-200, 200]
    },
    
    _dragging: false,
    _namespace: '',
    _entry: {},
    _setEntryPoint: function(x, y, val){
        this._entry = {
            x: x || this._entry.x,
            y: y || this._entry.y,
            val: val || this._entry.val
        };
    },
 
    // Set up the widget
    _create: function() {
        this.options.cancel = 'option';
    },
 
    // Use the _setOption method to respond to changes to options
    _setOption: function( key, value ) {
        switch( key ) {
        case "resolution":
            this.options.resolution = value;
            break;
        case "precision":
            this.options.precision = value;
            break;
        }
        
        // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
        $.Widget.prototype._setOption.apply( this, arguments );
        // In jQuery UI 1.9 and above, you use the _super method instead
        this._super( "_setOption", key, value );
    },
    
    _init: function(){
        this._mouseInit();
        this._namespace = '.' + this.element[0].id;
        this.element.addClass('draggy');
    },
    
    _mouseCapture: function(event){
        this.element.focus();
        return true;
    },
    
    _mouseStart: function(event){
        this.element.blur();
        if(this.options.debug)log('input - draggy', this.element[0].id + ' ' + event.type);
        this._dragging = false;
        this.element.addClass('draggy_glow'); //change ui as indicator of activity
        
        this._setEntryPoint(
            event.offsetX,
            event.offsetY,
            parseFloat(this.element[0].value)
        );
    },
    _mouseDrag: function(event){
        var dx = event.offsetX - this._entry.x,
            dy = event.offsetY - this._entry.y,
            marker = 100 * event.offsetX / this.element.outerWidth()
            distance = 0, value = 0,
            low = this.options.range[0],
            high = this.options.range[1];
        
        this._dragging = true;
        if(this.options.debug)log('input - draggy', this.element[0].id + ' ' + event.type, 'x: '+this._entry.x, 'y: '+this._entry.y, 'dx: '+dx, 'dy: '+dy);
        
        /*
        //step distance since last drag event
        distance = parseFloat(this.element[0].value) + dx;
        
        step distance since last drag event
        this._setEntryPoint(event.offsetX, event.offsetY);
        */
        
        distance = dx * this.options.resolution;
        value = this._entry.val + distance;
        value = value < low ? low: (value > high ? high: value);
        
        this.element[0].value = value.toFixed(this.options.precision);
    },
    _mouseStop: function(event){
        if(this.options.debug)log('input - draggy', this.element[0].id + ' ' + event.type, 'x: '+ this._entry.x, 'y: '+ this._entry.y );
        this.element.removeClass('draggy_glow');        
        this.element.blur(); //blur the input since we were dragging
    },
 
    // Use the destroy method to clean up any modifications your widget has made to the DOM
    destroy: function() {
        this._mouseDestroy();
      // In jQuery UI 1.8, you must invoke the destroy method from the base widget
      $.Widget.prototype.destroy.call( this );
      // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
    }
  });
}( jQuery ) );