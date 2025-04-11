import { useState } from "react";

// Generates dynamic tab information based on the given averages data
const generateTabInfo = (averages) => {
  return Object.keys(averages).reduce((info, category) => {
    info[category] = {
      title: `${category} Hashtags Average Engagement`,
      description: `Avg Likes: ${averages[category].avgLikes.toFixed(2)} | 
      Avg Comments: ${averages[category].avgComments.toFixed(2)} | Avg Total Engagement:
       ${averages[category].avgEngagement.toFixed(2)}`,
    };
    return info;
  }, {});
};

export default function Tabs({ data, averages }) {
  const categories = Object.keys(data); // Get categories from the data
  const [activeTab, setActiveTab] = useState(categories[0]); // Default to first category
  const tabInfo = generateTabInfo(averages); // Generate tab info based on averages

  // Styles for the tabs component
  const styles = {
    container: {
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "0",
      marginTop: "0",
      marginBottom: "0",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      borderBottom: "2px solid #ddd",
      marginBottom: "10px",
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      textAlign: "center",
      transition: "all 0.3s ease",
      borderRadius: "5px",
    },
    buttonHover: {
      backgroundColor: "#0056b3", // Darker hover color
    },
    buttonActive: {
      backgroundColor: "#0056b3", // Active tab color
      fontWeight: "600", // Emphasize active tab
    },
    content: {
      padding: "20px",
      border: "1px solid #ddd",
      borderTop: "none",
      borderRadius: "0 0 8px 8px",
      backgroundColor: "#f9f9f9",
      marginTop: "0",
      marginBottom: "0",
    },
    list: {
      listStyle: "none",
      paddingLeft: "0",
      margin: "0",
    },
    item: {
      padding: "8px 0",
      fontSize: "14px",
    },
    noItems: {
      color: "#888",
      fontStyle: "italic",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)} 
            style={{
              ...styles.button,
              ...(activeTab === category ? styles.buttonActive : {}),
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)} 
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor =
                activeTab === category ? styles.buttonActive.backgroundColor : styles.button.backgroundColor)
            }
          >
            {category}
          </button>
        ))}
      </div>  
      <div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '10px' }}>
          {tabInfo[activeTab]?.title || "Category Overview"}
        </h3>
        <p style={{ marginBottom: '10px' }}>
          {tabInfo[activeTab]?.description || "Explore insights about this category."}
        </p>
      </div>
      <div style={styles.content}>
        {data[activeTab].length > 0 ? (
          <ul style={styles.list}>
            {data[activeTab].map((item, index) => (
              <li key={index} style={styles.item}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noItems}>No items</p>
        )}
      </div>
    </div>
  );  
}
