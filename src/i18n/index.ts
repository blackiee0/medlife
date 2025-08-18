import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      patients: 'Patients',
      doctors: 'Doctors',
      emergency: 'Emergency Access',
      reports: 'Medical Reports',
      settings: 'Settings',
      logout: 'Logout',
      
      // Patient Information
      patientId: 'Patient ID',
      nationalId: 'National ID',
      name: 'Name',
      age: 'Age',
      sex: 'Sex',
      bloodGroup: 'Blood Group',
      address: 'Address',
      contact: 'Contact',
      emergencyContact: 'Emergency Contact',
      
      // Medical Information
      allergies: 'Allergies',
      medications: 'Medications',
      chronicDiseases: 'Chronic Diseases',
      implants: 'Implants',
      medicalHistory: 'Medical History',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment',
      
      // Actions
      search: 'Search',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      upload: 'Upload',
      download: 'Download',
      view: 'View',
      
      // Emergency Access
      emergencyAccess: 'Emergency Access',
      scanQr: 'Scan QR Code',
      emergencyInfo: 'Emergency Information',
      
      // Consent & Privacy
      consentRequired: 'Consent Required',
      dataPrivacy: 'Data Privacy',
      auditLog: 'Audit Log',
      
      // System Messages
      patientNotFound: 'Patient not found',
      accessGranted: 'Access granted',
      accessDenied: 'Access denied',
      dataUpdated: 'Data updated successfully',
      
      // Offline Mode
      offlineMode: 'Offline Mode',
      syncPending: 'Sync pending',
      dataNotAvailable: 'Data not available offline'
    }
  },
  ne: {
    translation: {
      // Navigation
      dashboard: 'ड्यासबोर्ड',
      patients: 'बिरामीहरू',
      doctors: 'डाक्टरहरू',
      emergency: 'आकस्मिक पहुँच',
      reports: 'चिकित्सा रिपोर्टहरू',
      settings: 'सेटिङहरू',
      logout: 'लग आउट',
      
      // Patient Information
      patientId: 'बिरामी आईडी',
      nationalId: 'राष्ट्रिय परिचयपत्र',
      name: 'नाम',
      age: 'उमेर',
      sex: 'लिङ्ग',
      bloodGroup: 'रक्त समूह',
      address: 'ठेगाना',
      contact: 'सम्पर्क',
      emergencyContact: 'आकस्मिक सम्पर्क',
      
      // Medical Information
      allergies: 'एलर्जीहरू',
      medications: 'औषधिहरू',
      chronicDiseases: 'दीर्घकालीन रोगहरू',
      implants: 'प्रत्यारोपणहरू',
      medicalHistory: 'चिकित्सा इतिहास',
      diagnosis: 'निदान',
      treatment: 'उपचार',
      
      // Actions
      search: 'खोज्नुहोस्',
      add: 'थप्नुहोस्',
      edit: 'सम्पादन गर्नुहोस्',
      delete: 'मेटाउनुहोस्',
      save: 'सुरक्षित गर्नुहोस्',
      cancel: 'रद्द गर्नुहोस्',
      upload: 'अपलोड गर्नुहोस्',
      download: 'डाउनलोड गर्नुहोस्',
      view: 'हेर्नुहोस्',
      
      // Emergency Access
      emergencyAccess: 'आकस्मिक पहुँच',
      scanQr: 'QR कोड स्क्यान गर्नुहोस्',
      emergencyInfo: 'आकस्मिक जानकारी',
      
      // Consent & Privacy
      consentRequired: 'सहमति आवश्यक',
      dataPrivacy: 'डेटा गोपनीयता',
      auditLog: 'लेखा परीक्षा लग',
      
      // System Messages
      patientNotFound: 'बिरामी फेला परेन',
      accessGranted: 'पहुँच प्रदान गरियो',
      accessDenied: 'पहुँच अस्वीकार गरियो',
      dataUpdated: 'डेटा सफलतापूर्वक अपडेट भयो',
      
      // Offline Mode
      offlineMode: 'अफलाइन मोड',
      syncPending: 'सिंक बाँकी',
      dataNotAvailable: 'डेटा अफलाइन उपलब्ध छैन'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
