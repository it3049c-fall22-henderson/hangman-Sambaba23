class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
    this.guesses = [];
    this.word = "";
    this.isOver = false;
    this.didWin = false;
    this.wrongGuesses = 0;
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
   getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
   async start(difficulty, next) {
    this.word  = await this.getRandomWord(difficulty)

    this.clearCanvas();
    this.drawBase();
    this.guesses = [];
    this.isOver = false;
    this.didWin = false;
    next();
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    // Check if nothing was provided and throw an error if so
    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    // Check if more than one letter was provided. throw an error if it is.
    // if it's a letter, convert it to lower case for consistency.
    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    // add the new letter to the guesses array.
    // check if the word includes the guessed letter:
    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
    // Check if nothing was provided and throw an error if so
    if (letter === ""){
      alert("Please guess a letter.");
      throw new Error ("Please guess a letter.");
    }

    if (/^[a-zA-Z]+$/.test(letter) === false){
      alert("Please guess only a letter.");
      throw new Error("Please guess only a letter.");
    }

    if (letter.length > 1){
      alert("Please guess 1 letter at a time.");
      throw new Erorr("Please guess 1 letter at a time.");
    }
    letter = letter.toLowerCase();
    let hasLetter = false;
    for (let i = 0; i < this.guesses.length; i++){
      if (this.guesses[i] === letter){
        hasLetter = true;
        alert("That letter has already been guessed. Try Again.");
        throw new Erorr ("That letter has already been guessed. Try Again.");
      }
    }

    if(hasLetter === false){
      this.guesses.push(letter)
    }
    if(this.word.indexOf(letter) > -1){
      this.checkWin();
    }else{
      this.onWrongGuess();
    }
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    // if zero, set both didWin, and isOver to true
    let unknowns = this.word.length;
    for (let i = 0; i < this.guesses.length; i++){
      for(let j = 0; j < this.word.length; j++){
        if (this.word.charAt(j) == this.guesses[i]){
          unknowns--;
        }
      }
    }
    if (unknowns === 0){
      this.isOver = true;
      this.didWin = true;
    }
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
   onWrongGuess() {
    switch(this.wrongGuesses){
      case(0):
        this.drawHead();
        break;
      case(1):
        this.drawBody();
        break;
      case(2):
        this.drawLeftArm();
        break;
      case(3):
        this.drawRightArm();
        break;
      case(4):
        this.drawLeftLeg();
        break;
      case(5):
        this.drawRightLeg();
        break;
      default:
        this.isOver = true;
        break;
    }
    this.wrongGuesses++;
  }
  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
   getWordHolderText() {
    let strPlaceHolder = "Word: ";
    let strWord = this.word.split("");
    for (let i = 0; i < strWord.length; i++){
      strWord[i] = "_";
    }
    console.log(this.word);
    for (let i = 0; i < this.guesses.length; i++) {
      for (let j = 0; j < this.word.length; j++) {
        if (this.word.charAt(j) === this.guesses[i]) {
          strWord[j] = this.guesses[i];
        }
      }
    }

    strPlaceHolder += strWord.join(" ");
    return strPlaceHolder;
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
   getGuessesText() {
    let allGuesses = "Guesses: ";
    allGuesses += this.guesses.join(", ");
    return allGuesses;
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    this.ctx.beginPath();
    this.ctx.arc(250, 85, 25, 0, 2 * Math.PI, true);
    this.ctx.stroke();
  }

  drawBody() {
    this.ctx.beginPath();
    this.ctx.fillRect(245, 110, 10, 150);
    this.ctx.stroke();
  }

  drawLeftArm() {
    this.ctx.beginPath();
    this.ctx.fillRect(175, 110, 80, 10);
    this.ctx.stroke();
  }

  drawRightArm() {
    this.ctx.beginPath();
    this.ctx.fillRect(245, 110, 80, 10);
    this.ctx.stroke();
  }

  drawLeftLeg() {
    this.ctx.beginPath();
    this.ctx.fillRect(175, 260, 80, 10);
    this.ctx.stroke();
  }

  drawRightLeg() {
    this.ctx.beginPath();
    this.ctx.fillRect(245, 260, 80, 10);
    this.ctx.stroke();
  }
}
