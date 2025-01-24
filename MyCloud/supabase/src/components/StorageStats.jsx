import "../styles/dashboard.css";

const StorageStats = () => {
  return (
    <div className="storage-stats">
      <h2>500 MB used out of 1 GB</h2>
      <div className="storage-bars">
        <div className="doc1">doc1 - 200mb</div>
        <div className="doc2">doc2 - 200mb</div>
        <div className="doc3">doc3 - 100mb</div>
        <div className="unused">unused - 500mb</div>
      </div>
    </div>
  );
};

export default StorageStats;
