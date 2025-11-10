import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Book } from '../data/books';

export interface BookData extends Omit<Book, 'id'> {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const BOOKS_COLLECTION = 'books';

// Add a new book to Firestore with a custom ID
export const addBook = async (bookData: BookData, bookId?: string): Promise<string> => {
  try {
    const bookWithTimestamp = {
      ...bookData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    if (bookId) {
      // Use custom ID if provided
      const bookRef = doc(db, BOOKS_COLLECTION, bookId);
      await setDoc(bookRef, bookWithTimestamp);
      return bookId;
    } else {
      // Auto-generate ID
      const docRef = await addDoc(collection(db, BOOKS_COLLECTION), bookWithTimestamp);
      return docRef.id;
    }
  } catch (error: any) {
    console.error('Error adding book:', error);
    // Provide more helpful error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check your Firestore security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase service is unavailable. Please check your internet connection.');
    } else if (error.message) {
      throw new Error(`Firebase error: ${error.message}`);
    }
    throw new Error('Failed to add book to Firebase. Please check the console for details.');
  }
};

// Get all books from Firestore
export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const q = query(collection(db, BOOKS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Book));
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
};

// Get a book by ID from Firestore
export const getBookById = async (bookId: string): Promise<Book | null> => {
  try {
    const bookRef = doc(db, BOOKS_COLLECTION, bookId);
    const bookSnap = await getDoc(bookRef);
    
    if (bookSnap.exists()) {
      return {
        id: bookSnap.id,
        ...bookSnap.data()
      } as Book;
    }
    return null;
  } catch (error) {
    console.error('Error getting book:', error);
    throw error;
  }
};

// Update a book in Firestore
export const updateBook = async (bookId: string, bookData: Partial<BookData>): Promise<void> => {
  try {
    const bookRef = doc(db, BOOKS_COLLECTION, bookId);
    await updateDoc(bookRef, {
      ...bookData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Delete a book from Firestore
export const deleteBook = async (bookId: string): Promise<void> => {
  try {
    const bookRef = doc(db, BOOKS_COLLECTION, bookId);
    await deleteDoc(bookRef);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

