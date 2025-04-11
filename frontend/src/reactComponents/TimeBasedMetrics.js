import styles from "../css/TimeBasedMetrics.module.css";
import React from 'react';

const TimeBasedMetrics = () => {

  return (
    <div className={styles.timeBasedMetricsContainer}>
      <h1 className={styles.timeBasedMetricsHeader}>Time Based Metrics</h1>
      <button className={styles.backButton}>Back</button>
    </div>
  );
};

export default TimeBasedMetrics;