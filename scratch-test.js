import * as auth from 'firebase-admin/auth';
import * as firestore from 'firebase-admin/firestore';
console.log('auth keys:', Object.keys(auth).slice(0, 10));
console.log('firestore keys:', Object.keys(firestore).slice(0, 10));
