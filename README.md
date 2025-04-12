# Instagram Profile Analyzer

A comprehensive analytics dashboard for Instagram business profiles that provides insights into post performance, engagement metrics, and content optimization recommendations.
- **Video Walkthrough of App**
  https://youtu.be/hKBCOxJLuZY
   <img width="1359" alt="Screenshot 2025-04-12 at 1 11 23 PM" src="https://github.com/user-attachments/assets/05de1319-aae1-49a3-b65b-b352e0a97128" />

## Features

### User Metrics Dashboard
The User Metrics Dashboard provides a comprehensive view of your Instagram profile's performance over time. It includes:

**Business Value:** In today's competitive social media landscape, understanding your content's performance is crucial for business growth. The User Metrics Dashboard was designed to give businesses a clear picture of their Instagram ROI, helping them make data-driven decisions about their content strategy. By tracking engagement patterns and follower growth, businesses can identify what content resonates with their audience, optimize their posting strategy, and ultimately drive more conversions and brand awareness.

- **Engagement Tracking**
  - Real-time monitoring of likes, comments, and saves
  - Interactive line charts showing engagement trends
  - Customizable date ranges for historical analysis
  - Comparison of different engagement metrics

- **Follower Analytics**
  - Visual representation of follower growth patterns
  - Identification of growth spikes and trends
  - Analysis of follower acquisition sources
  - Correlation between content types and follower growth

- **Performance Metrics**
  - Average engagement rate calculations
  - Post reach and impressions tracking
  - Content type performance comparison
  - ROI analysis for different content strategies

### Hashtag Analytics
The Hashtag Analytics dashboard helps optimize your hashtag strategy with:

**Business Value:** Hashtags are the backbone of Instagram discoverability, yet many businesses struggle to use them effectively. This dashboard was created to solve this challenge by providing actionable insights into hashtag performance. By understanding which hashtags drive the most engagement and reach, businesses can increase their content visibility, attract more relevant followers, and improve their overall social media presence. The categorization and trend analysis features help businesses stay ahead of the competition by identifying emerging hashtag opportunities and optimizing their hashtag strategy in real-time.

- **Performance Analysis**
  - Top-performing hashtags identification
  - Engagement rate per hashtag
  - Reach and impressions by hashtag
  - Historical performance tracking

- **Categorization System**
  - Automatic categorization of hashtags by content type
  - Industry-specific hashtag recommendations
  - Trending hashtag suggestions
  - Competitor hashtag analysis

- **Usage Optimization**
  - Optimal hashtag count recommendations
  - Best-performing hashtag combinations
  - Time-based hashtag performance
  - Hashtag frequency analysis

- **Trend Analysis**
  - Hashtag popularity trends
  - Seasonal hashtag recommendations
  - Emerging hashtag opportunities
  - Hashtag saturation warnings

### Comment Analysis
The Comment Analysis dashboard provides deep insights into audience engagement through:

**Business Value:** Customer feedback and engagement are goldmines of business intelligence, but manually analyzing comments is time-consuming and often incomplete. The Comment Analysis dashboard was developed to transform this unstructured data into actionable business insights. By automatically analyzing sentiment and emotions in comments, businesses can quickly identify customer satisfaction levels, detect potential PR issues before they escalate, and understand their audience's preferences. This real-time feedback loop enables businesses to make quick adjustments to their products, services, and content strategy, leading to improved customer satisfaction and brand loyalty.

- **Sentiment Analysis**
  - Real-time sentiment detection
  - Positive vs. negative comment tracking
  - Emotion classification (happy, sad, angry, etc.)
  - Sentiment trend analysis

- **Engagement Insights**
  - Most engaging comment types
  - Response rate tracking
  - Comment length analysis
  - Emoji usage patterns

- **Feedback Analysis**
  - Common themes in comments
  - Customer service insights
  - Product feedback aggregation
  - Audience preference identification

- **Actionable Recommendations**
  - Content improvement suggestions
  - Engagement strategy recommendations
  - Response template suggestions
  - Crisis management alerts

### Time-Based Analytics
The Time-Based Analytics dashboard helps optimize your posting schedule with:

**Business Value:** Timing is everything in social media marketing. The Time-Based Analytics dashboard was created to help businesses maximize their content's impact by posting at optimal times. By analyzing engagement patterns across different time periods, businesses can ensure their content reaches the maximum number of followers when they're most active. This not only improves engagement rates but also helps businesses plan their content calendar more effectively, leading to better resource allocation and higher ROI on social media efforts. The heatmap visualization makes it easy to identify patterns and adjust posting schedules accordingly.

- **Optimal Posting Times**
  - Best days of the week for posting
  - Optimal time slots by engagement type
  - Time zone optimization
  - Audience activity patterns

- **Engagement Patterns**
  - Hour-by-hour engagement analysis
  - Day-of-week performance comparison
  - Seasonal engagement trends
  - Holiday-specific recommendations

- **Performance Metrics**
  - Engagement rate by time period
  - Reach and impressions timing
  - Comment response time analysis
  - Story viewing patterns

- **Visual Analytics**
  - Interactive heatmap of engagement
  - Time-based performance charts
  - Comparative analysis tools
  - Custom time range selection

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

## API Endpoints

### Node.js Backend
- `POST /storeData` - Store Instagram data
- `GET /getTopHashtags` - Get top hashtags
- `GET /getCommentsClassified` - Get classified comments
- `GET /calculateAverageHashtags` - Calculate average hashtags
- `GET /getHashtagsTimeData` - Get hashtag time data
- `GET /getHashTagCategories` - Get hashtag categories
- `GET /getAverageEngagement` - Get average engagement
- `GET /getEngagementTimeData` - Get engagement time data
- `GET /getTimeMetrics` - Get time-based metrics

### Python Backend
- `GET /predict` - Predict emotions from comments

