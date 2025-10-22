import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';
import { Star } from 'lucide-react';

const StudentPoints = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await api.get(`/students/${user.id}/points`);
        setPoints(response.data.points);
      } catch (err) {
        setError(t('studentPoints.errors.fetch'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPoints();
    }
  }, [user, t]);

  if (loading) {
    return <LoadingScreen fullScreen={false} />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold text-brand-primary mb-4">{t('studentPoints.title')}</h1>
      <div className="flex items-center text-5xl font-bold text-yellow-400">
        <Star className="w-12 h-12 mr-2" />
        {points}
      </div>
    </div>
  );
};

export default StudentPoints;