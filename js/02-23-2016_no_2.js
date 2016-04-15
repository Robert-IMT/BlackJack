"use strict"

// Black Jack

/** TOTAL SETUP **/
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
     var numDecks = 0;

    /** [cardsBase - base card deck]
     * @type {Array}
     */
     var cardsBase = {
        'hearts'    : [2,3,4,5,6,7,8,9,10,'J','Q','K','A'], // ♥
        'diamonds'  : [2,3,4,5,6,7,8,9,10,'J','Q','K','A'], // ♦
        'clubs'     : [2,3,4,5,6,7,8,9,10,'J','Q','K','A'], // ♣
        'spades'    : [2,3,4,5,6,7,8,9,10,'J','Q','K','A']  // ♠
     };

    /** [cardDeck - game card deck]
     * @type {Object}
     * @param  {Number} countCard   [number of deck in the shoe]
     * @return {[type]}             [description]
     */
     function cardDeck(countCard) {
         this.countDecks = countCard;

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

        /** [playingDeck - card in the shoe]
         * @type {Array}
         */
         this.playingDeck = {
             'hearts'    : [],
             'diamonds'  : [],
             'clubs'     : [],
             'spades'    : []
          };
         while(this.countDecks-- > 0) {
             for(var key in cardsBase)
                 this.playingDeck[key] = this.playingDeck[key].concat(cardsBase[key]);
         };
         this.playingDeck['joker'] = [0,1];

        /** [addCartShoe - add visual card to shoe]
         * @type {Function}
         */
         this.addCartShoe = function() {
            var q = 10+Number(countCard)*2;
            if(!$('#decks').children().length) {
                while(--q > 0) {
                    $('#decks').append('<span><img src="" /><span></span></span>');
                };
                var spanInt = setInterval(function(){
                    if (q < $('#decks').children('span').length+1) {
                        $('#decks>span').eq(q).children('img').attr('src', 'image/card_back.png');
                        $('#decks>span').eq(q).animate({'left' : q+'px', 'top' : (q-q/2)+'px'});
                        q++;
                    } else {
                        clearInterval(spanInt);
                        spanInt = -1;
                    };
                }, 125);
            };
            return this.numberCards;
        };

     }; // end object cardDeck

/** PLAYERS **/

    /** [numPlayers - selection of the number of players]
     * @type {Number}
     */
     var numPlayers = 0;

    /** [userBet - the total amount at stake]
     * @type {Number}
     */
     var userBet;

    /** [playerS - data players]
     * @type {Object}
     * @param  {Number} countPlayers [selection of players in game]
     */
     function playerS() {
        this.name = '';
        this.points = 0;
        this.bet = 0;
        this.balance = 100;
        this.desk = 4;

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
         */
         this.userBet = function() {
            event.preventDefault();
            var currentBalance = this.balance;
            setTimeout(function() {
                $('#popup').children('form').children('.form').children('p').remove();
                $('#popup').children('form').children('.form').prepend('<p class="bet"><span>Your Balance:<i>$ ' + currentBalance + '</i></span><label for="numberbet">Enter Your Bet:</label></p><p class="text"><input type="text" name="numberbet" value="10"></p><p class="titledesk"><label for="numbertable">Select desk:</label></p><p class="numberdesk"><span><input id="desk1" type="radio" name="numbertable" value="1"><label for="desk1">I</label></span><span><input id="desk2" type="radio" name="numbertable" value="2"><label for="desk2">II</label></span><span><input id="desk3" type="radio" name="numbertable" value="3"><label for="desk3">III</label></span><span><input id="desk4" type="radio" name="numbertable" value="4" checked><label for="desk4">IV</label></span><span><input id="desk5" type="radio" name="numbertable" value="5"><label for="desk5">V</label></span><span><input id="desk6" type="radio" name="numbertable" value="6"><label for="desk6">VI</label></span><span><input id="desk7" type="radio" name="numbertable" value="7"><label for="desk7">VII</label></span></p>');
                $('#popup').children('form').children('.form').fadeIn('slow');
            }, 500);
         };

        /** [correctBet - validation enter value]
         * @type {Function}
         * @return {Number} [player Bet or player balance]
         */
         this.correctBet = function() {
            event.preventDefault();
            if(this.balance > 0) {
                if((this.playerBet ^ 0) === this.playerBet) {
                    this.playerBet = $('#popup').find('input[name="numberbet"]').val();
                } else {
                    this.playerBet = Math.ceil($('#popup').find('input[name="numberbet"]').val());
                };
                $('#popup').find('.text').children('span').remove();
                if(!isNaN(this.playerBet) && this.playerBet > 0 && this.playerBet <= 25) {
                    if(this.playerBet >= this.balance && this.balance <= 25) {
                        $('#popup').find('input[name="numberbet"]').val(this.balance);
                        this.playerBet = this.balance;
                    } else if(this.playerBet >= this.balance && this.balance >= 25) {
                        $('#popup').find('input[name="numberbet"]').val(25);
                        this.playerBet = 25;
                    };
                } else {
                    if(this.balance <= 25) {
                        $('#popup').find('.text').append('<span style="display:none;">Incorrect<br>Enter<br>from 1 to ' + this.balance + '</span>');
                    } else if(this.playerBet >= 25 && this.playerBet <= this.balance) {
                        $('#popup').find('.text').append('<span style="display:none;">Incorrect<br>Enter<br>from 1 to 25</span>');
                    } else if(this.playerBet <= 0) {
                        $('#popup').find('.text').append('<span style="display:none;">Incorrect<br>Enter<br>from 1 to 25</span>');
                    } else {
                        $('#popup').find('.text').append('<span style="display:none;">Incorrect<br>Enter<br>from 1 to 25</span>');
                    };
                    $('#popup').find('.text').children('span').fadeToggle('fast');
                    return false;
                };
                this.balance -= this.playerBet;
                return this.playerBet;
            } else {
                return this.balance;
            };
         };

        /** [closeBetForm - processing the second form]
         * @type {Function}
         */
         this.closeBetForm = function() {
            event.preventDefault();
            $('#popup').fadeOut('slow', 'linear');
         };
     } // object playerS END

    /** [virtualPlayers - it shows the player's bet (chips image)]
     * @type {Object}
     * @param  {Number} userBet [selection of betting of players]
     * @param  {Number} countPlayers [selection of players in game]
     */
     function virtualPlayers(countPlayers, userBet, userDesk) {
        this.virtualPlayers = countPlayers-1; // number of virtual players
        this.realBett = Number(userBet); // real player bet
        this.realDesk = Number(userDesk); // real player table
        this.arrayVirtualPlayer = [ // generate array virtual player
                {'status' : false,'bet' : 0, 'balance' : 100},
                {'status' : false,'bet' : 0, 'balance' : 100},
                {'status' : false,'bet' : 0, 'balance' : 100},
                {'status' : false,'bet' : 0, 'balance' : 100},
                {'status' : false,'bet' : 0, 'balance' : 100},
                {'status' : false,'bet' : 0, 'balance' : 100},
                {'status' : false,'bet' : 0, 'balance' : 100}
            ];
        this.arrayVirtualPlayer[this.realDesk-1] = { // add array real player
                'status' : true,
                'bet' : this.realBett,
                'balance' : this.arrayVirtualPlayer[this.realDesk-1].balance-this.realBett
            };

        /** [playerGenerate - virtual player generated]
         * @type {Object}
         * @return {Array} [all player data]
         */
         this.playerGenerate = function() {
            this.i = this.virtualPlayers-1;
            while(this.i >= 0) {
                this.rand = 1 - 0.5 + Math.random() * (this.virtualPlayers - 1 + 1);
                this.rand = Math.round(this.rand);
                this.bet = 1 - 0.5 + Math.random() * (25 - 1 + 1);
                this.bet = Math.round(this.bet);
                if(this.rand !== this.realDesk-1){
                    if(!this.arrayVirtualPlayer[this.rand].status) {
                        this.bet = (this.bet > this.arrayVirtualPlayer[this.rand].balance) ? this.arrayVirtualPlayer[this.rand].balance : this.bet;
                        this.arrayVirtualPlayer[this.rand] = {
                                'status' : (this.arrayVirtualPlayer[this.rand].balance > 0) ? true : false,
                                'bet' : this.bet,
                                'balance' : this.arrayVirtualPlayer[this.rand].balance-this.bet
                            };
                    } else {
                        this.j = 6;
                        while(this.j >= 0) {
                            if(!this.arrayVirtualPlayer[this.j].status) {
                                this.bet = (this.bet > this.arrayVirtualPlayer[this.j].balance) ? this.arrayVirtualPlayer[this.j].balance : this.bet;
                                this.arrayVirtualPlayer[this.j] = {
                                        'status' : (this.arrayVirtualPlayer[this.j].balance > 0) ? true : false,
                                        'bet' : this.bet,
                                        'balance' : this.arrayVirtualPlayer[this.j].balance-this.bet
                                    };
                                break;
                            };
                            this.j--;
                        };
                    };
                    this.i--;
                };
            };
            return this.arrayVirtualPlayer;
         };

        /** [visualPlayerBett - visualization bet of players]
         * @type {Object}
         */
         this.visualPlayerBett = function() {
            while(++this.i < this.arrayVirtualPlayer.length) {
                if(this.arrayVirtualPlayer[this.i].status == true) {
                    this.virtualBett = this.arrayVirtualPlayer[this.i].bet;
                    this.remainder = this.virtualBett%10;
                    this.visualBett = '';
                    $('#player_'+this.i).css({'opacity' : 1});
                    $('#player_'+this.i).find('.bet').children('strong').text(this.virtualBett);

                    // visual range
                    if(this.remainder === 0) {
                        for (var i = this.virtualBett/10; i > 0; i--) {
                            this.visualBett += '<span><span class="bett_10"></span></span>';
                        };
                    } else {
                        if(this.remainder%5 == 0 && this.virtualBett != 25) {
                            this.visualBett += '<span><span class="bett_5"></span></span>';
                            for (var i = (this.virtualBett-this.remainder)/10; i > 0; i--) {
                                this.visualBett += '<span><span class="bett_10"></span></span>';
                            };
                        } else if(this.virtualBett == 25) {
                            this.visualBett += '<span><span class="bett_25"></span></span>';
                        } else {
                            if(this.remainder%5%2) {
                                this.visualBett += '<span><span class="bett_1"></span></span>';
                                if(this.remainder%5%3 == 0) {
                                    this.visualBett += '<span><span class="bett_2"></span></span>';
                                };
                            } else {
                                if(this.remainder%5%3) {
                                    for (var i = this.virtualBett%10%5/2; i > 0; i--) {
                                        this.visualBett += '<span><span class="bett_2"></span></span>';
                                    };
                                };
                            };
                            if(this.remainder > 5) {
                                this.visualBett += '<span><span class="bett_5"></span></span>';
                            };
                            if((this.virtualBett-this.remainder)%10 == 0) {
                                for (var i = (this.virtualBett-this.remainder)/10; i > 0; i--) {
                                    this.visualBett += '<span><span class="bett_10"></span></span>';
                                };
                            };
                        };
                    };
                    this.visualBett += '';
                    $('#player_'+this.i).children('.bett').append(this.visualBett);
                    // $('#player_'+this.i).children('.bett').children('span').css({'position' : 'relative'});

                };
                $('#player_'+this.i).find('.balance').children('strong').text(this.arrayVirtualPlayer[this.i].balance);
            };
         };

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
     var totalBets;

    /** [gameTotalSetup - initial game settings]
     * @type {Object}
     */
     function gameTotalSetup() {

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
            this.numPlayer = $('#popup').find('input[name="numberplaer"]:checked').val();
            this.arr = [this.numDecks, this.numPlayer];
            return this.arr;
         };

        /** [animateInfoBox - animating output information]
         * @type {Function}
         */
         this.animateInfoBox = function(numCard, numPlayer, totalBet) {
            setTimeout(function() {
                $('#info').children().eq(0).children().eq(0).children('b').text(numCard);
                $('#info').children().eq(0).children().eq(1).children('b').text(numPlayer);
                $('#info').children().eq(0).children().eq(2).children('b').text(totalBet);
                $('#info').children().children().children('b').each(function () {
                    $(this).prop('Counter',0).animate({
                        Counter: $(this).text()
                    }, {
                        duration: $('#decks').children('span').length*135,
                        easing: 'swing',
                        step: function (now) {
                                $(this).text(Math.ceil(now));
                            }
                        });
                    });
            },100);
         };
     };

/** START GAME **/
window.onload = function() {

    /** SECTION DESTINATION OF EVENTS **/

        // game cancellation initialization
        var setupGame = new gameTotalSetup();
        $('button').click(function() {
            setupGame.gameOver();
        });

    /** SECTION TOTAL OBJECT **/

        var newPlayerS = new playerS();

    /** SELECTION OF THE PLAYING CONDITIONS **/

        /* first step :: PopUp I */
        $('form').submit(function() {
            if(numDecks === 0 && numPlayers === 0) {
                numDecks = setupGame.gameContinue()[0];
                numPlayers = setupGame.gameContinue()[1];
            };

            /* second step :: generated PopUp II */
            if(userBet === undefined) {
                newPlayerS.userBet();
                userBet = false;
            };

            $('form').submit(function() {

                userBet = newPlayerS.correctBet();
                newPlayerS.desk = $('#popup').find('input[name="numbertable"]:checked').val();

                if(userBet <= 0 && userBet) {
                    setupGame.gameOver();
                } else if(userBet > 0) {

                    /* third step :: generated virtual players */

                    if(numPlayers > 1) {
                        var allVirtualPlayers = new virtualPlayers(numPlayers, userBet, newPlayerS.desk);
                        if(virtualPlayerArray === undefined) {
                            var virtualPlayerArray = allVirtualPlayers.playerGenerate();
                        };
                        allVirtualPlayers.visualPlayerBett();
                    };

                    /* fourth step :: generated game information */
                    var newCardDeck = new cardDeck(numDecks);
                    var numCards = newCardDeck.addCartShoe(); // 4.1
                    var totalBets = userBet; // 4.4
                    newPlayerS.closeBetForm();
                    setupGame.animateInfoBox(numCards, numPlayers, totalBets); // 4.2, 4.3
                    // 4.5
                    // 4.6
                    // 4.7

                };

            });

            // setupGame.gameOver();
        });
};