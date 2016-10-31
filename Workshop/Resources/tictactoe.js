//tictactoe.js
//Shallow Blue
//File created 9.5.2016
//Last modified: 10.15.2016
//Define global variable that will store the GUI instance object
var screen;
//Define global variable that will store the Match object instance
var mc;
//Define global variable that will store the MemoryController object
var mem;
//Define global variable that will store the GameBoard instance object
var gb;

//Define global variables that will stores references to the two Player objects
var p1;
var p2;


//Define the GUI boundary class
var GUI = function()
{
	//Grab the elements on the HTML document and store them in the instance variables
	this.mainMenu = document.getElementById("mainMenu");
	this.matchMode = document.getElementById("matchMode");
	this.player1_options = document.getElementById("player1_options");
	this.guestBox1 = document.getElementById("guestBox1");
	this.register1 = document.getElementById("register1");
	this.newName1 = document.getElementById("newName1");
	this.existingPlayer1 = document.getElementById("existingPlayer1");
	this.existingSelect1 = document.getElementById("existingSelect1");
	this.difficulty_options = document.getElementById("difficulty_options");
	this.difficulty = document.getElementById("difficulty");
	this.player2_options = document.getElementById("player2_options");
	this.guestBox2 = document.getElementById("guestBox2");
	this.register2 = document.getElementById("register2");
	this.newName2 = document.getElementById("newName2");
	this.existingPlayer2 = document.getElementById("existingPlayer2");
	this.existingSelect2 = document.getElementById("existingSelect2");
	this.startMatch = document.getElementById("startMatch");
	this.gamepiece = document.getElementById("gamepiece");
	this.redButton = document.getElementById("redButton");
	this.greenButton = document.getElementById("greenButton");
	this.feedback = document.getElementById("feedback");
	this.turnLabel = document.getElementById("turnLabel");
	this.gameboard = document.getElementById("gameboard");
	this.quit = document.getElementById("quit");
	this.player1Record = document.getElementById("player1Record");
	this.player2Record = document.getElementById("player2Record");
	
	var that = this;//store reference to the GUI object for use in event handlers
	//Define methods for GUI boundary class
	
	//Method for switching visibility of vs. Computer and vs. Player setting
	this.toggleGameOptions = function(val)
	{	
		switch(val){
			case "1"://Player vs. Computer is selected
				this.difficulty_options.style.display = "inline";
				this.player2_options.style.display = "none";
				break;
			case "2"://Player vs. Player is selected
				this.difficulty_options.style.display = "none";
				this.player2_options.style.display = "inline";
				break;
		}
	}
	
	//Method that fires when request to Start Match is received that hides the main menu
	this.hideMainMenu = function()
	{	
		this.mainMenu.style.visibility = "hidden";
		this.player1Record.innerHTML = "";//clear the record for player 1
		this.player2Record.innerHTML = "";//clear the record for player 2
	}
	
	//Method that fires when request to show the main menu again is received
	this.showMainMenu = function()
	{
		this.mainMenu.style.visibility = "visible";
		this.mainMenu.scrollIntoView();//scroll the screen up to the Main Menu
		
	}
	
	//Method that fires when a request is received to show the game piece selection menu
	this.showGamePiece = function()
	{
		this.gamepiece.style.visibility = "visible";
	}
	
	//Method that fires when a request is received to hide the game piece selection menu
	this.hideGamePiece = function()
	{
		this.gamepiece.style.visibility = "hidden";
	}
	
	//Method that fires when a request is received to show the game board on the screen
	this.showGameBoard = function()
	{
		this.gameboard.style.visibility = "visible";
		this.quit.style.visibility = "visible";//Make the quit button visible
		this.gameboard.scrollIntoView();//Scroll down to the game board
	}
	
	//Method that fires when a request is received to hide the game board on the screen
	this.hideGameBoard = function()
	{
		this.gameboard.style.visibility = "hidden";
		this.quit.style.visibility = "hidden";//Hide the quit button as well
	}
	//Event that fires whenever user switches between Player vs. Computer and Player vs. Player
	this.matchMode.onchange = function()
	{	
		that.toggleGameOptions(this.value);//Toggle the Player 2/Computer setting choices
		
	}
	
	//Event handler that fires when user clicks "Start Match"
	this.startMatch.onclick = function()
	{
		that.hideMainMenu();//Hide the main menu
		that.showGamePiece();//Show the menu for selecting the game pieces
	}
	
	//Event handler that fires when user clicks the Red Apple Game Piece Selection Button.
	//As a result of this click, the game piece selection menu is hidden and the game board is displayed
	this.redButton.onclick = function()
	{
		that.hideGamePiece();//Hide the game piece selection menu
		that.showGameBoard();//Display the tic-tac-toe game board
		
		var player1Name;//Will store the name for the first Player object
		var player1ID;//Will store the ID for the first Player object
		
		if(that.guestBox1.checked)//Is the first user opting to play as a Guest?
		{
			player1Name = "Player 1";
			player1ID = 1;//Default ID for a Guest
		}
		else if (that.register1.checked)//Is the first user opting to register a new name?
		{
			player1Name = that.newName1.value;
			player1ID = mem.addUser(player1Name);
		}
		else{//Otherwise, they're using an existing account name
			player1Name = that.existingSelect1.options[that.existingSelect1.selectedIndex].text;
			player1ID = that.existingSelect1.options[that.existingSelect1.selectedIndex].value;
			
		}
		
		var player2Name;//Will store the name for the second Player object
		var player2ID;//Will store the ID for the second Player object
		var matchDifficulty = "none";//This will be changed if it is a vs. Computer match
		
		//Has user chosen to play against the computer?
		if (that.matchMode.value == 1)
		{
			player2Name = "Computer";
			player2ID = 0;
			matchDifficulty = that.difficulty.value;
		}//End if for Player vs. Computer.
		else{//Or did they choose to play against another human user?
		if(that.guestBox2.checked)//Player 2 is playing as guest
		{
			player2Name = "Player 2";
			player2ID = 1;
		}
		else if (that.register2.checked) //Player 2 is player as a new player
		{
			player2Name = that.newName2.value;
			player2ID = mem.addUser(player2Name);
		}
		else{ //Player 2 is playing as an already registered user
			player2Name = that.existingSelect2.options[that.existingSelect2.selectedIndex].text;
			player2ID = that.existingSelect2.value;
			
		}
		}//End if for Player vs. Player
		p1 = new Player(player1ID, player1Name, "red");
		p2 = new Player(player2ID, player2Name, "green");
		
		
		//Clear any textboxes, if need be
		that.newName1.value = "";
		that.newName2.value = "";
		
		//Create a new match and have the MatchController object reference it
		mc = new Match(p1, p2, gb, matchDifficulty);
		
		
	}
	
	//Event handler that fires when user clicks the Green Apple Game Piece Selection Button.
	//As a result of this click, the game piece selection menu is hidden and the game board is displayed
	this.greenButton.onclick = function()
	{
		that.hideGamePiece();//Hide the game piece selection menu
		that.showGameBoard();//Show the tic-tac-toe game board on screen
		
		var player1Name;//Will store the name for the first Player object
		var player1ID;//Will store the ID for the first Player object
		
		if(that.guestBox1.checked)//Player 1 is choosing to play as a Guest
		{
			player1Name = "Player 1";
			player1ID = 1;
		}
		else if (that.register1.checked)//Player 1 is registering under a new name
		{
			player1Name = that.newName1.value;
			player1ID = mem.addUser(player1Name);
		}
		else{//Player 1 is playing under an existing account name
			player1Name = that.existingSelect1.options[that.existingSelect1.selectedIndex].text;
			player1ID = that.existingSelect1.options[that.existingSelect1.selectedIndex].value;
			
		}
		
		var player2Name;//Will store the name for the second Player object
		var player2ID;//Will store the ID for the second Player object
		var matchDifficulty = "none";//This will be changed if vs. Computer was selected
		
		//Has user chosen to play against the computer?
		if (that.matchMode.value == 1)
		{
			player2Name = "Computer";
			player2ID = 0;
			matchDifficulty = that.difficulty.value;
		}//End if for Player vs. Computer.
		else{//Or did they choose to play against another human user?
		if(that.guestBox2.checked)//Player 2 is playing as guest
		{
			player2Name = "Player 2";
			player2ID = 1;
		}
		else if (that.register2.checked) //Player 2 is player as a new player
		{
			player2Name = that.newName2.value;
			player2ID = mem.addUser(player2Name);
		}
		else{ //Player 2 is playing as an already registered user
			player2Name = that.existingSelect2.options[that.existingSelect2.selectedIndex].text;
			player2ID = that.existingSelect2.value;
			
		}
		}//End if for Player vs. Player
		p1 = new Player(player1ID, player1Name, "green");
		p2 = new Player(player2ID, player2Name, "red");
		
		//Clear any textboxes, if need be
		that.newName1.value = "";
		that.newName2.value = "";
		
		//create a new Match and have the MatchController reference it
		mc = new Match(p1, p2, gb, matchDifficulty);
	}
	
	//Event handler for checking and unchecking the "Play as Guest" option for Player 1
	this.guestBox1.onchange = function()
	{
		if(this.checked)//Did a user just check "Play as Guest"?
		{	//We need to uncheck the other Player 1 checkboxes.
			that.register1.checked = false;
			that.existingPlayer1.checked = false;
			that.newName1.value = "";
		}//if not, and no other checkboxes are checked, default to register
		else if (!that.register1.checked && !that.existingPlayer1.checked)
			that.register1.checked = true;
		//validate the options selected thus far to enable/disable the button
		that.validateOptions();
	}
	
	//Event handler for checking and unchecking the "Play as Guest" option for Player 2
	this.guestBox2.onchange = function()
	{
		if(this.checked)
		{	//We need to uncheck the other Player 2 checkboxes.
			that.register2.checked = false;
			that.existingPlayer2.checked = false;
			that.newName2.value = "";
		}
		else if (!that.register2.checked && !that.existingPlayer2.checked)
			that.register2.checked = true;
		//validate the options selected thus far to enable/disable the button	
		that.validateOptions();
	}
	
	//Event handler for checking and unchecking the "Register Name:" option for Player 1
	this.register1.onchange = function()
	{
		if(this.checked)
		{	//We need to uncheck the other Player 1 checkboxes.
			that.guestBox1.checked = false;
			that.existingPlayer1.checked = false;
			
		}
		else if (!that.guestBox1.checked && !that.existingPlayer1.checked)
			that.guestBox1.checked = true;
		
		that.validateOptions();
	}
	
	//Event handler for checking and unchecking the "Register Name:" option for Player 2
	this.register2.onchange = function()
	{
		if(this.checked)
		{	//We need to uncheck the other Player 2 checkboxes.
			that.guestBox2.checked = false;
			that.existingPlayer2.checked = false;
			
		}
		else if (!that.guestBox2.checked && !that.existingPlayer2.checked)
			that.guestBox2.checked = true;
			
		that.validateOptions();
	}
	
	//Event handler for checking and unchecking the "Existing Account" option for Player 1
	this.existingPlayer1.onchange = function()
	{
		if(this.checked)
		{	//We need to uncheck the other Player 1 checkboxes.
			that.guestBox1.checked = false;
			that.register1.checked = false;
			//Show the win-loss-tie record for selected User
			that.player1Record.innerHTML = mem.requestData(that.existingSelect1.value);
		}
		else if (!that.guestBox1.checked && !that.register1.checked)
			that.guestBox1.checked = true;
		
		that.validateOptions();
	}
	
	//Event handler for text change event for the text input for Player 1
	this.newName1.onchange = function()
	{
		that.validateOptions();
	
	}
	//Event handler for text change event for the text input for Player 2
	this.newName2.onchange = function()
	{
		that.validateOptions();
	
	}
	
	//Event handler for text change event for the select input for Player 1
	this.existingSelect1.onchange = function()
	{	that.player1Record.innerHTML = mem.requestData(this.value);
		that.validateOptions();
	
	}
	//Event handler for text change event for the select input for Player 2
	this.existingSelect2.onchange = function()
	{	that.player2Record.innerHTML = mem.requestData(this.value);
		that.validateOptions();
	
	}
	
	//Event handler for checking and unchecking the "Existing Account" option for Player 2
	this.existingPlayer2.onchange = function()
	{
		if(this.checked)
		{	//We need to uncheck the other Player 2 checkboxes.
			that.guestBox2.checked = false;
			that.register2.checked = false;
			//Show the win-loss-tie record for selected User
			that.player2Record.innerHTML = mem.requestData(that.existingSelect2.value);
		}
		else if (!that.guestBox2.checked && !that.register2.checked)
			that.guestBox2.checked = true;
		
		that.validateOptions();
	}
	
	//Method that runs every time a checkbox or text input is changed to enable/disable the "Start Match" button
	this.validateOptions = function()
	{
		var valid = false;//Boolean to keep track of valid/invalid credentials
		
		//Check the Player 1 fields for valid selections
		if (this.guestBox1.checked == true)
			valid = true;
		else if (this.register1.checked == true)
			{
				if (/^[a-zA-Z()]+$/.test(this.newName1.value))
					valid = true; 
			}
		else if (existingPlayer1.checked == true)
			valid = true;
		
		if (this.matchMode.value == 1)//Player vs. Computer? If so, we only need to check Player 1 options
		{
			if (valid)
				this.startMatch.disabled = false;//Enable the "Start Match" button
			else
				this.startMatch.disabled = true;//Disable the "Start Match" button
		}
		else//Otherwise, it's Player vs. Player so we need to check the Player 2 options too
		{
			if(!valid)
				this.startMatch.disabled = true;//Since Player 1 was invalid, the whole thing is
			else{
			
				valid = false; //Again, assume invalid before iterating through
				
				//Check the Player 2 fields for valid selections
				if (this.guestBox2.checked == true)
				valid = true;
				else if (this.register2.checked == true)
				{
				if (/^[a-zA-Z()]+$/.test(this.newName2.value))
					valid = true; 
				}
				else if (existingPlayer2.checked == true)
					valid = true;
				
				if(valid)
					this.startMatch.disabled = false;
				else
					this.startMatch.disabled = true;
				}
				//Finally, check if both players chose the same registered user
				if(this.existingPlayer1.checked == true && this.existingPlayer2.checked == true && (this.existingSelect1.selectedIndex == this.existingSelect2.selectedIndex))
				{	
					alert("Both players cannot use same registered account");
					this.startMatch.disabled = true;
				}
		}
		
	}//end validateOptions() method
	
	//Receives message to update the prompt for the label that shows whose turn it is
	this.showPrompt = function(message)
	{
		that.turnLabel.innerHTML = message;
		
	}
	
	//Ask the user if they wish to play another match with the same settings
	this.playAgain = function()
	{
		var difficulty = mc.getDifficulty();
		
		var again = confirm("Play again with the same settings?");
		
		if (again)
		{
			//Clear the Game Board of its game pieces
			GameBoardController.clearBoard(gb);
			//Grab new reference to the board
			gb = new GameBoard(GameBoardController.generateBoard());
			//Initiate a new match
			mc = new Match(p1, p2, gb, difficulty);
			
			
			this.showPrompt(mc.getActivePlayer().getName() + "'s turn");
		
		}
		else{
			//Clear the Board of its game pieces
			GameBoardController.clearBoard(gb);
			//Grab new reference to the board
			gb = new GameBoard(GameBoardController.generateBoard());
			//Hide the game board
			this.hideGameBoard();
			//Show the main menu
			this.showMainMenu();
			this.showPrompt("");//clear the label for whose turn it is
		}
	}
	
	//Method called to pause the display for a given number of milliseconds
	this.sleep = function(m) {
  			var start = new Date().getTime();
  			for (var i = 0; i < 1e7; i++) {
    		if ((new Date().getTime() - start) > m){
      			break;
    			}
  			}
	}	
	
	//Method called when a user clicks the "Quit" button
	this.quit.onclick = function()
	{
		var endGame = confirm("Are you sure you want to quit? It will be recorded as a loss for " + mc.getActivePlayer().getName() + ".");
		
		if (endGame)
			that.playAgain();
	}
}//End GUI class


//Define the global GameBoardController Control class object
var GameBoardController = {
	//Utility methods
	
	//Receive a 2D array of Square objects and return an array of Diagonals
	getDiagonals: function(square_array)
	{
		var diagonals = [];
		var temp = [];
		
		temp.push(square_array[1][0]);
		temp.push(square_array[2][1]);
		temp.push(square_array[3][2]);
		temp.push(square_array[4][3]);
		
		var diagonal1 = new Diagonal(temp);
		
		temp = [];
		
		temp.push(square_array[0][0]);
		temp.push(square_array[1][1]);
		temp.push(square_array[2][2]);
		temp.push(square_array[3][3]);
		temp.push(square_array[4][4]);
		
		var diagonal2 = new Diagonal(temp);
		
		temp = [];
		
		temp.push(square_array[0][1]);
		temp.push(square_array[1][2]);
		temp.push(square_array[2][3]);
		temp.push(square_array[3][4]);
		
		var diagonal3 = new Diagonal(temp);
		
		temp = [];
		
		temp.push(square_array[0][3]);
		temp.push(square_array[1][2]);
		temp.push(square_array[2][1]);
		temp.push(square_array[3][0]);
		
		var diagonal4 = new Diagonal(temp);
		
		temp = [];
		
		temp.push(square_array[0][4]);
		temp.push(square_array[1][3]);
		temp.push(square_array[2][2]);
		temp.push(square_array[3][1]);
		temp.push(square_array[4][0]);
		
		var diagonal5 = new Diagonal(temp);
		
		var temp = [];
		
		temp.push(square_array[1][4]);
		temp.push(square_array[2][3]);
		temp.push(square_array[3][2]);
		temp.push(square_array[4][1]);
		
		var diagonal6 = new Diagonal(temp);
		
		diagonals.push(diagonal1);
		diagonals.push(diagonal2);
		diagonals.push(diagonal3);
		diagonals.push(diagonal4);
		diagonals.push(diagonal5);
		diagonals.push(diagonal6);
		
		return diagonals;
	},
	
	//Method for generating the squares on the board used to create the GameBoard object
	generateBoard: function()
	{
		//Grab a reference to all the squares on the GUI game board display
	
	//Set up Row 1
	var r1c1 = document.getElementById("r1c1");
	var r1c1square = new Square(r1c1);
	
	var r1c2 = document.getElementById("r1c2");
	var r1c2square = new Square(r1c2);
	
	var r1c3 = document.getElementById("r1c3");
	var r1c3square = new Square(r1c3);
	
	var r1c4 = document.getElementById("r1c4");
	var r1c4square = new Square(r1c4);
	
	var r1c5 = document.getElementById("r1c5");
	var r1c5square = new Square(r1c5);
	
	var row1_squares = [r1c1square, r1c2square, r1c3square, r1c4square, r1c5square];
	
	
	//Set up Row 2
	var r2c1 = document.getElementById("r2c1");
	var r2c1square = new Square(r2c1);
	
	var r2c2 = document.getElementById("r2c2");
	var r2c2square = new Square(r2c2);
	
	var r2c3 = document.getElementById("r2c3");
	var r2c3square = new Square(r2c3);
	
	var r2c4 = document.getElementById("r2c4");
	var r2c4square = new Square(r2c4);
	
	var r2c5 = document.getElementById("r2c5");
	var r2c5square = new Square(r2c5);
	
	var row2_squares = [r2c1square, r2c2square, r2c3square, r2c4square, r2c5square];
	
	
	//Set up Row 3
	var r3c1 = document.getElementById("r3c1");
	var r3c1square = new Square(r3c1);
	
	var r3c2 = document.getElementById("r3c2");
	var r3c2square = new Square(r3c2);
	
	var r3c3 = document.getElementById("r3c3");
	var r3c3square = new Square(r3c3);
	
	var r3c4 = document.getElementById("r3c4");
	var r3c4square = new Square(r3c4);
	
	var r3c5 = document.getElementById("r3c5");
	var r3c5square = new Square(r3c5);
	
	var row3_squares = [r3c1square, r3c2square, r3c3square, r3c4square, r3c5square];
	
	
	//Set up Row 4
	var r4c1 = document.getElementById("r4c1");
	var r4c1square = new Square(r4c1);
	
	var r4c2 = document.getElementById("r4c2");
	var r4c2square = new Square(r4c2);
	
	var r4c3 = document.getElementById("r4c3");
	var r4c3square = new Square(r4c3);
	
	var r4c4 = document.getElementById("r4c4");
	var r4c4square = new Square(r4c4);
	
	var r4c5 = document.getElementById("r4c5");
	var r4c5square = new Square(r4c5);
	
	var row4_squares = [r4c1square, r4c2square, r4c3square, r4c4square, r4c5square];
	
	
	//Set up Row 5
	var r5c1 = document.getElementById("r5c1");
	var r5c1square = new Square(r5c1);
	
	var r5c2 = document.getElementById("r5c2");
	var r5c2square = new Square(r5c2);
	
	var r5c3 = document.getElementById("r5c3");
	var r5c3square = new Square(r5c3);
	
	var r5c4 = document.getElementById("r5c4");
	var r5c4square = new Square(r5c4);
	
	var r5c5 = document.getElementById("r5c5");
	var r5c5square = new Square(r5c5);
	
	var row5_squares = [r5c1square, r5c2square, r5c3square, r5c4square, r5c5square];
	
	//Set up 2D array for creating the GameBoard object
	var board_squares = [row1_squares, row2_squares, row3_squares, row4_squares, row5_squares];
	
	return board_squares;
	},
	//This method takes a GameBoard object as its parameter and disables the click event for all squares in it
	disableBoard: function(board)
	{	
		for (var i = 0; i < board.rows.length; i++)
		{
			for (var j = 0; j < board.rows[i].squares.length; j++)
				board.rows[i].squares[j].disableClick();
		
		}
	
	},
	clearBoard: function(board)
	{
		for (var i = 0; i < board.rows.length; i++)
		{
			for (var j = 0; j < board.rows[i].squares.length; j++)
				board.rows[i].squares[j].clearSquare();
		}
	
	},
	//Method for AI to make a move on the board when it is the computer's turn
	makeMove: function(board)
	{	
		var availableSquares = [];//array that will store the available squares not yet claimed
		for (var i = 0; i < board.rows.length; i++)
		{
			for (var j = 0; j < board.rows[i].squares.length; j++)
			{
				if (!board.rows[i].squares[j].isOccupied())
					availableSquares.push(board.rows[i].squares[j])
			}
		}
		//Choose a random square that hasn't been selected
		var randomIndex = Math.floor(Math.random() * (availableSquares.length));
		var chosenSquare = availableSquares[randomIndex];
		//Perform the onclick event for that square
		
		chosenSquare.ref.onclick.apply(chosenSquare.ref);
	}
};//End GameBoardController class

//Define the Square object, which represents a square on the game board
var Square = function (td){
	
	//instance variables
	var that = this;//store reference to the square object for use in event handlers
	this.ref = td;//Store reference to a <td> element in HTML
	this.player = null;//Will store reference to player who has claimed the Square
	
	//methods
	
	//getter method for the player instance variable
	this.getPlayer = function(){
		
		return this.player; 
	
	}
	//setter method for the player instance variable
	this.setPlayer = function (p) {
	
		this.player = p;
		
	}
	//Boolean for whether or not the Square is taken
	this.isOccupied = function () {
	
		if (this.player == null)
			return false;
		else
			return true;
	
	}
	//Event handler for when a Square is clicked on the screen
	this.ref.onclick = function (){
		//Disallow the Square from being clicked again
		this.onclick = null;
		//Set the color of the background to show active player's game piece
		if(mc.getActivePlayer().getColor() == 'red')
			this.style.backgroundImage = "url('red.jpg')";
		else
			this.style.backgroundImage = "url('green.jpg')";
		//set the player who has claimed the square
		that.setPlayer(mc.getActivePlayer());
		//Run the algorithm to check if there is a winner or tie
		
		mc.processClick();
		
			
	}
	
	//Method that disables the onclick event for a Square at the end of a Match
	this.disableClick = function(){
		
		this.ref.onclick = null;
	}
	
	//Method that clears the background image for a Square at the start of a new Match
	this.clearSquare = function(){
		this.ref.style.backgroundImage = "none";
		this.player = null; //remove the reference to a Player
	}
}//End Square class

//Define the class to represent a Player in a match
var Player = function (id, player_name, player_color) {
	//instance variables
	this.userID = id; //Every player has a unique ID
	this.name = player_name; //Name of the player
	this.color = player_color;//Stores the color game piece that they have selected
	
	//methods
	//Return the unique ID for the Player
	this.getID = function() {
		return this.userID;
	}
	//Setter for the ID attribute
	this.setID = function(id){
		this.userID = id;
	}
	//Getter method for the Player's name
	this.getName = function() {
		return this.name;
	}
	//Setter method for the Player's name
	this.setName = function(player_name){
	
		this.name = player_name;
	}
	//Return the color game piece the Player selected
	this.getColor = function(){
		return this.color;
	}
	//Setter method for the color
	this.setColor = function(player_color){
		return this.color;
	}
}//End class Player

//Define the Row class, which represents a Row of Squares on a GameBoard
var Row = function(square_array){//Parameter: an array of type Square

	//instance variable
	this.squares = [];
	//populate the instance variables with Square objects:
	
	for (var i = 0; i < square_array.length; i++)
		this.squares.push(square_array[i]);
	
	//methods
	//hasWinner() checks to see if this Row contains a winner
	this.hasWinner = function(){
		//First check to see if Squares 0 - 3 have the same Player
		if (this.squares[0].isOccupied() &&
			this.squares[1].isOccupied() &&
			this.squares[2].isOccupied() &&
			this.squares[3].isOccupied())
		{
			if (
				(this.squares[0].getPlayer()
				== this.squares[1].getPlayer()) &&
				(this.squares[0].getPlayer()
				== this.squares[2].getPlayer()) &&
				(this.squares[0].getPlayer()
				== this.squares[3].getPlayer()) 
				)
			return true;
		}
		//If that doesn't work, try Squares 1 - 4:
		if (this.squares[1].isOccupied() &&
			this.squares[2].isOccupied() &&
			this.squares[3].isOccupied() &&
			this.squares[4].isOccupied())
		{
			if (
				(this.squares[1].getPlayer()
				== this.squares[2].getPlayer()) &&
				(this.squares[1].getPlayer()
				== this.squares[3].getPlayer()) &&
				(this.squares[1].getPlayer()
				== this.squares[4].getPlayer()) 
				)
			return true;
		}
		//Otherwise, return false
		return false;
	}
	//isFull() returns a Boolean for whether or not all Squares in the Row are taken by a Player
	this.isFull = function (){
		return (this.squares[0].isOccupied() & this.squares[1].isOccupied() & this.squares[2].isOccupied() & this.squares[3].isOccupied())
		
	}	
}//End Row Class

//Define class Column, representing a Column on a GameBoard
//This class follows a similar implementation as the Row class
var Column = function(square_array){//Parameter: an array of type Square

	//instance variable
	this.squares = [];
	//populate the instance variables with Square objects:
	
	for (var i = 0; i < square_array.length; i++)
		this.squares.push(square_array[i]);
	
	//methods
	//hasWinner() checks to see if this Column contains a winner
	this.hasWinner = function(){
		//First check to see if Squares 0 - 3 have the same Player
		if (this.squares[0].isOccupied() &&
			this.squares[1].isOccupied() &&
			this.squares[2].isOccupied() &&
			this.squares[3].isOccupied())
		{
			if (
				(this.squares[0].getPlayer()
				== this.squares[1].getPlayer()) &&
				(this.squares[0].getPlayer()
				== this.squares[2].getPlayer()) &&
				(this.squares[0].getPlayer()
				== this.squares[3].getPlayer()) 
				)
			return true;
		}
		//If that doesn't work, try Squares 1 - 4:
		if (this.squares[1].isOccupied() &&
			this.squares[2].isOccupied() &&
			this.squares[3].isOccupied() &&
			this.squares[4].isOccupied())
		{
			if (
				(this.squares[1].getPlayer()
				== this.squares[2].getPlayer()) &&
				(this.squares[1].getPlayer()
				== this.squares[3].getPlayer()) &&
				(this.squares[1].getPlayer()
				== this.squares[4].getPlayer()) 
				)
			return true;
		}
		//Otherwise, return false
		return false;
	}
	//isFull() returns a Boolean for whether or not all Squares in the Column are taken by a Player
	this.isFull = function (){
		return (this.squares[0].isOccupied() & this.squares[1].isOccupied() & this.squares[2].isOccupied() & this.squares[3].isOccupied())
		
	}	
}//End Column Class

//Define the Diagonal class that represents a Diagonal along a GameBoard
var Diagonal = function(square_array)
{
	//instance variable
	this.squares = [];
	
	//populate the array instance variable with squares:
	for (var i = 0; i < square_array.length; i++)
		this.squares.push(square_array[i]);
	
	//hasWinner() checks to see if this Diagonal contains a winner
	this.hasWinner = function()
	{  //Diagonals can have 4 OR 5 Squares, unlike a Row or Column
	  if(this.squares.length == 5){
		//First check to see if Squares 0 - 3 have the same Player
		if (this.squares[0].isOccupied() &&
			this.squares[1].isOccupied() &&
			this.squares[2].isOccupied() &&
			this.squares[3].isOccupied())
		{
			if (
				(this.squares[0].getPlayer()
				== this.squares[1].getPlayer()) &&
				(this.squares[0].getPlayer()
				== this.squares[2].getPlayer()) &&
				(this.squares[0].getPlayer()
				== this.squares[3].getPlayer()) 
				)
			return true;
		}
		//If that doesn't work, try Squares 1 - 4:
		if (this.squares[1].isOccupied() &&
			this.squares[2].isOccupied() &&
			this.squares[3].isOccupied() &&
			this.squares[4].isOccupied())
		{
			if (
				(this.squares[1].getPlayer()
				== this.squares[2].getPlayer()) &&
				(this.squares[1].getPlayer()
				== this.squares[3].getPlayer()) &&
				(this.squares[1].getPlayer()
				== this.squares[4].getPlayer()) 
				)
			return true;
		}
		//Otherwise, return false
		return false;
	}//End if for Diagonal length of 5
	else//Otherwise, Diagonal has length of 4
	{
		if (this.squares[0].isOccupied() &&
			this.squares[1].isOccupied() &&
			this.squares[2].isOccupied() &&
			this.squares[3].isOccupied())
		{
			if (
				(this.squares[0].getPlayer()
				== this.squares[1].getPlayer()) &&
				(this.squares[0].getPlayer()
				== this.squares[2].getPlayer()) &&
				(this.squares[0].getPlayer()
				== this.squares[3].getPlayer()) 
				)
			return true;
		}
		
		return false;//Otherwise, return false
	}
	}//End Diagonal.hasWinner() method
	

}//End Diagonal Class

//Define the GameBoard class
var GameBoard = function(arr)
{
	//Set the instance variables
	this.rows = [];
	
	for (var row = 0; row < arr.length; row++)
	{
		var newRow = [];
		
		for (var col = 0; col < arr[row].length; col++)
		{
			newRow.push(arr[row][col]);
		}
		
		this.rows.push(new Row(newRow));
	
	}
	
	this.columns = [];
	
	for (var col = 0; col < arr[0].length; col++)
	{
		var newCol = [];
		
		for (var row = 0; row < arr.length; row++)
		{
			newCol.push(arr[row][col]);
		}
		this.columns.push(new Column(newCol));
	}
	
	this.diagonals = GameBoardController.getDiagonals(arr);
	
	//Methods of the GameBoard class
	
	//Returns a Boolean as to whether or not the GameBoard has a Player who has won
	this.hasWinner = function()
	{
		var winner = false;
		
		//First check the rows to see if any of them have a winner
		for (var i = 0; i < this.rows.length; i++)
		{
			if (this.rows[i].hasWinner())
				winner = true;
		}
		
		//If no winner is found in the rows, then check the columns
		if (!winner)
		{
			for (var j = 0; j < this.columns.length; j++)
			{
				if (this.columns[j].hasWinner())
					winner = true;
			}
		
		}
		
		//If no winner is found in the rows or columns, check the diagonals
		if (!winner)
		{
			for (var k = 0; k < this.diagonals.length; k++)
			{
				if (this.diagonals[k].hasWinner())
					winner = true;
			}
		}
		
		return winner;
	}
	
	//Return a Boolean as to whether or not all the Squares on the Board are taken
	this.isFull = function()
	{
		var full = true;
		
		for (var i = 0; i < this.rows.length; i++)
		{
			if (!this.rows[i].isFull())
				full = false;
		}
		return full;
	}

}//End GameBoard class

//Define the Match class
var Match = function(p1, p2, gb, diff)
{
	//instance variables
	this.player1 = p1;//Store reference to Player object
	this.player2 = p2;//Store reference to another Player object (Player 2)
	this.gameboard = gb;//Store reference to a GameBoard object
	this.difficulty = diff;//Store a string recording the Match difficulty (if applicable)
	this.activePlayerNumber = 1;//whose turn is it? default to player 1
	
	//Take care of the player names if they are set to "Guest", as this could be confusing
	if(p1.getName() == 'Guest')
		p1.setName("Player 1");
	
	if(p2.getName() == 'Guest')
		p2.setName("Player 2");
	
	screen.showPrompt(p1.getName() + "'s turn");
	
	//methods
	
	//getter method for the Player objects taking part in this Match
	//Acceptable parameters: integers values of either 1 or 2
	this.getPlayer = function(val)
	{
		if (val == 1)
			return this.player1;
		else if (val == 2)
			return this.player2;
		else//Invalid parameter, so return null
			return null;
	}
	//getter method for Player object of whoever's turn it is
	this.getActivePlayer = function()
	{
		if (this.activePlayerNumber == 1)
			return this.player1;
		else
			return this.player2;
	}
	
	//Method to toggle from one player to another as they take turns
	this.toggleActivePlayer = function()
	{
		if (this.activePlayerNumber == 1)
			this.activePlayerNumber = 2;
		else
			this.activePlayerNumber = 1;
		screen.showPrompt(this.getActivePlayer().getName() + "'s turn");
	}
	//getter method for the difficulty level of the Match
	this.getDifficulty = function()
	{
		return this.difficulty;
	}
	
	//getter method for the GameBoard object referenced by the Match
	this.getGameBoard = function()
	{
		return this.gameboard;
	}
	
	//perform checks for winners after a click
	this.processClick = function(){
		//Is there a winner?
		if (this.gameboard.hasWinner())
		{
			
			
			screen.showPrompt(this.getActivePlayer().getName() + " wins!");
			alert(this.getActivePlayer().getName() + " wins!");
			//Don't allow any new clicks
			GameBoardController.disableBoard(this.gameboard);
			//Record the results in memory
			var ID1 = this.getActivePlayer().getID();
			var tempNum = this.activePlayerNumber;
			if (tempNum == 1)
				tempNum = 2;
			else
				tempNum = 1;
			var ID2 = this.getPlayer(tempNum).getID();
			mem.recordMatch(ID1, ID2, 0);//write to memory
			//Ask if user wants to play again
			screen.sleep(2000);
			screen.playAgain();
			screen.showPrompt("");//Erase the turn label
			
		}
		//Is there a tie?
		else if (this.gameboard.isFull())
		{	//Notify user(s) of the winner
			screen.showPrompt("It's a tie!");
			alert("It's a tie!");
			//Don't allow any new clicks
			GameBoardController.disableBoard(this.gameboard);
			//Record the results in memory
			var ID1 = this.getActivePlayer().getID();
			var tempNum = this.activePlayerNumber;
			if (tempNum == 1)
				tempNum = 2;
			else
				tempNum = 1;
			var ID2 = this.getPlayer(tempNum).getID();
			mem.recordMatch(ID1, ID2, 1);//write to memory
			//Ask if user(s) want to play again
			screen.sleep(2000);
			screen.playAgain();
			screen.showPrompt("");//Erase the turn label
		}
		else //Otherwise, there isn't a winner OR a tie, so keep playing
		{	//toggle the active player and update prompt on the screen
			this.toggleActivePlayer();
		}
		
		//Do we need to use AI for the computer player?
		if (this.getActivePlayer().getID() == 0)
		{
			GameBoardController.makeMove(this.gameboard);
			
		}
	
	}
}//End Match class

//Define the Record class that represents a User's info such as ID, Name, Wins, Losses, Ties
var Record = function(number, fName)
{
	this.ID = number;
	this.name = fName;
	this.wins = 0;
	this.losses = 0;
	this.ties = 0;
	
	//Accessor methods
	
	//get the ID for the record
	this.getID = function()
	{
		return this.ID;
	}
	//get the name of the user
	this.getName = function()
	{
		return this.name;
	}
	
	//get the number of wins
	this.getWins = function()
	{
		return this.wins;
	}
	
	//get the number of losses
	this.getLosses = function()
	{
		return this.losses;
	}
	
	//get the number of ties
	this.getTies = function()
	{
		return this.ties;
		
	}
	//Mutator methods
	
	//Increment the number of wins
	this.addWin = function()
	{
		this.wins = (this.wins + 1);
	}
	
	//Increment the number of losses
	this.addLoss = function()
	{
		this.losses = (this.losses + 1);
	}
	
	//Increment the number of ties
	this.addTie = function()
	{
		this.ties = (this.ties + 1);
	}

}//End Record Class

//Define the MemoryController class
var MemoryController = function()
{
	//Instance variable is an array of Record objects
	this.records = []; //Initialized to empty array
	
	//Methods
	
	//Grab all of the user and match data stored in localStorage
	//Use it to create the Record objects stored in the records instance variable array
	this.populateRecords = function()
	{	
		//re-initialize to empty array if need be
		this.records = [];
		
		//get all of the data for users that have registered (id and name)
		var users = localStorage.getItem('users').split('$');
		
		//Create a record for each registered user
		for (var i  = 0; i < users.length; i = i + 2)
		{
			this.records.push(new Record(users[i], users[i + 1]));
		}
		
		//get all of the data for matches that have taken place
		var matches = localStorage.getItem('matches').split('$');
		
		for (var k = 0; k < matches.length; k = k + 3)
		{
			//Was this match a tie?
			if (matches[k + 2] == 1)
			{
				for (var j = 0; j < this.records.length; j++)
				{
					if ((this.records[j].getID() == matches[k]) || (this.records[j].getID() == matches[k + 1]))
						this.records[j].addTie();
				
				}
			}//End if for tie
			else //else it's not a tie
			{	
				for (var m = 0; m < this.records.length; m++)
				{
					switch(this.records[m].getID())
					{
						case matches[k]:
							this.records[m].addWin();
							break;
						case matches[k + 1]:
							this.records[m].addLoss();
							break;
					
					}
				}
			}//End else it's not a tie
		}//End for
		
		//Add the select options for Player 1 Dropdown
		var select = document.getElementById("existingSelect1");
		
		//First remove the existing options
		while (select.length > 0 )
			select.remove(select.length - 1);
		
		//Now attach the registered users as options
		for (var user = 0; user < this.records.length; user++)
		{	if(this.records[user].getID() > 1){//Don't add Computer or Guest as Options
			var option = document.createElement("option");
			option.text = this.records[user].getName();
			option.value = this.records[user].getID();
			select.add(option);
			}
		}//End attaching options for Player 1
		
		//Add the select options for Player 2 Dropdown
		select = document.getElementById("existingSelect2");
		
		//First remove the existing options
		while (select.length > 0 )
			select.remove(select.length - 1);
		
		//Now attach the registered users as options
		for (var user2 = 0; user2 < this.records.length; user2++)
		{	if(this.records[user2].getID() > 1) {//Don't add Computer or Guest as Options
			var option = document.createElement("option");
			option.text = this.records[user2].getName();
			option.value = this.records[user2].getID();
			select.add(option);
			}
		}//End attaching options for Player 2
	
	}//End method populateRecords()
	
	//this method is called whenever a match has just ended
	this.recordMatch = function(id1, id2, isTie)
	{
		var matches = localStorage.getItem('matches');//get the prior matches
		matches = matches + '$' + id1 + '$' + id2 + '$' + isTie;//append the results of the new match
		localStorage.setItem('matches', matches);//set new localStorage data
		
		this.populateRecords();//update the Records stored in records instance array
	
	}//end recordMatch()

	//return a string representing wins, losses, and ties for the requested user ID
	this.requestData = function(id)
	{
		var result = "";
		for (var i = 0; i < this.records.length; i++)
		{
			if (this.records[i].getID() == id)
				{
					var temp = "Wins: ";
					temp = temp + this.records[i].getWins();
					temp = temp + " Losses: ";
					temp = temp + this.records[i].getLosses();
					temp = temp + " Ties: ";
					temp = temp + this.records[i].getTies();
					result = result + temp;
				
				}
		}
		
		return result;	
	}//End requestData method
	
	//Add a new user to the memory archives
	this.addUser = function(name)
	{
		//get ID of the last record
		var lastID = this.records[this.records.length - 1].getID();
		lastID = lastID + 1;//the new ID will be 1 larger
		
		//update users in localStorage
		var user = localStorage.getItem('users');
		user = user + '$' + lastID + '$' + name;
		localStorage.setItem('users', user);
		
		//update menu options to reflect new registered users list
		this.populateRecords();
		
		return lastID;
	}//End addUser method
}//End MemoryController class

//Main function fires as soon as the index.html page is loaded
window.onload = function(){

	//test and set local storage values 
	if (localStorage.getItem('users') === null)
		localStorage.setItem('users', '0$Computer$1$Guest$2$Stephen');
	if (localStorage.getItem('matches') === null)
		localStorage.setItem('matches', '1$0$0$2$0$1');
		
	//create the instance of the MemoryController class
	mem = new MemoryController();
	mem.populateRecords();	
	//create the instance of the GUI boundary class
	screen = new GUI();
	
	//create the instance of the GameBoard class
	gb = new GameBoard(GameBoardController.generateBoard());
	
	
	
}