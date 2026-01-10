import { PasswordResponseDto } from '@/dto';
import { CustomCategory } from '@/types';
import PasswordCard from './PasswordCard';

interface PasswordListProps {
  passwords: PasswordResponseDto[];
  customCategories: CustomCategory[];
  showPassword: { [key: string]: boolean };
  searchTerm: string;
  loading: boolean;
  onTogglePasswordVisibility: (id: string) => void;
  onToggleFavorite: (password: PasswordResponseDto) => void;
  onEdit: (password: PasswordResponseDto) => void;
  onDelete: (password: PasswordResponseDto) => void;
  onDetail: (password: PasswordResponseDto) => void;
  onCopyToClipboard: (text: string) => void;
}

export default function PasswordList({
  passwords,
  customCategories,
  showPassword,
  searchTerm,
  loading,
  onTogglePasswordVisibility,
  onToggleFavorite,
  onEdit,
  onDelete,
  onDetail,
  onCopyToClipboard,
}: PasswordListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Şifreler yükleniyor...</p>
      </div>
    );
  }

  if (passwords.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {searchTerm ? 'Arama kriterlerinize uygun şifre bulunamadı' : 'Henüz şifre eklenmemiş'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {passwords.map((password) => (
        <PasswordCard
          key={password.id}
          password={password}
          customCategories={customCategories}
          showPassword={showPassword}
          onTogglePasswordVisibility={onTogglePasswordVisibility}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
          onDetail={onDetail}
          onCopyToClipboard={onCopyToClipboard}
        />
      ))}
    </div>
  );
}

