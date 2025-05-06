import React from 'react';
import { useApp } from '../contexts/AppContext';
import EmployeeView from '../pages/EmployeeView';
import ApproverView from '../pages/ApproverView';

interface RouterProps {
  currentView: string;
}

const Router: React.FC<RouterProps> = ({ currentView }) => {
  const { userRole } = useApp();

  if (userRole === 'pegawai') {
    return <EmployeeView currentView={currentView} />;
  }

  return <ApproverView currentView={currentView} />;
};

export default Router;