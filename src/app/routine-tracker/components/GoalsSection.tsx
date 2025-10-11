'use client';

import { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage.service';
import { Goal } from '@/types';

export default function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load goals from storage on component mount
  useEffect(() => {
    const savedGoals = StorageService.getGoals();
    setGoals(savedGoals);
  }, []);

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      text: '',
      completed: false,
      type: 'daily',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    StorageService.saveGoals(updatedGoals);
  };

  const updateGoal = (id: string, field: keyof Goal, value: string | boolean) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value, updatedAt: new Date() } : goal
    );
    setGoals(updatedGoals);
    StorageService.saveGoals(updatedGoals);
  };

  const removeGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    StorageService.saveGoals(updatedGoals);
  };

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Günlük';
      case 'weekly': return 'Haftalık';
      case 'monthly': return 'Aylık';
      case 'yearly': return 'Yıllık';
      case 'custom': return 'Özel Tarih';
      default: return '';
    }
  };

  const completedGoalsCount = goals.filter(goal => goal.completed).length;
  const completionPercentage = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  return (
    <div className="glass rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-3 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hedeflerim
          </h2>
        </div>
        <button
          onClick={addGoal}
          className="flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Hedef Ekle
        </button>
      </div>

      {/* Genel İlerleme Çubuğu */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Genel İlerleme: {completedGoalsCount}/{goals.length}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            %{completionPercentage}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={(e) => updateGoal(goal.id, 'completed', e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={goal.text}
                  onChange={(e) => updateGoal(goal.id, 'text', e.target.value)}
                  placeholder="Hedefinizi buraya yazın..."
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    goal.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                  }`}
                />
                
                {/* Hedef Türü Seçimi */}
                <div className="flex items-center space-x-3">
                  <select
                    value={goal.type}
                    onChange={(e) => updateGoal(goal.id, 'type', e.target.value as Goal['type'])}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                    <option value="yearly">Yıllık</option>
                    <option value="custom">Özel Tarih</option>
                  </select>
                  
                  {goal.type === 'custom' && (
                    <input
                      type="date"
                      value={goal.customDate || ''}
                      onChange={(e) => updateGoal(goal.id, 'customDate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                  
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {getGoalTypeLabel(goal.type)}
                    {goal.type === 'custom' && goal.customDate && ` - ${new Date(goal.customDate).toLocaleDateString('tr-TR')}`}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => removeGoal(goal.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                title="Hedefi Sil"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">Henüz hedef eklenmemiş</p>
          <p className="text-sm">&ldquo;Hedef Ekle&rdquo; butonuna tıklayarak başlayın</p>
        </div>
      )}
    </div>
  );
}
