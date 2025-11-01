// 1. Import necessary modules
const express = require('express');
const cors = require('cors');

// 2. Create app instance
const app = express();
// We'll use port 5000 for the backend, as 3000 is common for frontend
const PORT = 5000; 

// 3. Apply essential Middleware
app.use(cors()); // Allows frontend to communicate with this backend
app.use(express.json()); // Allows the server to read JSON data from requests

// 4. Define a Test Route (API Endpoint)
app.get('/', (req, res) => {
  res.status(200).send('Codeslayer backend is running successfully!');
});

// 5. Start the Server and listen for connections
app.listen(PORT, () => {
  console.log(`\n🚀 Server started on port ${PORT}`);
  console.log(`Access the server at: http://localhost:${PORT}/`);
});