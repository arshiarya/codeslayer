import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
}

/**
 * Middleware to authenticate requests using JWT.
 * FIX: Ensure we extract the correct ID key from the payload (ID or user_id).
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. Authentication token missing or invalid format.' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            console.warn("JWT Verification Failed:", err.message);
            // Distinguish between expired token and other verification failures.
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // --- THE CRITICAL FIX ---
        // Prioritize 'id' but fallback to 'user_id' if needed.
        const userId = decodedPayload.id || decodedPayload.user_id; 
        
        if (!userId) {
             return res.status(403).json({ message: 'Invalid token structure: User ID not found in payload.' });
        }

        // Attach user ID to request
        req.userId = userId;

        next();
    });
};

export default authenticateToken;