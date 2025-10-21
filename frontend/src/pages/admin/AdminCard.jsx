import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';

const AdminCard = ({ admin, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-bold text-brand-primary flex-1 min-w-0 break-words">{admin.name}</h3>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => onEdit(admin)} className="text-brand-secondary hover:text-brand-primary transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(admin.id)} className="text-brand-secondary hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;