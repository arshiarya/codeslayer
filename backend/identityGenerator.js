// identityGenerator.js
import pool from "./config/db.js"; // Use your exported pool

const ADJECTIVES = ['Silent', 'Wandering', 'Muted', 'Hidden'];
const NOUNS = ['Mind', 'Cloud', 'Echo', 'Stream'];

function randomIndex(arr) {
    return Math.floor(Math.random() * arr.length);
}

export async function generateAnonymousName(roomId) {
    let newName;
    let isUnique = false;
    
    while (!isUnique) {
        const adj = ADJECTIVES[randomIndex(ADJECTIVES)];
        const noun = NOUNS[randomIndex(NOUNS)];
        const number = Math.floor(Math.random() * 100);
        newName = `${adj}_${noun}_${number}`; 

        const checkQuery = "SELECT 1 FROM chat_identities WHERE room_id = $1 AND anonymous_name = $2";
        
        // Execute the query using the pool instance
        const result = await pool.query(checkQuery, [roomId, newName]); 
        
        if (result.rowCount === 0) {
            isUnique = true;
        }
    }
    return newName;
}