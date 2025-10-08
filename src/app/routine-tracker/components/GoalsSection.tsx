'use client';

import { useState } from 'react';

interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
}

interface PersonalGoal {
  id: string;
  type: 'reading' | 'gratitude' | 'learning';
  content: string;
}

export default function GoalsSection() {
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([
    { id: '1', text: 'X proje teklifini tamamla ve gönder.', completed: false },
    { id: '2', text: 'Spor salonuna git ve antrenman programını tamamla.', completed: false },
    { id: '3', text: 'Akşam ailemle kaliteli 1 saat geçir (telefonsuz).', completed: false }
  ]);

  const [personalGoals, setPersonalGoals] = useState<PersonalGoal[]>([
    { id: '1', type: 'reading', content: '"Şu Hortumlarda Kargalar Olurdu" kitabından 20 sayfa.' },
    { id: '2', type: 'gratitude', content: '1. Sağlığım, 2. Sevdiklerim, 3. Güneşli hava' },
    { id: '3', type: 'learning', content: 'Yeni bir İngilizce kelime: "Perseverance".' }
  ]);

  const addDailyGoal = () => {
    const newGoal: DailyGoal = {
      id: Date.now().toString(),
      text: '',
      completed: false
    };
    setDailyGoals([...dailyGoals, newGoal]);
  };

  const updateDailyGoal = (id: string, field: keyof DailyGoal, value: string | boolean) => {
    setDailyGoals(goals => 
      goals.map(goal => 
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    );
  };

  const removeDailyGoal = (id: string) => {
    setDailyGoals(goals => goals.filter(goal => goal.id !== id));
  };

  const addPersonalGoal = () => {
    const newGoal: PersonalGoal = {
      id: Date.now().toString(),
      type: 'reading',
      content: ''
    };
    setPersonalGoals([...personalGoals, newGoal]);
  };

  const updatePersonalGoal = (id: string, field: keyof PersonalGoal, value: string) => {
    setPersonalGoals(goals => 
      goals.map(goal => 
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    );
  };

  const removePersonalGoal = (id: string) => {
    setPersonalGoals(goals => goals.filter(goal => goal.id !== id));
  };

  const getPersonalGoalLabel = (type: string) => {
    switch (type) {
      case 'reading': return 'Bugün Okuyacağım:';
      case 'gratitude': return 'Bugün Şükür Edeceğim 3 Şey:';
      case 'learning': return 'Bugün Öğreneceğim:';
      default: return '';
    }
  };

  const completedGoalsCount = dailyGoals.filter(goal => goal.completed).length;
  const completionPercentage = dailyGoals.length > 0 ? Math.round((completedGoalsCount / dailyGoals.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Günlük 3 Ana Hedef */}
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Günlük 3 Ana Hedef (MIT'ler)
            </h2>
          </div>
          <button
            onClick={addDailyGoal}
            className="flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Hedef Ekle
          </button>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              İlerleme: {completedGoalsCount}/{dailyGoals.length}
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
          {dailyGoals.map((goal, index) => (
            <div key={goal.id} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={(e) => updateDailyGoal(goal.id, 'completed', e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="text"
                value={goal.text}
                onChange={(e) => updateDailyGoal(goal.id, 'text', e.target.value)}
                placeholder="Hedefinizi buraya yazın..."
                className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  goal.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              />
              <button
                onClick={() => removeDailyGoal(goal.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                title="Hedefi Sil"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Kişisel Gelişim & Minnettarlık Hedefleri */}
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kişisel Gelişim & Minnettarlık Hedefleri
            </h2>
          </div>
          <button
            onClick={addPersonalGoal}
            className="flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Hedef Ekle
          </button>
        </div>

        <div className="space-y-6">
          {personalGoals.map((goal) => (
            <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getPersonalGoalLabel(goal.type)}
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={goal.type}
                      onChange={(e) => updatePersonalGoal(goal.id, 'type', e.target.value as PersonalGoal['type'])}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="reading">Okuma</option>
                      <option value="gratitude">Minnettarlık</option>
                      <option value="learning">Öğrenme</option>
                    </select>
                    <input
                      type="text"
                      value={goal.content}
                      onChange={(e) => updatePersonalGoal(goal.id, 'content', e.target.value)}
                      placeholder="İçeriği buraya yazın..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => removePersonalGoal(goal.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="Hedefi Sil"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
