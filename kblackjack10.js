//
// K BlackJack 
// ***********
//
// Created by Kevin Thomas and Thoys 02/25/17.
// Modified by Kevin Thomas 05/03/20.
// Apache License, Version 2.0
//
// JavaScript for the High Fidelity interface that provides a BlackJack-style card game.
//
// Playing cards included from Byron Knoll: http://code.google.com/p/vector-playing-cards
//


// set global camera mode so that the avatar upon loading the game goes into 1st person
Camera.mode = "first person";

// set global position values for the card entities in respect to your avatar
const PLAYER_DISTANCE = 2.5;

// set global position values for the card entities in respect to the dealer
const DEALER_DISTANCE = PLAYER_DISTANCE + 2.0;

// set global card horizontal offset
const CARD_HORIZONTAL_OFFSET = 1.25;

// set global entity rotation
const NORMAL_ROTATION = Quat.fromPitchYawRollDegrees(0, 270, 0);

// set global dealer card first entity initial rotation
const FLIP_ROTATION = Quat.fromPitchYawRollDegrees(270, 270, 270);

// set global card path
const CARD_PATH = "https://raw.githubusercontent.com/mytechnotalent/k_blackjack/master/models/";

// set global sound path
const SOUND_PATH = "https://raw.githubusercontent.com/mytechnotalent/k_blackjack/master/sounds/";

// set global deal card texture
const DEAL_TEXTURE = CARD_PATH + "deal.png";

// set global hit me card texture
const HIT_ME_TEXTURE = CARD_PATH + "hitme.png";

// set global stay card texture
const STAY_TEXTURE = CARD_PATH + "stay.png";

// set global you won card texture
const YOU_WON_TEXTURE = CARD_PATH + "youwon.png";

// set global you lost card texture
const YOU_LOST_TEXTURE = CARD_PATH + "youlost.png";

// set global play again texture
const PLAY_AGAIN_TEXTURE = CARD_PATH + "playagain.png";

// set global quit texture
const QUIT_TEXTURE = CARD_PATH + "quit.png";

// create global variables
var dealHandEntity;
var hitMeEntity;
var stayEntity;
var playAgainEntity;
var youLostEntity;
var youWonEntity;
var quitEntity;
var rezzedEntities = [];
var drawnCard;
var cardEntity1;
var cardEntity2;
var cardEntity;
var selection1;
var selection2;
var selection3;
var selection4;
var excludeCard;
var dealerScore = 0;
var playerScore = 0;
var hitAgain = 0;
var newCardPath;
var stackHeight = 0;

// create global card array with JSON objects
var CARDS = [
	{filename: 'ace_of_hearts.png', value: 1, type: "hearts"},
	{filename: '2_of_hearts.png', value: 2, type: "hearts"},
	{filename: '3_of_hearts.png', value: 3, type: "hearts"},
	{filename: '4_of_hearts.png', value: 4, type: "hearts"},
	{filename: '5_of_hearts.png', value: 5, type: "hearts"},
	{filename: '6_of_hearts.png', value: 6, type: "hearts"},
	{filename: '7_of_hearts.png', value: 7, type: "hearts"},
	{filename: '8_of_hearts.png', value: 8, type: "hearts"},
	{filename: '9_of_hearts.png', value: 9, type: "hearts"},
	{filename: '10_of_hearts.png', value: 10, type: "hearts"},
	{filename: 'jack_of_hearts2.png', value: 10, type: "hearts"},
	{filename: 'queen_of_hearts2.png', value: 10, type: "hearts"},
	{filename: 'king_of_hearts2.png', value: 10, type: "hearts"},
	{filename: 'ace_of_diamonds.png', value: 1, type: "diamonds"},
	{filename: '2_of_diamonds.png', value: 2, type: "diamonds"},
	{filename: '3_of_diamonds.png', value: 3, type: "diamonds"},
	{filename: '4_of_diamonds.png', value: 4, type: "diamonds"},
	{filename: '5_of_diamonds.png', value: 5, type: "diamonds"},
	{filename: '6_of_diamonds.png', value: 6, type: "diamonds"},
	{filename: '7_of_diamonds.png', value: 7, type: "diamonds"},
	{filename: '8_of_diamonds.png', value: 8, type: "diamonds"},
	{filename: '9_of_diamonds.png', value: 9, type: "diamonds"},
	{filename: '10_of_diamonds.png', value: 10, type: "diamonds"},
	{filename: 'jack_of_diamonds2.png', value: 10, type: "diamonds"},
	{filename: 'queen_of_diamonds2.png', value: 10, type: "diamonds"},
	{filename: 'king_of_diamonds2.png', value: 10, type: "diamonds"},
	{filename: 'ace_of_clubs.png', value: 1, type: "clubs"},
	{filename: '2_of_clubs.png', value: 2, type: "clubs"},
	{filename: '3_of_clubs.png', value: 3, type: "clubs"},
	{filename: '4_of_clubs.png', value: 4, type: "clubs"},
	{filename: '5_of_clubs.png', value: 5, type: "clubs"},
	{filename: '6_of_clubs.png', value: 6, type: "clubs"},
	{filename: '7_of_clubs.png', value: 7, type: "clubs"},
	{filename: '8_of_clubs.png', value: 8, type: "clubs"},
	{filename: '9_of_clubs.png', value: 9, type: "clubs"},
	{filename: '10_of_clubs.png', value: 10, type: "clubs"},
	{filename: 'jack_of_clubs2.png', value: 10, type: "clubs"},
	{filename: 'queen_of_clubs2.png', value: 10, type: "clubs"},
	{filename: 'king_of_clubs2.png', value: 10, type: "clubs"},
	{filename: 'ace_of_spades.png', value: 1, type: "spades"},
	{filename: '2_of_spades.png', value: 2, type: "spades"},
	{filename: '3_of_spades.png', value: 3, type: "spades"},
	{filename: '4_of_spades.png', value: 4, type: "spades"},
	{filename: '5_of_spades.png', value: 5, type: "spades"},
	{filename: '6_of_spades.png', value: 6, type: "spades"},
	{filename: '7_of_spades.png', value: 7, type: "spades"},
	{filename: '8_of_spades.png', value: 8, type: "spades"},
	{filename: '9_of_spades.png', value: 9, type: "spades"},
	{filename: '10_of_spades.png', value: 10, type: "spades"},
	{filename: 'jack_of_spades2.png', value: 10, type: "spades"},
	{filename: 'queen_of_spades2.png', value: 10, type: "spades"},
	{filename: 'king_of_spades2.png', value: 10, type: "spades"}
];

// set global number of cards variable based on the array length
var NUMBER_OF_CARDS = CARDS.length;

// randomize card number function
function randomCardNumber(){
	return Math.floor(Math.random() * NUMBER_OF_CARDS);
}

// create and init sound entities
var dealHandSound = SoundCache.getSound(SOUND_PATH + "shuffle.wav");
var hitMeSound = SoundCache.getSound(SOUND_PATH + "deal.wav");
var winSound = SoundCache.getSound(SOUND_PATH + "win.wav");
var loseSound = SoundCache.getSound(SOUND_PATH + "lose.wav");

// get card properties function
function getCardProperties(cardNumber, texture, rotation, offset){
	return{
		type: "Model",
		userData: JSON.stringify({grabbableKey:{grabbable:true}}),
		modelURL: CARD_PATH + "kblackjackcard10.fbx",
		dimensions: {x: 1.7249, y: 0.0224, z: 1.0110},
		dynamic: true,
		gravity: {x: 0, y: -1, z: 0},
		velocity: {x: 0, y: -0.1, z: 0},
		textures: JSON.stringify({Card: texture}),
		position: getCardPosition(cardNumber, offset),
		rotation: Quat.multiply(MyAvatar.orientation, rotation),
		ignoreForCollisions: false,
		shapeType: "box",
	};
}

// get card position function
function getCardPosition(cardNumber, offset){
	return Vec3.sum(
		MyAvatar.position,
		Vec3.multiplyQbyV(MyAvatar.orientation, {
			x: - CARD_HORIZONTAL_OFFSET + (cardNumber * CARD_HORIZONTAL_OFFSET) + (stackHeight * 0.1),
			y: 0.0,
			z: - offset
		}
	));
}

// create deal player hand function
function dealPlayerHand(){
	dealHandEntity = Entities.addEntity(getCardProperties(-1, DEAL_TEXTURE, NORMAL_ROTATION, PLAYER_DISTANCE));
}

// create hit me function
function hitMe(){
	hitMeEntity = Entities.addEntity(getCardProperties(-1, HIT_ME_TEXTURE, NORMAL_ROTATION, PLAYER_DISTANCE));
}

// create stay function
function stay(){
	stayEntity = Entities.addEntity(getCardProperties(0, STAY_TEXTURE, NORMAL_ROTATION, PLAYER_DISTANCE));
}

// create you won function
function youWon(){
	youWonEntity = Entities.addEntity(getCardProperties(0, YOU_WON_TEXTURE, NORMAL_ROTATION, DEALER_DISTANCE));
	playGameSound(winSound);
}

// create you lost function
function youLost(){
	youLostEntity = Entities.addEntity(getCardProperties(0, YOU_LOST_TEXTURE, NORMAL_ROTATION, DEALER_DISTANCE));
	playGameSound(loseSound);
}

// create check play again function
function checkPlayAgain(){
	playAgainEntity = Entities.addEntity(getCardProperties(-1, PLAY_AGAIN_TEXTURE, NORMAL_ROTATION, PLAYER_DISTANCE));
}

// create check quit function
function checkQuit(){
	quitEntity = Entities.addEntity(getCardProperties(0, QUIT_TEXTURE, NORMAL_ROTATION, PLAYER_DISTANCE));
}

// delete game cards from world before the deal of each game
function deleteCardsBeforeDealOrExit(){
	rezzedEntities.forEach(function(entity){
		Entities.deleteEntity(entity);
	});
	Entities.deleteEntity(dealHandEntity);
	Entities.deleteEntity(hitMeEntity);
	Entities.deleteEntity(stayEntity);
	if(youLostEntity){
		Entities.deleteEntity(youLostEntity);
	}
	if(youWonEntity){
		Entities.deleteEntity(youWonEntity);
	}
	Entities.deleteEntity(playAgainEntity); 
	Entities.deleteEntity(quitEntity); 
}

// delete game cards from world after the deal of each game
function deleteCardsAfterDeal(){
	Entities.deleteEntity(dealHandEntity);
}

// delete game cards from world if hit me selected
function deleteCardsIfHitMe(){
	Entities.deleteEntity(stayEntity);
}

// delete game cards from world if stay selected
function deleteCardsIfStay(){
	Entities.deleteEntity(hitMeEntity);
}

// delete game cards from world if end of game
function deleteCardsIfEndOfGame(){
	Entities.deleteEntity(hitMeEntity);
	Entities.deleteEntity(stayEntity);
}

// draw card function
function drawCard(gameSound, cardNumber, rotation, offset){
	var selection = 0;
	do{
		selection = randomCardNumber();
	} while(selection == excludeCard);
	playGameSound(gameSound);
	newCardPath = CARD_PATH + CARDS[selection].filename;
	cardEntity = Entities.addEntity(getCardProperties(cardNumber, newCardPath, rotation, offset));
	rezzedEntities.push(cardEntity);
	return{entity: cardEntity, number: selection};
}

// create play game sound function
function playGameSound(gameSound){
	return Audio.playSound(gameSound,{
		position: getCardPosition(0),
		volume: 10,
		loop: false
	});
}

// create check player score on deal function
function checkPlayerScoreOnDeal(firstSelection){
	print(CARDS[firstSelection].value);
	playerScore = CARDS[firstSelection].value;
}

// create check player score on hit function
function checkPlayerScoreOnHit(secondSelection){
	print(CARDS[secondSelection].value);
	playerScore += CARDS[secondSelection].value;
	return playerScore;
}

// create check dealer score function
function checkDealerScore(firstSelection, secondSelection){
	print(CARDS[firstSelection].value);
	dealerScore = CARDS[firstSelection].value + CARDS[secondSelection].value;
}

// create final score function
function finalScore(){
	if(dealerScore > 21){
		Entities.editEntity(cardEntity1, {rotation: NORMAL_ROTATION});
		youWon();
	} else if(playerScore > 21){
		Entities.editEntity(cardEntity1, {rotation: NORMAL_ROTATION});
		youLost();
	} else if(dealerScore < playerScore){
		Entities.editEntity(cardEntity1, {rotation: NORMAL_ROTATION});
		youWon();
	} else{
		Entities.editEntity(cardEntity1, {rotation: NORMAL_ROTATION});
		youLost();
	}
	checkPlayAgain();
	checkQuit();
}
  
// create playAgain function
function playAgain(){
	deleteCardsBeforeDealOrExit();
	dealPlayerHand();
}

// create quit function
function quit(){
	Script.stop();
}

// run function at runtime
dealPlayerHand();

// mouse PlayGame event triggering randomize logic and placement of card logic
Entities.clickReleaseOnEntity.connect(function(entityID, mouseEvent){ 
	if(dealHandEntity == entityID){
		deleteCardsBeforeDealOrExit();
		drawnCard = drawCard(dealHandSound, 1, NORMAL_ROTATION, PLAYER_DISTANCE);
		selection1 = drawnCard.number;
		cardEntity1 = drawnCard.entity;
		drawnCard = drawCard(dealHandSound, 1, FLIP_ROTATION, DEALER_DISTANCE);
		selection3 = drawnCard.number;
		cardEntity1 = drawnCard.entity;
		drawnCard = drawCard(dealHandSound, 2, NORMAL_ROTATION, DEALER_DISTANCE);
		selection4 = drawnCard.number;
		cardEntity2 = drawnCard.entity;
		deleteCardsAfterDeal();
		hitMe();
		stay();
		checkPlayerScoreOnDeal(selection1, selection2);
		print("Player Score:  " + playerScore);
		checkDealerScore(selection3, selection4);
		print("Dealer Score:  " + dealerScore);
	}
	if(hitMeEntity == entityID){
		deleteCardsIfHitMe();
		drawnCard = drawCard(hitMeSound, 2, NORMAL_ROTATION, PLAYER_DISTANCE);
		selection2 = drawnCard.number;
		cardEntity2 = drawnCard.entity;
		stackHeight++;
		hitAgain = checkPlayerScoreOnHit(selection2);
		print("Player Score:  " + playerScore);
		print("Dealer Score:  " + dealerScore);
		if(hitAgain <= 21){
			deleteCardsIfStay();
			hitMe();
			stay();
		} else{
			deleteCardsIfEndOfGame();
			finalScore();
		}
	}
	if(stayEntity == entityID){
		deleteCardsIfStay();
		print("Player Score:  " + playerScore);
		print("Dealer Score:  " + dealerScore);
		deleteCardsIfEndOfGame();
		finalScore();
	}
	if(playAgainEntity == entityID){
		playAgain();
	}
	if(quitEntity == entityID){
		quit();
	}
});

// delete cards when exiting script
Script.scriptEnding.connect(deleteCardsBeforeDealOrExit);