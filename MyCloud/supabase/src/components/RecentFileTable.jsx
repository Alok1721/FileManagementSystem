import "../styles/dashboard.css";

const RecentFilesTable = () => {
  return (
    <div className="recent-files">
      <h3>Recent Files</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Uploader</th>
            <th>Date</th>
            <th>Size</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>alok ka doc</td>
            <td>alok kumar</td>
            <td>7 jan</td>
            <td>1mb</td>
            <td>doc file</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecentFilesTable;
