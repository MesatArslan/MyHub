import { PasswordResponseDto } from '@/dto';

interface DeleteConfirmModalProps {
  password: PasswordResponseDto;
  onConfirm: (id: string) => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ password, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Şifreyi Sil</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Bu işlem geri alınamaz</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            <span className="font-semibold">{password.appName}</span> şifresini silmek istediğinizden emin misiniz?
          </p>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Kullanıcı Adı:</p>
            <p className="text-slate-900 dark:text-white font-mono">{password.username}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-medium text-sm"
          >
            İptal
          </button>
          <button
            onClick={() => onConfirm(password.id)}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

