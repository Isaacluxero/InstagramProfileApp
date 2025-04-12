# Instagram Profile Analytics

A comprehensive analytics dashboard for Instagram business profiles that provides insights into post performance, engagement metrics, and content optimization recommendations.

## Features

- **Login Page**
  - Login Page connected to facebook
  - Logging in is when all the intial data is loaded
  - <img width="1359" alt="Screenshot 2025-04-12 at 1 11 23 PM" src="https://github.com/user-attachments/assets/05de1319-aae1-49a3-b65b-b352e0a97128" />

 
- **User Metrics Dashboard**
  - Track likes, comments, and saves over time
  - Analyze total engagement trends
  - Visualize follower growth patterns

- **Hashtag Analytics**
  - Identify top-performing hashtags
  - Categorize hashtags by content type
  - Track hashtag usage patterns over time
  - Calculate optimal hashtag count per post

- **Comment Analysis**
  - Sentiment analysis of comments
  - Emotion detection in user feedback
  - Track positive vs. negative engagement
  - Generate actionable insights from user feedback

- **Time-Based Analytics**
  - Identify optimal posting times
  - Track engagement by time of day
  - Analyze performance by time period
  - Heatmap visualization of engagement patterns

## Tech Stack

### Frontend
- React.js
- Recharts for data visualization
- CSS Modules for styling
- Axios for API calls

### Backend
- Node.js/Express.js
- Python/Flask
- SQLite database
- TensorFlow.js for sentiment analysis

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/InstagramProfileApp.git
cd InstagramProfileApp
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up Python environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory with your Instagram API credentials:
```
INSTA_USER_ID=your_user_id
INSTA_ACCESS_TOKEN=your_access_token
```

## Running the Application

1. Start the Node.js backend server:
```bash
cd backend
node server.js
```

2. Start the Python server:
```bash
cd backend
source venv/bin/activate
python server.py
```

3. Start the React frontend:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Node.js Backend (Port 5001)
- `POST /storeData` - Store Instagram data
- `GET /getTopHashtags` - Get top hashtags
- `GET /getCommentsClassified` - Get classified comments
- `GET /calculateAverageHashtags` - Calculate average hashtags
- `GET /getHashtagsTimeData` - Get hashtag time data
- `GET /getHashTagCategories` - Get hashtag categories
- `GET /getAverageEngagement` - Get average engagement
- `GET /getEngagementTimeData` - Get engagement time data
- `GET /getTimeMetrics` - Get time-based metrics

### Python Backend (Port 3002)
- `GET /predict` - Predict emotions from comments

