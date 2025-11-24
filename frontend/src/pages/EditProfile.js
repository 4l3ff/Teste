import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DateScrollPicker from '../components/DateScrollPicker';
import { updateItem } from '../utils/db';
import { toast } from 'sonner';

const EditProfile = () => {
  const navigate = useNavigate();
  const { userProfile, refreshData } = useApp();

  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setWeight(userProfile.weight?.toString() || '');
      setHeight(userProfile.height?.toString() || '');
      setBirthDate(userProfile.birthDate ? new Date(userProfile.birthDate) : null);
      setPhoto(userProfile.photo || null);
    }
  }, [userProfile]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) {
      toast.error('Digite seu nome');
      return;
    }

    const updatedProfile = {
      id: 'main',
      name: name.trim(),
      weight: parseFloat(weight) || 70,
      height: parseFloat(height) || 170,
      birthDate: birthDate ? birthDate.toISOString() : null,
      photo,
    };

    try {
      await updateItem('userProfile', updatedProfile);
      await refreshData();
      toast.success('Perfil atualizado!');
      navigate('/perfil');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erro ao salvar perfil');
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
              Editar Perfil
            </h1>
            <Button
              onClick={saveProfile}
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="save-profile-button"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold border-4 border-blue-500">
                {name.charAt(0) || 'U'}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
              <Camera size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                data-testid="photo-upload-input"
              />
            </label>
          </div>
          <p className="text-sm text-gray-400">Toque no ícone para alterar a foto</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="bg-[#1a1a1b] border-gray-800"
              data-testid="name-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Peso (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="bg-[#1a1a1b] border-gray-800"
                data-testid="weight-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Altura (cm)</label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                className="bg-[#1a1a1b] border-gray-800"
                data-testid="height-input"
              />
            </div>
          </div>

          <DateScrollPicker
            value={birthDate}
            onChange={setBirthDate}
            label="Data de Nascimento"
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;