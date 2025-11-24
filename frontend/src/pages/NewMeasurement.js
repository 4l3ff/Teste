import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Calendar as CalendarIcon, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { addItem } from '../utils/db';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NewMeasurement = () => {
  const navigate = useNavigate();
  const { refreshData } = useApp();

  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [measurements, setMeasurements] = useState({
    weight: '',
    waist: '',
    chest: '',
    arm: '',
    leg: '',
    bodyFat: '',
    neck: '',
    shoulder: '',
    biceps: '',
    forearm: '',
    abdomen: '',
    hips: '',
    thigh: '',
    calf: '',
  });

  const updateMeasurement = (field, value) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveMeasurement = async () => {
    // Check if at least one measurement is filled
    const hasData = Object.values(measurements).some(val => val !== '');
    if (!hasData) {
      toast.error('Preencha pelo menos uma medição');
      return;
    }

    const measurement = {
      id: `measurement_${Date.now()}`,
      date: date.toISOString(),
      image,
      weight: parseFloat(measurements.weight) || null,
      waist: parseFloat(measurements.waist) || null,
      chest: parseFloat(measurements.chest) || null,
      arm: parseFloat(measurements.arm) || null,
      leg: parseFloat(measurements.leg) || null,
      bodyFat: parseFloat(measurements.bodyFat) || null,
      neck: parseFloat(measurements.neck) || null,
      shoulder: parseFloat(measurements.shoulder) || null,
      biceps: parseFloat(measurements.biceps) || null,
      forearm: parseFloat(measurements.forearm) || null,
      abdomen: parseFloat(measurements.abdomen) || null,
      hips: parseFloat(measurements.hips) || null,
      thigh: parseFloat(measurements.thigh) || null,
      calf: parseFloat(measurements.calf) || null,
      createdAt: new Date().toISOString(),
    };

    try {
      await addItem('measurements', measurement);
      await refreshData();
      toast.success('Medição registrada!');
      navigate('/perfil');
    } catch (error) {
      console.error('Error saving measurement:', error);
      toast.error('Erro ao salvar medição');
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
              Registrar Medições
            </h1>
            <Button
              onClick={saveMeasurement}
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="save-measurement-button"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Data</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-[#1a1a1b] border-gray-800"
                data-testid="date-picker-button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#1a1a1b] border-gray-800">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Progress Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Imagem do progresso</label>
          <div className="bg-[#1a1a1b] rounded-2xl p-6 border border-gray-800 text-center">
            {image ? (
              <div className="relative">
                <img src={image} alt="Progress" className="w-full h-48 object-cover rounded-lg" />
                <Button
                  onClick={() => setImage(null)}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  Remover
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Camera size={48} className="mx-auto mb-2 text-gray-600" />
                <p className="text-gray-400">Adicionar imagem</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-testid="image-upload-input"
                />
              </label>
            )}
          </div>
        </div>

        {/* Measurements */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Medições</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Peso Corporal (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.weight}
                  onChange={(e) => updateMeasurement('weight', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                  data-testid="weight-input"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Gordura Corporal (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.bodyFat}
                  onChange={(e) => updateMeasurement('bodyFat', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                  data-testid="bodyfat-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cintura (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.waist}
                  onChange={(e) => updateMeasurement('waist', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Peito (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.chest}
                  onChange={(e) => updateMeasurement('chest', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Braço (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.arm}
                  onChange={(e) => updateMeasurement('arm', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Perna (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.leg}
                  onChange={(e) => updateMeasurement('leg', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Pescoço (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.neck}
                  onChange={(e) => updateMeasurement('neck', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ombro (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.shoulder}
                  onChange={(e) => updateMeasurement('shoulder', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bíceps (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.biceps}
                  onChange={(e) => updateMeasurement('biceps', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Antebraço (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.forearm}
                  onChange={(e) => updateMeasurement('forearm', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Abdômen (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.abdomen}
                  onChange={(e) => updateMeasurement('abdomen', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Quadril (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.hips}
                  onChange={(e) => updateMeasurement('hips', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Coxa (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.thigh}
                  onChange={(e) => updateMeasurement('thigh', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Panturrilha (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={measurements.calf}
                  onChange={(e) => updateMeasurement('calf', e.target.value)}
                  className="bg-[#1a1a1b] border-gray-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMeasurement;