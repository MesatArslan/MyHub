'use client';

import { RoutineScheduleItem } from '@/types';

interface RoutineScheduleFormProps {
  selectedDay: string;
  unsavedItems: RoutineScheduleItem[];
  onUnsavedItemsChange: (items: RoutineScheduleItem[]) => void;
  onSaveItem: (item: RoutineScheduleItem) => void;
}

export default function RoutineScheduleForm({ selectedDay, unsavedItems, onUnsavedItemsChange, onSaveItem }: RoutineScheduleFormProps) {
  const updateScheduleItem = (id: string, field: keyof RoutineScheduleItem, value: string) => {
    const updatedItems = unsavedItems.map(item =>
      item.id === id ? { ...item, [field]: value, updatedAt: new Date() } : item
    );
    onUnsavedItemsChange(updatedItems);
  };

  const deleteScheduleItem = (id: string) => {
    const updatedItems = unsavedItems.filter(item => item.id !== id);
    onUnsavedItemsChange(updatedItems);
  };

  const saveScheduleItem = (item: RoutineScheduleItem) => {
    // Validate that required fields are filled
    if (!item.startTime || !item.endTime || !item.whatToDo || !item.whereToDo) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }
    
    // Save the item
    onSaveItem(item);
    
    // Remove from unsaved items
    const updatedItems = unsavedItems.filter(i => i.id !== item.id);
    onUnsavedItemsChange(updatedItems);
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl">
      <div className="space-y-4">
        {unsavedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Başlangıç Zamanı */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlangıç Zamanı
                </label>
                <input
                  type="time"
                  value={item.startTime}
                  onChange={(e) => updateScheduleItem(item.id, 'startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Bitiş Zamanı */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bitiş Zamanı
                </label>
                <input
                  type="time"
                  value={item.endTime}
                  onChange={(e) => updateScheduleItem(item.id, 'endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Ne Yapacağım */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ne Yapacağım
                </label>
                <input
                  type="text"
                  value={item.whatToDo}
                  onChange={(e) => updateScheduleItem(item.id, 'whatToDo', e.target.value)}
                  placeholder="Örn: Egzersiz yapmak, Ders çalışmak"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Nerede Yapacağım */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nerede Yapacağım
                </label>
                <input
                  type="text"
                  value={item.whereToDo}
                  onChange={(e) => updateScheduleItem(item.id, 'whereToDo', e.target.value)}
                  placeholder="Örn: Spor salonu, Ev, Kütüphane"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Kaydet Butonu */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={() => saveScheduleItem(item)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  title="Kaydet"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>

              {/* Sil Butonu */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={() => deleteScheduleItem(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="Rutin Öğesini Sil"
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

      {unsavedItems.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">Henüz rutin öğesi eklenmemiş</p>
          <p className="text-sm">&ldquo;Rutin Ekle&rdquo; butonuna tıklayarak başlayın</p>
        </div>
      )}
    </div>
  );
}

