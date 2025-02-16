import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card } from '../../types/cards';
import { shuffleCards } from '../../utils/setup';
import { CardsArray } from '../../utils/data';

interface CardsState {
  cards: Card[];
  flippedCardIndexes: number[];
  matchedCardIndexes: number[];
  isStartedGame: boolean;
  chronoTimer: number;
  gameStatus: 'not_started' | 'started' | 'win' | 'lose';
}

const initialState: CardsState = {
  cards: CardsArray,
  flippedCardIndexes: [],
  matchedCardIndexes: [],
  isStartedGame: false,
  chronoTimer: 60,
  gameStatus: 'not_started',
};

/**
 * that defines the actions and reducer for managing the state of a memory card game
 * @param {"cards"} {name
 * @param {any} initialState
 * @param {any} reducers:{flipCard, resetCards, setCards, flip...
 * @param {PayloadAction<number>} action
 * @returns {any}
 */

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    flipCard: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const isFlipped = state.cards[index].isFlipped;
      if (!isFlipped && state.flippedCardIndexes.length < 2) {
        state.cards[index].isFlipped = true;
        state.flippedCardIndexes.push(index);
      }
      console.log(index);
    },
    resetCards: (state) => {
      state.cards.forEach((card) => {
        card.isFlipped = false;
        card.isMatched = false;
      });
      state.flippedCardIndexes = [];
      state.matchedCardIndexes = [];
    },
    setCards: (state, action: PayloadAction<Card[]>) => {
      // Create unique cards
      const uniqueCards = action.payload.map((card, index) => {
        return {
          ...card,
          id: index + 1, // unique ids from 1 to 8
        };
      });

      // Create pairs of cards
      const cardPairs = [...uniqueCards, ...uniqueCards];

      // Shuffle cards for random order
      const shuffledCards = shuffleCards(cardPairs);

      state.cards = shuffledCards;
    },
    flipBackUnmatchedCards: (state) => {
      state.cards.forEach((card, index) => {
        if (
          state.flippedCardIndexes.includes(index) &&
          !state.matchedCardIndexes.includes(card.id) // Check card ID, not index
        ) {
          card.isFlipped = false;
        }
      });
      state.flippedCardIndexes = [];
    },

    matchedCards: (state) => {
      const flippedCards = state.flippedCardIndexes.map(
        (index) => state.cards[index]
      );

      if (flippedCards[0].id === flippedCards[1].id) {
        flippedCards.forEach((card) => {
          state.matchedCardIndexes.push(card.id);
        });
      }
      state.flippedCardIndexes = [];
    },
    flipAllCards: (state) => {
      state.cards.forEach((card) => {
        card.isFlipped = true;
      });
    },
    setGameStart: (state, action) => {
      state.isStartedGame = action.payload;
    },

    setChronoTimer: (state, action) => {
      state.chronoTimer = action.payload;
    },
    decrementTimer: (state) => {
      state.chronoTimer--;
    },
    setGameStatus: (
      state,
      action: PayloadAction<'not_started' | 'started' | 'win' | 'lose'>
    ) => {
      state.gameStatus = action.payload;
    },
  },
});

export const {
  flipCard,
  resetCards,
  setCards,
  flipBackUnmatchedCards,
  matchedCards,
  flipAllCards,
  setGameStart,
  setChronoTimer,
  decrementTimer,
  setGameStatus,
} = cardsSlice.actions;

export default cardsSlice.reducer;
