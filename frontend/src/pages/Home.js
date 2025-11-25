import React, { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { calculateCalories, formatDuration, formatDate } from '../utils/calculations';
import { Flame, Clock, Dumbbell, TrendingUp } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';

const Home = () => {
  const { workouts, userProfile } = useApp();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('7dias');

  const periods = [
    { id: '7dias', label: '7 dias', days: 7 },
    { id: '30dias', label: '30 dias', days: 30 },
    { id: '3meses', label: '3 meses', days: 90 },
    { id: '6meses', label: '6 meses', days: 180 },
    { id: '12meses', label: '12 meses', days: 365 },
  ];

  const currentPeriod = periods.find(p => p.id === selectedPeriod) || periods[0];

  const periodStats = useMemo(() => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - currentPeriod.days);
    
    const recentWorkouts = workouts.filter(w => new Date(w.date) >= daysAgo);
    
    let totalMinutes = 0;
    let totalCalories = 0;
    let totalVolume = 0;
    
    recentWorkouts.forEach(workout => {
      totalMinutes += workout.duration || 0;
      totalCalories += workout.calories || 0;
      totalVolume += workout.volume || 0;
    });
    
    return {
      workoutCount: recentWorkouts.length,
      totalMinutes,
      totalCalories,
      totalVolume,
    };
  }, [workouts, currentPeriod]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Olá, {userProfile?.name || 'Usuário'}!
          </h1>
          <p className="text-gray-400">Acompanhe seu progresso</p>
        </div>

        {/* Period Stats */}
        <div className="bg-[#1a1a1b] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Período</h2>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-sm appearance-none cursor-pointer border border-blue-500/30 pr-8"
                style={{ minWidth: '120px' }}
              >
                {periods.map(period => (
                  <option key={period.id} value={period.id} className="bg-[#1a1a1b] text-white">
                    {period.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell size={20} className="text-blue-500" />
                <span className="text-sm text-gray-400">Treinos</span>
              </div>
              <p className="text-2xl font-bold">{periodStats.workoutCount}</p>
            </div>

            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} className="text-orange-500" />
                <span className="text-sm text-gray-400">Calorias</span>
              </div>
              <p className="text-2xl font-bold">{periodStats.totalCalories}</p>
            </div>

            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-purple-500" />
                <span className="text-sm text-gray-400">Minutos</span>
              </div>
              <p className="text-2xl font-bold">{periodStats.totalMinutes}</p>
            </div>

            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-500" />
                <span className="text-sm text-gray-400">Volume</span>
              </div>
              <p className="text-2xl font-bold">{periodStats.totalVolume} kg</p>
            </div>
          </div>
        </div>

        {/* Workout History */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Histórico de Treinos
          </h2>

          {workouts.length === 0 ? (
            <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center">
              <Dumbbell size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Nenhum treino registrado ainda</p>
              <p className="text-sm text-gray-500 mt-2">Comece seu primeiro treino na aba Treino</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => navigate(`/treino/${workout.id}`)}
                  data-testid={`workout-card-${workout.id}`}
                  className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{workout.name}</h3>
                    <span className="text-sm text-gray-400">{formatDate(workout.date)}</span>
                  </div>

                  <div className="flex gap-4 mb-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDuration(workout.duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={14} />
                      {workout.calories} cal
                    </span>
                    <span>{workout.exerciseCount} exercícios</span>
                  </div>

                  <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg inline-block text-sm font-semibold">
                    {workout.volume} kg
                  </div>

                  {workout.exercises && workout.exercises.length > 0 && (
                    <div className="mt-3 text-sm text-gray-500">
                      {workout.exercises.slice(0, 3).map(ex => ex.name).join(', ')}
                      {workout.exercises.length > 3 && '...'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;