import React from 'react';
import CertificateCard from './CertificateCard';

const CertificatesGrid = ({ 
  certificates, 
  onDeleteCertificate, 
  onDownloadCertificate, 
  formatFileSize, 
  formatDate 
}) => {
  if (certificates.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <span className="material-icons-outlined empty-icon">folder_open</span>
          <h3 className="empty-title">No certificates uploaded yet</h3>
          <p className="empty-text">
            Upload your first certificate to get started with secure digital storage
          </p>
          <div className="empty-features">
            <div className="empty-feature">
              <span className="material-icons-outlined">verified_user</span>
              <span>Secure & Private</span>
            </div>
            <div className="empty-feature">
              <span className="material-icons-outlined">devices</span>
              <span>Access Anywhere</span>
            </div>
            <div className="empty-feature">
              <span className="material-icons-outlined">backup</span>
              <span>Auto Backup</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="certificates-section">
      <div className="certificates-header">
        <h2 className="certificates-title">
          <span className="material-icons-outlined">folder</span>
          Your Certificates
          <span className="certificates-count">({certificates.length})</span>
        </h2>
        <div className="certificates-stats">
          <div className="stat-item">
            <span className="material-icons-outlined">description</span>
            <span>{certificates.length} Files</span>
          </div>
        </div>
      </div>
      
      <div className="certificates-grid">
        {certificates.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            onDelete={onDeleteCertificate}
            onDownload={onDownloadCertificate}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        ))}
      </div>
    </section>
  );
};

export default CertificatesGrid;