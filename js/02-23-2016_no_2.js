"use strict"

// Black Jack

/** ERROR, WARNING, CANCELED **/
    /**
     * [error - error warning (предупреждение об ошибке)]
     * @type {String}
     */
     var error = '*** INVALID VALUE IS ENTERED ***\n*** TRY AGAIN ***';

    /**
     * [canceled - execution is canceled (выполнение отменено)]
     * @type {String}
     */
     var canceled = '*** EXECUTION IS CANCELED ***';

/** CARD DECK **/

    /** [numDecks - selection of the number of decks]
     * @type {Number}
     */
     var numDecks;

    /** [cardsBase - base card deck]
     * @type {Array}
     */
     var cardsBase = {
        'hearts'    : [2,3,4,5,6,7,8,9,10,'J','Q','K','A'],
        'diamonds'  : [2,3,4,5,6,7,8,9,10,'J','Q','K','A'],
        'clubs'     : [2,3,4,5,6,7,8,9,10,'J','Q','K','A'],
        'spades'    : [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
     };

    /** [cardDesk - game card deck]
     * @type {Object}
     * @param  {Number} countCard   [number of desk in the shoe]
     * @return {[type]}             [description]
     */
     function cardDesk(countPlayer, countCard) {

        /** [numberCards - number of cards in the deck]
         * @type {Number}
         */
         this.numberCards = 52;
         if(!isNaN(countCard))
             this.numberCards = this.numberCards*countCard;

        /** [positionJoker - blank card position indicator for shuffling the deck]
         * @type {Number}
         */
         this.positionJoker = this.numberCards*(66+Math.random()*(75+1-66))/100;
         this.positionJoker = Math.floor(this.positionJoker);

        /** [playingDesk - card in the shoe]
         * @type {Array}
         */
         this.countDesks = countCard;
         this.playingDesk = {
             'hearts'    : [],
             'diamonds'  : [],
             'clubs'     : [],
             'spades'    : []
          };
         while(this.countDesks-- > 0) {
             for(var key in cardsBase)
                 this.playingDesk[key] = this.playingDesk[key].concat(cardsBase[key]);
         };
         this.playingDesk['joker'] = [0,1];

        /** [addCartShoe - add visual card to shoe]
         * @type {Function}
         */
         this.addCartShoe = function() {
            var q = 10+Number(countCard)*2;
            while(--q > 0) {
                $('#decks').append('<span></span>');
            };
            var spanInt = setInterval(function(){
                if (q < $('#decks').children('span').length+1) {
                    $('#decks').children('span').eq(q).addClass('card_'+q).animate({'left' : q+'px', 'top' : (q-q/2)+'px'});
                    q++;
                } else {
                    clearInterval(spanInt);
                    spanInt = -1;
                }
            }, 125);
            $('#info').children().eq(0).children().eq(0).children('b').text(this.numberCards);
         };

     }; // end object cardDesk

/** PLAYERS **/

    /** [numPlayers - selection of the number of players]
     * @type {Number}
     */
     var numPlayers;

    /** [playerS - data players]
     * @type {Object}
     */
     function playerS(countPlayers) {
        this.name = '';
        this.points = 0;
        this.bet = 0;
        this.balance = 100;

        /** [userCart - player cards]
         * @type {Array}
         */
         this.userCard = [{
                'hearts' : [],
                'diamonds' : [],
                'clubs' : [],
                'spades' : [],
                'joker' : []
            }];

        /** [userBet - selecting the player's bet]
         * @type {Function}
         * @return {Number} [current player's balance]
         */
         this.userBet = function() {
            event.preventDefault();
            var currentBalance = this.balance;
            setTimeout(function() {
                $('#popup').children('form').children('.form').children('p').remove();
                $('#popup').children('form').children('.form').prepend('<p><span>Your Balance:<i>$ ' + currentBalance + '</i></span><label for="numberbet">Enter Your Bet :</label></p><p class="text"><input type="text" name="numberbet" value="10"></p>');
                $('#popup').children('form').children('.form').fadeIn('slow');
            }, 500);
            return this.balance;
         };

        /** [closeBetForm description]
         * @type {Function}
         */
         this.closeBetForm = function() {
                $('#popup').fadeOut('slow', 'linear');
                this.balance -= $('#popup').find('input[name="numberbet"]').val();;
            };
     };

    /** [showsPlayersBet - it shows the player's bet (chips image)]
     * @type {Object}
     * @param  {Number} countBet [selection of the betting of players]
     */
     function showsPlayersBet(countBet) {
        this.realBett = countBet;
        this.remainder = this.realBett%10;
        this.visualBett = '';

        if(this.remainder === 0) {
            for (var i = this.realBett/10; i > 0; i--) {
                this.visualBett += '<span><span class="bett_10"></span></span>';
            };
        } else {
            if(this.remainder%5 == 0 && this.realBett != 25) {
                this.visualBett += '<span><span class="bett_5"></span></span>';
                for (var i = (this.realBett-this.remainder)/10; i > 0; i--) {
                    this.visualBett += '<span><span class="bett_10"></span></span>';
                };
            } else if(this.realBett == 25) {
                this.visualBett += '<span><span class="bett_25"></span></span>';
            } else {
                if(this.remainder%5%2) {
                    this.visualBett += '<span><span class="bett_1"></span></span>';
                    if(this.remainder%5%3 == 0) {
                        this.visualBett += '<span><span class="bett_2"></span></span>';
                    };
                } else {
                    if(this.remainder%5%3) {
                        for (var i = this.realBett%10%5/2; i > 0; i--) {
                            this.visualBett += '<span><span class="bett_2"></span></span>';
                        };
                    };
                };
                if(this.remainder > 5) {
                    this.visualBett += '<span><span class="bett_5"></span></span>';
                };
                if((this.realBett-this.remainder)%10 == 0) {
                    for (var i = (this.realBett-this.remainder)/10; i > 0; i--) {
                        this.visualBett += '<span><span class="bett_10"></span></span>';
                    };
                };
            };
        };

        this.visualBett += '';
     };

/** GAME SETUP **/

    /** [newGame - status of the game]
     * @type {Number}
     */
     var newGame = 1;

    /** [amountMoney - player bank]
     * @type {Number}
     */
     var amountMoney = 100;

    /** [totalBet - the total amount at stake]
     * @type {Number}
     */
     var totalBet = 0;

    /** [gameTotalSetup - initial game settings]
     * @type {Object}
     * @return {[type]} [description]
     */
     function gameTotalSetup() {

        this.numDecks;
        this.numPlayers;

        /** [gameOver - game end function]
         * @type {Function}
         */
         this.gameOver = function() {
            event.preventDefault();
            $('#popup').fadeOut('slow', function() {
                $('#popup').children('form').remove();
                $('#popup').append('<div id="game_over">Game over</div>');
                $('#popup').fadeIn('slow', 'linear');
            });
         };

        /** [gameContinue - games continue function]
         * @type {Function}
         * @return {Array} [number of decks and players]
         */
         this.gameContinue = function() {
            event.preventDefault();
            $('#popup').children('form').children('.form').fadeOut('slow');
            this.numDecks = $('#popup').find('input[name="numberdecks"]:checked').val();
            this.numPlayers = $('#popup').find('input[name="numberplaer"]:checked').val();
            this.arr = [this.numDecks, this.numPlayers];
            return this.arr;
         };

        /** [animateInfo - animating output information]
         * @type {Function}
         */
         this.animateInfo = function() {
            $('#info').children().children().children('b').each(function () {
                $(this).prop('Counter',0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 4000,
                    easing: 'swing',
                    step: function (now) {
                            $(this).text(Math.ceil(now));
                        }
                    });
                });
         };

        /** [tableGenerate description]
         * @type {Function}
         */
         this.tableGenerate = function(countPlayers) {
console.log(countPlayers);
         };
     };

/** START GAME **/
window.onload = function() {

    /** OF EVENTS DESTINATION SECTION **/

        // game cancellation initialization
        var setupGame = new gameTotalSetup();
        $('button').click(function() {
            setupGame.gameOver();
        });

    /** SELECTION OF THE PLAYING CONDITIONS **/

        // first PopUp
        $('form').submit(function() {
            numDecks = setupGame.gameContinue()[0];
            numPlayers = setupGame.gameContinue()[1];
console.log('1: ' + numPlayers);

            var newCardDesk = new cardDesk(numPlayers, numDecks);
console.log('2: ' + numPlayers);

            // second PopUp
            var newPlayerS = new playerS();
            newPlayerS.userBet();
console.log('3: ' + numPlayers);

            $('form').submit(function() {
                newCardDesk.addCartShoe();
                newPlayerS.closeBetForm();
console.log('4: ' + numPlayers);

                setupGame.tableGenerate(numPlayers);

                setupGame.animateInfo();

                /**
                 * [bettPlayers - selection of the betting of players]
                 * @type {Number}
                 */
                 /*var bettPlayers = prompt('Enter Your betting\n($1 to $25)', 10);
                 while(!isNaN(bettPlayers) && bettPlayers !== null && (Number(bettPlayers) < 1 || Number(bettPlayers) > 25)) {
                    alert(error);
                    bettPlayers = prompt('Enter the correct Your betting\n($1 to $25)', 10);
                 };
                 if (bettPlayers === null) {
                    alert(canceled);
                 } else {

                    var x = (numPlayers < 7) ? Math.floor((7-numPlayers)/2) : 0;
                    for (var i = x; i < numPlayers+x; i++) {
                        $('#player_'+(i+1)).fadeTo(1000, 1, function() {
                            var childCount = $(this).children('.bett').children().length;
                            var childPos = 100/childCount;

                            for (var j = 0; j < childCount; j++) {
                                $(this).children('.bett').children().eq(j).css('left', (childPos*j) + '%');
                            };

                        });

                        if(i !== 3) {
                            var playersBet = Math.floor(Math.random()*25)+1;
                            totalBet += playersBet;
                            var betts = new showsPlayersBet(playersBet);

                            $('#player_'+(i+1)).children('.bett').html(betts.visualBett);
                            $('#player_'+(i+1)).children('.player').children('i').eq(1).children('strong').html(playersBet);
                            $('#player_'+(i+1)).children('.player').children('i').eq(2).children('strong').html(Number(amountMoney)-Number(playersBet));

                        } else {
                            $('#player_'+(i+1)).children('.player').children('b').html('YOUR DESK');
                            var bettsYou = new showsPlayersBet(bettPlayers);

                            $('#player_'+(i+1)).children('.bett').html(bettsYou.visualBett);
                            $('#player_'+(i+1)).children('.player').children('i').eq(1).children('strong').html(Number(bettPlayers));
                            $('#player_'+(i+1)).children('.player').children('i').eq(2).children('strong').html(Number(amountMoney)-Number(bettPlayers));
                        };
                    };

                    $('#info').children().eq(0).children().eq(0).children('b').html(numDecks*52);
                    $('#info').children().eq(0).children().eq(1).children('b').html(numPlayers);
                    $('#info').children().eq(0).children().eq(2).children('b').html(Number(bettPlayers)+totalBet);

                    $('#info').children().children().children('b').each(function () {
                            $(this).prop('Counter',0).animate({
                                Counter: $(this).text()
                        }, {
                                duration: 4000,
                                easing: 'swing',
                                step: function (now) {
                                    $(this).text(Math.ceil(now));
                                }
                            });
                        });
                 };

                // newGame = prompt('Next game?', 1);
                */

            });

            // setupGame.gameOver();
        });
};