import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Folder, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { addItem, deleteItem, updateItem } from '../utils/db';
import { toast } from 'sonner';

const Treino = () => {
  const { routines, folders, refreshData } = useApp();
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folderName, setFolderName] = useState('');

  const filteredRoutines = selectedFolder === 'all'
    ? routines
    : routines.filter(r => r.folderId === selectedFolder);

  const startQuickWorkout = () => {
    navigate('/treino/ativo', { state: { type: 'quick' } });
  };

  const openNewFolder = () => {
    setEditingFolder(null);
    setFolderName('');
    setShowFolderDialog(true);
  };

  const openEditFolder = (folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setShowFolderDialog(true);
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
      setShowFolderDialog(false);
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
        if (selectedFolder === folderId) {
          setSelectedFolder('all');
        }
        toast.success('Pasta excluída!');
      } catch (error) {
        console.error('Error deleting folder:', error);
        toast.error('Erro ao excluir pasta');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Treino
          </h1>
          <p className="text-gray-400">Comece um treino agora</p>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-1">Início Rápido</h2>
              <p className="text-blue-100 text-sm">Comece um treino vazio</p>
            </div>
            <Button
              onClick={startQuickWorkout}
              data-testid="quick-start-button"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-full w-14 h-14 p-0"
            >
              <Play size={24} fill="currentColor" />
            </Button>
          </div>
        </div>

        {/* Folders Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Pastas</h2>
            <Button
              onClick={openNewFolder}
              data-testid="create-folder-button"
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 rounded-full"
            >
              <Plus size={16} className="mr-1" />
              Nova Pasta
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedFolder === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#1a1a1b] text-gray-400 border border-gray-800'
              }`}
            >
              Todas
            </button>
            {folders.map((folder) => (
              <div key={folder.id} className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#1a1a1b] text-gray-400 border border-gray-800'
                  }`}
                >
                  {folder.name}
                </button>
                {selectedFolder === folder.id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditFolder(folder)}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteFolder(folder.id)}
                      className="p-1 text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Routines */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Rotinas</h2>
            <Button
              onClick={() => navigate('/rotina/nova')}
              data-testid="new-routine-button"
              className="bg-blue-500 hover:bg-blue-600 rounded-full"
              size="sm"
            >
              <Plus size={16} className="mr-1" />
              Nova Rotina
            </Button>
          </div>

          {filteredRoutines.length === 0 ? (
            <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center">
              <Folder size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Nenhuma rotina criada ainda</p>
              <p className="text-sm text-gray-500 mt-2">Crie sua primeira rotina de treino</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{routine.name}</h3>
                      {routine.exercises && routine.exercises.length > 0 && (
                        <>
                          <p className="text-sm text-gray-400 mb-2">
                            {routine.exercises.slice(0, 3).map(ex => ex.name).join(', ')}
                            {routine.exercises.length > 3 && '...'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {routine.exercises.length} exercícios
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/rotina/${routine.id}`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate('/treino/ativo', { state: { routine } })}
                      data-testid={`start-routine-${routine.id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-xl"
                    >
                      <Play size={16} className="mr-2" fill="currentColor" />
                      Iniciar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      {/* Folder Dialog */}
      <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
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
                placeholder="Ex: Push, Pull, Legs"
                className="bg-[#111] border-gray-700"
                data-testid="folder-name-input"
                onKeyPress={(e) => e.key === 'Enter' && saveFolder()}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowFolderDialog(false)}
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

export default Treino;