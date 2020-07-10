/*
  Data layer

  This module does most of the interfacing with Firebase.
  It build shorthand references for each collection and document.
  It exposes reactive hooks for the collections and documents.
  It exposes CRUD (AGUD?) methods for the collections.
  It handles a small amount of normalization.
 */

import firebase from 'firebase';

import { updateUser } from '../lib/useAuth';
import useCollectionData from '../lib/useCollectionData';
import useDocumentData from '../lib/useDocumentData';

const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;

// Firebase shorthand references
const db = {};
db.games = () => firebase.firestore().collection('games');
db.game = (gameId) => db.games().doc(gameId);
db.gameUsers = (gameId) => db.games().doc(gameId).collection('users');
db.gameUser = (gameId, userId) => db.gameUsers(gameId).doc(userId);

// Data hooks
export const useGameData = (gameId) => useDocumentData(db.game(gameId));
export const useGameUserData = (gameId, userId) => useDocumentData(db.gameUser(gameId, userId));
export const useGameUsersData = (gameId) => useCollectionData(db.gameUsers(gameId));
export const useUserGames = (userId) => useCollectionData(
  db.games().where('userIds', 'array-contains', userId)
);

// Games
export const addGame = (values) => {
  return db.games().add({
    name: 'Untitled Game',
    ...values,
  });
};
export const getGame = (gameId) => {
  return db.game(gameId).get();
};
export const updateGame = (gameId, values) => {
  return db.game(gameId).set(values, { merge: true });
};
export const deleteGame = (gameId) => {
  return db.game(gameId).delete();
};

// Game Users
export const addGameUser = async (gameId, userId, values) => {
  const gameUser = await updateGameUser(gameId, userId, values);
  // Update the normalization arrays
  await updateUser(userId, { gameIds: arrayUnion(gameId) });
  await updateGame(gameId, { userIds: arrayUnion(userId) });
  return gameUser;
};
export const getGameUser = (gameId, userId) => {
  return db.gameUser(gameId, userId).get();
};
export const updateGameUser = (gameId, userId, values) => {
  return db.gameUser(gameId, userId).set(values, { merge: true });
};
export const deleteGameUser = async (gameId, userId) => {
  await updateGame(gameId, { userIds: arrayRemove(userId) });
  // TODO advance the turn if it's this user's turn (handle in business layer?)
  return db.gameUser(gameId, userId).delete();
};

export default {
  useGameData,
  useGameUserData,
  useGameUsersData,
  useUserGames,

  addGame,
  getGame,
  updateGame,
  deleteGame,

  addGameUser,
  getGameUser,
  updateGameUser,
  deleteGameUser,
};
