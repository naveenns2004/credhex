import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Silk from './Silk';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import CertificatesGrid from './components/CertificatesGrid';
import Notification from './components/Notification';

function App() {
  const [certificates, setCertificates] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from('certificates')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading certificates:', error);
        showNotification('Failed to load certificates', 'error');
        return;
      }

      if (data && data.length > 0) {
        const certificatesWithUrls = data
          .filter(file => file.name && !file.name.includes('.emptyFolderPlaceholder'))
          .map((file) => {
            const { data: urlData } = supabase.storage
              .from('certificates')
              .getPublicUrl(file.name);

            return {
              id: file.name, // Use filename as ID for consistency
              name: file.name,
              size: file.metadata?.size || 0,
              created_at: file.created_at,
              url: urlData.publicUrl,
            };
          });

        setCertificates(certificatesWithUrls);
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Error loading certificates:', error);
      showNotification('Failed to load certificates', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const file of files) {
        try {
          const fileExt = file.name.split('.').pop();
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(2);
          const fileName = `${timestamp}-${randomId}.${fileExt}`;

          const { error } = await supabase.storage
            .from('certificates')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            throw error;
          }

          const { data: urlData } = supabase.storage
            .from('certificates')
            .getPublicUrl(fileName);

          const newCertificate = {
            id: fileName,
            name: file.name,
            size: file.size,
            created_at: new Date().toISOString(),
            url: urlData.publicUrl,
          };

          setCertificates(prev => [newCertificate, ...prev]);
          successCount++;
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          errorCount++;
        }
      }

      if (successCount > 0) {
        showNotification(
          `${successCount} certificate${successCount > 1 ? 's' : ''} uploaded successfully!`, 
          'success'
        );
      }
      
      if (errorCount > 0) {
        showNotification(
          `Failed to upload ${errorCount} certificate${errorCount > 1 ? 's' : ''}`, 
          'error'
        );
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      showNotification('Failed to upload certificates', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteCertificate = async (certificateId, fileName) => {
    try {
      const { error } = await supabase.storage
        .from('certificates')
        .remove([certificateId]);

      if (error) {
        throw error;
      }

      setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
      showNotification('Certificate deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      showNotification('Failed to delete certificate', 'error');
    }
  };

  const handleDownloadCertificate = async (certificate) => {
    try {
      const { data, error } = await supabase.storage
        .from('certificates')
        .download(certificate.id);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = certificate.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('Certificate downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      showNotification('Failed to download certificate', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className={`App ${isDarkTheme ? 'dark-theme' : ''}`}>
        <div className="silk-background">
          <Silk
            speed={5}
            scale={1}
            color={isDarkTheme ? "#2D1B69" : "#7B7481"}
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner large"></div>
            <h2>Loading CredHex...</h2>
            <p>Preparing your certificate manager</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : ''}`}>
      <div className="silk-background">
        <Silk
          speed={5}
          scale={1}
          color={isDarkTheme ? "#2D1B69" : "#7B7481"}
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      <div className="main-content">
        <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
        
        <UploadSection
          isUploading={isUploading}
          onFileUpload={handleFileUpload}
          fileInputRef={fileInputRef}
          onUploadAreaClick={handleUploadAreaClick}
        />

        <CertificatesGrid
          certificates={certificates}
          onDeleteCertificate={handleDeleteCertificate}
          onDownloadCertificate={handleDownloadCertificate}
          formatFileSize={formatFileSize}
          formatDate={formatDate}
        />
      </div>

      <Notification 
        notification={notification} 
        onClose={hideNotification} 
      />
    </div>
  );
}

export default App;