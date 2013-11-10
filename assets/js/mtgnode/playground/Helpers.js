/*
| -------------------------------------------------------------------
|  MTGNode Playground Helpers
| -------------------------------------------------------------------
|
|
| Author : Yomguithereal
| Version : 1.0
*/

;(function($, w, undefined){
  'use strict';

  // Cached Properties
  //===================
  var _templates = {
    my: new CardTemplate('my'),
    op: new CardTemplate('op')
  };

  var _maxZ = 30;

  // Methods
  //=========

  // Getting top or bottom
  function _getArea(side) {
    return (side === 'my') ? 'bottom' : 'top';
  }

  // Getting identifier function
  function _getCardSelectorFunc(side) {
    return function(id) {
      return $('#'+side+'_'+id);
    }
  }

  // Getting your side's template engine
  function _getTemplate(side) {
    return _templates[side];
  }

  // Adding some properties to deck cards
  function _flag(cards, side) {
    return cards.map(function(c, i) {

      // Unique card id
      c.id = i;

      // Card html
      c.html = _templates[side].render(c, c.id);
      return c;
    });
  }

  // Moving a card from a model to another
  function _fromTo(d, from, to, id) {

    var fromModel = d.get(from),
        toModel = d.get(to);

    // Returning false if the model is empty
    if (fromModel.length === 0)
      return false;

    // Finding first deck card
    if (id === undefined) {
      var card = fromModel.shift();
    }
    else {
      var card = _.remove(fromModel, function(c) {
        return c.id === id;
      })[0];
    }

    toModel.push(card);

    // Updating model
    d[from] = fromModel;
    d[to] = toModel;

    return card;
  }

  // Generating From To hacks
  function _fromToHacks(from, to, e1, e2) {
    return [
      {
        triggers: 'my'+e1,
        method: function(e) {
          var card = _fromTo(this, 'my'+from, 'my'+to, e.data.id);

          if (!card)
            return false;

          this.dispatchEvent('my'+e2, {
            id: card.id
          });
          this.dispatchEvent('sendRealtimeMessage', {
            head: 'op'+e1,
            body: {
              id: card.id
            }
          });
        }
      },
      {
        triggers: 'op'+e1,
        method: function(e) {
          var card = _fromTo(this, 'op'+from, 'op'+to, e.data.id);
          this.dispatchEvent('op'+e2, {
            id: card.id
          });
        }
      }
    ];
  }

  // Updating the zindex of a selected card
  function _updateZ($card) {
    _maxZ += 1;
    $card.css('z-index', _maxZ);
  }

  // Registering a card as draggable
  function _registerDraggable($card, drag_func) {
    var snap_zone = [
      '.hand-emplacement.bottom',
      '.game-emplacement.bottom',
      '.graveyard-emplacement.bottom',
      '.exile-emplacement.bottom'
    ];

    $card.draggable({
      containment: '.game-area',
      snap: snap_zone.join(', '),
      grid: [10, 10],
      drag: drag_func
    });

    $card.draggable('enable');
  }


  // Exporting
  //===========
  window.Helpers = {

    // Modules pieces
    getArea: _getArea,
    getTemplate: _getTemplate,
    getCardSelectorFunc: _getCardSelectorFunc,

    // Quick interaction with domino
    flag: _flag,
    fromTo: _fromTo,
    fromToHacks: _fromToHacks,

    // Dom manipulation
    updateZ: _updateZ,
    registerDraggable: _registerDraggable
  };
})(jQuery, window);
