import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Plus, Edit, Trash2, Folder } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { addItem, updateItem, deleteItem } from '../utils/db';
import { toast } from 'sonner';

const FolderManagement = () => {
  const navigate = useNavigate();
  const { folders, refreshData } = useApp();

  const [showDialog, setShowDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folderName, setFolderName] = useState('');

  const openNewFolder = () => {
    setEditingFolder(null);
    setFolderName('');
    setShowDialog(true);
  };

  const openEditFolder = (folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setShowDialog(true);
  };

  const saveFolder = async () => {
    if (!folderName.trim()) {
      toast.error('Digite um nome para a pasta');
      return;
    }

    try {
      if (editingFolder) {
        await updateItem('folders', {
          ...editingFolder,
          name: folderName.trim(),
        });
        toast.success('Pasta atualizada!');
      } else {
        await addItem('folders', {
          id: `folder_${Date.now()}`,
          name: folderName.trim(),
          createdAt: new Date().toISOString(),
        });
        toast.success('Pasta criada!');
      }
      await refreshData();
      setShowDialog(false);
    } catch (error) {
      console.error('Error saving folder:', error);
      toast.error('Erro ao salvar pasta');
    }
  };

  const deleteFolder = async (folderId) => {
    if (window.confirm('Tem certeza que deseja excluir esta pasta? As rotinas não serão excluídas.')) {
      try {
        await deleteItem('folders', folderId);
        await refreshData();
        toast.success('Pasta excluída!');
      } catch (error) {
        console.error('Error deleting folder:', error);
        toast.error('Erro ao excluir pasta');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0b] border-b border-gray-800 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/treino')}
              variant="ghost"
              size="icon"
              data-testid="back-button"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Gerenciar Pastas
            </h1>
            <Button
              onClick={openNewFolder}
              variant="ghost"
              size="icon"
              data-testid="new-folder-button"
            >
              <Plus size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Folder List */}
      <div className="max-w-md mx-auto px-4 pt-6">
        {folders.length === 0 ? (
          <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center">
            <Folder size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">Nenhuma pasta criada</p>
            <Button
              onClick={openNewFolder}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus size={20} className="mr-2" />
              Criar Pasta
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Folder size={24} className="text-blue-500" />
                  <h3 className="font-semibold">{folder.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditFolder(folder)}
                    variant="ghost"
                    size="icon"
                    data-testid={`edit-folder-${folder.id}`}
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    onClick={() => deleteFolder(folder.id)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    data-testid={`delete-folder-${folder.id}`}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Folder Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#1a1a1b] border-gray-800">
          <DialogHeader>
            <DialogTitle>{editingFolder ? 'Editar Pasta' : 'Nova Pasta'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Pasta</label>
              <Input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Ex: Upper Body, Push, Pull"
                className="bg-[#111] border-gray-700"
                data-testid="folder-name-input"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={saveFolder}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                data-testid="save-folder-button"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderManagement;