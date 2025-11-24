import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { exportAllData, importAllData, clearAllData } from '../utils/db';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const { refreshData } = useApp();

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dreamer_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup exportado com sucesso!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          await importAllData(data);
          await refreshData();
          toast.success('Backup importado com sucesso!');
        } catch (error) {
          console.error('Error importing data:', error);
          toast.error('Erro ao importar dados');
        }
      }
    };
    input.click();
  };

  const handleClearData = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      try {
        await clearAllData();
        await refreshData();
        toast.success('Dados limpos com sucesso!');
      } catch (error) {
        console.error('Error clearing data:', error);
        toast.error('Erro ao limpar dados');
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
              onClick={() => navigate('/perfil')}
              variant="ghost"
              size="icon"
              data-testid="back-button"
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Configurações
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pt-6">
        <p className="text-gray-400 mb-6">Gerencie seus dados</p>

        {/* Backup & Restore */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Backup & Restauração</h2>
          <div className="space-y-3">
            <div className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800">
              <div className="flex items-start gap-3 mb-3">
                <Download size={24} className="text-blue-500 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Exportar Backup</h3>
                  <p className="text-sm text-gray-400">
                    Salve todos os seus dados em um arquivo JSON
                  </p>
                </div>
              </div>
              <Button
                onClick={handleExport}
                className="w-full bg-blue-500 hover:bg-blue-600"
                data-testid="export-button"
              >
                <Download size={16} className="mr-2" />
                Exportar Dados
              </Button>
            </div>

            <div className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800">
              <div className="flex items-start gap-3 mb-3">
                <Upload size={24} className="text-green-500 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Importar Backup</h3>
                  <p className="text-sm text-gray-400">
                    Restaure seus dados de um arquivo de backup
                  </p>
                </div>
              </div>
              <Button
                onClick={handleImport}
                variant="outline"
                className="w-full"
                data-testid="import-button"
              >
                <Upload size={16} className="mr-2" />
                Importar Dados
              </Button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Gerenciamento de Dados</h2>
          <div className="bg-[#1a1a1b] rounded-2xl p-5 border border-red-900/30">
            <div className="flex items-start gap-3 mb-3">
              <Trash2 size={24} className="text-red-500 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-red-500">Limpar Todos os Dados</h3>
                <p className="text-sm text-gray-400">
                  Remove permanentemente todos os treinos, rotinas e medições
                </p>
              </div>
            </div>
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="w-full"
              data-testid="clear-data-button"
            >
              <Trash2 size={16} className="mr-2" />
              Limpar Dados
            </Button>
          </div>
        </div>

        {/* About */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Sobre</h2>
          <div className="bg-[#1a1a1b] rounded-2xl p-5 border border-gray-800">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-2xl font-bold">D</span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Dreamer
              </h3>
              <p className="text-sm text-gray-400 mb-4">Seu companheiro de treinos offline</p>
              <div className="border-t border-gray-800 pt-4">
                <p className="text-sm text-gray-400 mb-2">By TechnoSerp</p>
                <a
                  href="https://linktr.ee/technoserp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm"
                >
                  linktr.ee/technoserp
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;