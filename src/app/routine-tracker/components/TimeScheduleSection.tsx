'use client';

import { useState } from 'react';

interface RoutineBlock {
  id: string;
  time: string;
  title: string;
  description: string;
}

export default function TimeScheduleSection() {
  const [routineBlocks, setRoutineBlocks] = useState<RoutineBlock[]>([
    {
      id: '1',
      time: '07:00',
      title: 'Uyanma & Zihin Hazırlığı',
      description: '- Yataktan kalk, yatak topla\n- 1 bardak su iç\n- 5 dakika derin nefes'
    },
    {
      id: '2',
      time: '08:00',
      title: 'Kahvaltı & Güne Hazırlık',
      description: '- Sağlıklı bir kahvaltı yap\n- Haberleri hızlıca gözden geçir'
    },
    {
      id: '3',
      time: '09:00',
      title: 'Odak Çalışması - Proje A',
      description: '- Telefonu sessize al\n- Bugünkü 3 ana görevi belirle\n- En zor göreve başla'
    },
    {
      id: '4',
      time: '11:00',
      title: 'Kısa Mola',
      description: '- Gözleri dinlendir\n- Kısa bir yürüyüş yap\n- Su iç'
    }
  ]);

  const addRoutineBlock = () => {
    const newBlock: RoutineBlock = {
      id: Date.now().toString(),
      time: '12:00',
      title: '',
      description: ''
    };
    setRoutineBlocks([...routineBlocks, newBlock]);
  };

  const updateRoutineBlock = (id: string, field: keyof RoutineBlock, value: string) => {
    setRoutineBlocks(blocks => 
      blocks.map(block => 
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  const removeRoutineBlock = (id: string) => {
    setRoutineBlocks(blocks => blocks.filter(block => block.id !== id));
  };

  return (
    <div className="glass rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-3 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Zaman Çizelgesi
        </h2>
        <button
          onClick={addRoutineBlock}
          className="flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Rutin Ekle
        </button>
      </div>

      <div className="space-y-6">
        {routineBlocks.map((block, index) => (
          <div key={block.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Zaman */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zaman
                </label>
                <input
                  type="time"
                  value={block.time}
                  onChange={(e) => updateRoutineBlock(block.id, 'time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Etkinlik Başlığı */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Etkinlik Başlığı
                </label>
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => updateRoutineBlock(block.id, 'title', e.target.value)}
                  placeholder="Örn: Sabah Egzersizi, Kahvaltı, Önemli Proje Çalışması"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Ayrıntılı Açıklama */}
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ayrıntılı Açıklama
                </label>
                <textarea
                  value={block.description}
                  onChange={(e) => updateRoutineBlock(block.id, 'description', e.target.value)}
                  placeholder="Detayları buraya yazın..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Sil Butonu */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={() => removeRoutineBlock(block.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="Rutin Bloğunu Sil"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {routineBlocks.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">Henüz rutin bloğu eklenmemiş</p>
          <p className="text-sm">"Rutin Ekle" butonuna tıklayarak başlayın</p>
        </div>
      )}
    </div>
  );
}
