import React, { Component } from 'react';
import dictionary from '../assets/dictionary.json';
import './App.css';

const timePerWord = 20;

class App extends Component {
  state = {
    isPlaying: false,
    userInput: '',
    timer: timePerWord,
  }

  componentWillUnmount() {
    if (this.stopPlayingWord) this.stopPlayingWord();
    if (this.stopTimer) this.stopTimer();
  }

  getNextWord() {
    let randomWord;

    do {
      randomWord = dictionary[Math.floor(Math.random() * dictionary.length)];
    } while (this.state.word && randomWord.hiragana === this.state.word.hiragana);

    return randomWord;
  }

  startGame() {
    const word = this.getNextWord();
    this.stopTimer = this.startTimer();

    this.setState({ word, isPlaying: true }, () => {
      this.stopPlayingWord = this.play(word);
    });
  }

  play(word) {
    const playWord = () => {
      const audio = new Audio(`${process.env.PUBLIC_URL}/audio/${word.romaji}.mp3`);
      audio.play();
    };

    playWord();
    const intervalId = setInterval(playWord, 5000);

    return () => clearInterval(intervalId);
  }

  startTimer() {
    const intervalId = setInterval(() => {
      if (this.state.timer === 0) {
        this.goToNextWord();
      } else {
        this.setState({ timer: this.state.timer - 1 });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }

  goToNextWord() {
    if (this.stopPlayingWord) this.stopPlayingWord();
    const word = this.getNextWord();

    this.setState({ word, isPlaying: true, userInput: '', timer: timePerWord }, () => {
      this.stopPlayingWord = this.play(word);
    });
  }

  onUserInputChange(userInput) {
    this.setState(currentState => {
      let hasPassed = (userInput === currentState.word.hiragana || userInput === currentState.word.kanji);

      if (hasPassed) {
        this.goToNextWord();
      } else {
        this.setState({ userInput });
      }
    });
  }

  render() {
    if (this.state.isPlaying && this.state.word) {
      return (
        <div id="app">
          <div class="timer">{this.state.timer}</div>


          <div class="middle-container">
            <div className="word-english">{this.state.word.english}</div>
            <div className="word-kanji">{this.state.word.kanji}</div>

            <div className="user-input-container">
              <input type="text" autoFocus="true" value={this.state.userInput} onChange={e => this.onUserInputChange(e.target.value)} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="app">
          <div class="middle-container">
            <button className="playButton" onClick={this.startGame.bind(this)}>Play</button>
          </div>
        </div>
      )
    }
  }
}

export default App;
