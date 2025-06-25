import React from 'react';

const CertificateCard = ({ certificate, onDelete, onDownload, formatFileSize, formatDate }) => {
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      case 'doc':
      case 'docx':
        return 'description';
      default:
        return 'insert_drive_file';
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    return extension.toUpperCase();
  };

  return (
    <div className="certificate-card">
      <div className="certificate-header">
        <div className="certificate-icon-container">
          <span className="material-icons-outlined certificate-icon">
            {getFileIcon(certificate.name)}
          </span>
          <span className="file-type-badge">{getFileType(certificate.name)}</span>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(certificate.id, certificate.name)}
          title="Delete certificate"
        >
          <span className="material-icons-outlined">delete</span>
        </button>
      </div>
      
      <div className="certificate-content">
        <h3 className="certificate-name" title={certificate.name}>
          {certificate.name}
        </h3>
        <div className="certificate-meta">
          <div className="meta-item">
            <span className="material-icons-outlined">storage</span>
            <span>{formatFileSize(certificate.size)}</span>
          </div>
          <div className="meta-item">
            <span className="material-icons-outlined">schedule</span>
            <span>{formatDate(certificate.created_at)}</span>
          </div>
        </div>
      </div>
      
      <div className="certificate-actions">
        <button
          className="certificate-download"
          onClick={() => onDownload(certificate)}
          title="Download certificate"
        >
          <span className="material-icons-outlined">download</span>
          Download
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;