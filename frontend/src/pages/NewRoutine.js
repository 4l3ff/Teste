import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ArrowLeft, Plus, Trash2, GripVertical, Link2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { addItem, updateItem, getItem } from '../utils/db';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const SUPERSET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
];

const NewRoutine = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { folders, exercises: exerciseLibrary, refreshData } = useApp();
  const [isEditing] = useState(!!id);

  const [name, setName] = useState('');
  const [folderId, setFolderId] = useState('none');
  const [exercises, setExercises] = useState([]);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [showSupersetDialog, setShowSupersetDialog] = useState(false);
  const [currentExerciseForSuperset, setCurrentExerciseForSuperset] = useState(null);
  const [supersets, setSupersets] = useState([]);

  useEffect(() => {
    if (id) {
      loadRoutine();
    }
  }, [id]);

  const loadRoutine = async () => {
    try {
      const routine = await getItem('routines', id);
      if (routine) {
        setName(routine.name);
        setFolderId(routine.folderId || 'none');
        setExercises(routine.exercises || []);
        setSupersets(routine.supersets || []);
      }
    } catch (error) {
      console.error('Error loading routine:', error);
      toast.error('Erro ao carregar rotina');
    }
  };

  const addExerciseFromLibrary = (exercise) => {
    const newExercise = {
      ...exercise,
      exerciseId: exercise.id,
      id: `exercise_${Date.now()}_${Math.random()}`,
      sets: Array(3).fill(null).map(() => ({
        weight: 0,
        reps: 0,
        completed: false,
      })),
      restTime: 60,
      note: '',
      supersetId: null,
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseDialog(false);
  };

  const removeExercise = (index) => {
    const exercise = exercises[index];
    
    // Remove from superset if applicable
    if (exercise.supersetId) {
      const superset = supersets.find(s => s.id === exercise.supersetId);
      if (superset) {
        const newExerciseIds = superset.exerciseIds.filter(eid => eid !== exercise.id);
        if (newExerciseIds.length <= 1) {
          // Remove superset if only 1 exercise left
          setSupersets(supersets.filter(s => s.id !== exercise.supersetId));
          // Clear supersetId from remaining exercise
          setExercises(exercises.map(ex => 
            newExerciseIds.includes(ex.id) ? { ...ex, supersetId: null } : ex
          ));
        } else {
          setSupersets(supersets.map(s => 
            s.id === exercise.supersetId ? { ...s, exerciseIds: newExerciseIds } : s
          ));
        }
      }
    }
    
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const updateSet = (exerciseIndex, field, value) => {
    const newExercises = [...exercises];
    const setsCount = parseInt(value) || 3;
    newExercises[exerciseIndex].sets = Array(setsCount).fill(null).map((_, i) => 
      newExercises[exerciseIndex].sets[i] || { weight: 0, reps: 0, completed: false }
    );
    setExercises(newExercises);
  };

  const openSupersetDialog = (exerciseIndex) => {
    setCurrentExerciseForSuperset(exerciseIndex);
    setShowSupersetDialog(true);
  };

  const createSuperset = (targetExerciseIndex) => {
    if (currentExerciseForSuperset === null) return;
    
    const exercise1 = exercises[currentExerciseForSuperset];
    const exercise2 = exercises[targetExerciseIndex];

    // Check if either exercise is already in a superset
    const existingSuperset1 = supersets.find(s => s.exerciseIds.includes(exercise1.id));
    const existingSuperset2 = supersets.find(s => s.exerciseIds.includes(exercise2.id));

    if (existingSuperset1 && existingSuperset2 && existingSuperset1.id === existingSuperset2.id) {
      toast.error('Exercícios já estão no mesmo superset');
      setShowSupersetDialog(false);
      return;
    }

    let newSupersets = [...supersets];
    let newExercises = [...exercises];

    if (existingSuperset1) {
      // Add exercise2 to existing superset
      newSupersets = newSupersets.map(s => 
        s.id === existingSuperset1.id 
          ? { ...s, exerciseIds: [...s.exerciseIds, exercise2.id] }
          : s
      );
      newExercises[targetExerciseIndex].supersetId = existingSuperset1.id;
    } else if (existingSuperset2) {
      // Add exercise1 to existing superset
      newSupersets = newSupersets.map(s => 
        s.id === existingSuperset2.id 
          ? { ...s, exerciseIds: [...s.exerciseIds, exercise1.id] }
          : s
      );
      newExercises[currentExerciseForSuperset].supersetId = existingSuperset2.id;
    } else {
      // Create new superset
      const newSupersetId = `superset_${Date.now()}`;
      const colorIndex = supersets.length % SUPERSET_COLORS.length;
      
      newSupersets.push({
        id: newSupersetId,
        exerciseIds: [exercise1.id, exercise2.id],
        color: SUPERSET_COLORS[colorIndex],
      });

      newExercises[currentExerciseForSuperset].supersetId = newSupersetId;
      newExercises[targetExerciseIndex].supersetId = newSupersetId;
    }

    setSupersets(newSupersets);
    setExercises(newExercises);
    setShowSupersetDialog(false);
    toast.success('Superset criado!');
  };

  const getSupersetColor = (exerciseId) => {
    const superset = supersets.find(s => s.exerciseIds.includes(exerciseId));
    return superset?.color || null;
  };

  const saveRoutine = async () => {
    if (!name.trim()) {
      toast.error('Digite um nome para a rotina');
      return;
    }

    const routine = {
      id: isEditing ? id : `routine_${Date.now()}`,
      name: name.trim(),
      folderId: folderId === 'none' ? null : folderId,
      exercises: exercises,
      supersets: supersets,
      createdAt: isEditing ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        await updateItem('routines', routine);
        toast.success('Rotina atualizada!');
      } else {
        await addItem('routines', routine);
        toast.success('Rotina criada!');
      }
      await refreshData();
      navigate('/treino');
    } catch (error) {
      console.error('Error saving routine:', error);
      toast.error('Erro ao salvar rotina');
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
              {isEditing ? 'Editar Rotina' : 'Nova Rotina'}
            </h1>
            <Button
              onClick={saveRoutine}
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="save-routine-button"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Rotina</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Push Day, Upper Body"
              className="bg-[#1a1a1b] border-gray-800"
              data-testid="routine-name-input"
            />
          </div>

          {folders.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Pasta (Opcional)</label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full bg-[#1a1a1b] border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                data-testid="folder-select"
              >
                <option value="none">Nenhuma pasta</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Exercises */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Exercícios</h2>

          {exercises.length === 0 ? (
            <div className="bg-[#1a1a1b] rounded-2xl p-8 border border-gray-800 text-center mb-4">
              <p className="text-gray-400 mb-4">Nenhum exercício adicionado</p>
              <Button
                onClick={() => setShowExerciseDialog(true)}
                className="bg-blue-500 hover:bg-blue-600"
                data-testid="add-exercise-button"
              >
                <Plus size={20} className="mr-2" />
                Adicionar Exercício
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {exercises.map((exercise, index) => {
                  const supersetColor = getSupersetColor(exercise.id);
                  
                  return (
                    <div
                      key={exercise.id}
                      className="bg-[#1a1a1b] rounded-2xl p-4 border border-gray-800"
                      style={supersetColor ? { borderLeft: `4px solid ${supersetColor}` } : {}}
                    >
                      <div className="flex items-start gap-3">
                        <GripVertical size={20} className="text-gray-600 mt-1" />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{exercise.name}</h3>
                              {supersetColor && (
                                <div 
                                  className="px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1"
                                  style={{ backgroundColor: `${supersetColor}33`, color: supersetColor }}
                                >
                                  <Link2 size={12} />
                                  Superset
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={() => removeExercise(index)}
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 -mt-1"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Input
                              value={exercise.note || ''}
                              onChange={(e) => updateExercise(index, 'note', e.target.value)}
                              placeholder="Nota do exercício (opcional)"
                              className="bg-[#111] border-gray-700 text-sm"
                            />
                            
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Séries</label>
                                <Input
                                  type="number"
                                  value={exercise.sets?.length || 3}
                                  onChange={(e) => updateSet(index, 'sets', e.target.value)}
                                  className="bg-[#111] border-gray-700 text-sm"
                                  min="1"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">KG Inicial</label>
                                <Input
                                  type="number"
                                  value={exercise.sets[0]?.weight || 0}
                                  onChange={(e) => {
                                    const newExercises = [...exercises];
                                    newExercises[index].sets[0].weight = parseFloat(e.target.value) || 0;
                                    setExercises(newExercises);
                                  }}
                                  className="bg-[#111] border-gray-700 text-sm"
                                  step="0.5"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Reps Inicial</label>
                                <Input
                                  type="number"
                                  value={exercise.sets[0]?.reps || 0}
                                  onChange={(e) => {
                                    const newExercises = [...exercises];
                                    newExercises[index].sets[0].reps = parseInt(e.target.value) || 0;
                                    setExercises(newExercises);
                                  }}
                                  className="bg-[#111] border-gray-700 text-sm"
                                  min="1"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Descanso (segundos)</label>
                              <Input
                                type="number"
                                value={exercise.restTime || 60}
                                onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value) || 60)}
                                className="bg-[#111] border-gray-700 text-sm"
                                min="0"
                              />
                            </div>

                            <Button
                              onClick={() => openSupersetDialog(index)}
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                            >
                              <Link2 size={14} className="mr-2" />
                              {exercise.supersetId ? 'Gerenciar Superset' : 'Adicionar Superset'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={() => setShowExerciseDialog(true)}
                variant="outline"
                className="w-full"
                data-testid="add-another-exercise-button"
              >
                <Plus size={20} className="mr-2" />
                Adicionar Exercício
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Exercise Library Dialog */}
      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent className="bg-[#1a1a1b] border-gray-800 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selecionar Exercício</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-4">
            {exerciseLibrary.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Nenhum exercício cadastrado. Crie um exercício primeiro.
              </p>
            ) : (
              exerciseLibrary.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => addExerciseFromLibrary(exercise)}
                  className="p-4 bg-[#111] rounded-xl border border-gray-800 hover:border-gray-700 cursor-pointer transition-colors"
                >
                  <h3 className="font-semibold">{exercise.name}</h3>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Superset Dialog */}
      <Dialog open={showSupersetDialog} onOpenChange={setShowSupersetDialog}>
        <DialogContent className="bg-[#1a1a1b] border-gray-800">
          <DialogHeader>
            <DialogTitle>Vincular com Superset</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-4">
            <p className="text-sm text-gray-400 mb-4">
              Selecione o exercício que deseja vincular:
            </p>
            {exercises.map((exercise, index) => {
              if (index === currentExerciseForSuperset) return null;
              
              return (
                <div
                  key={exercise.id}
                  onClick={() => createSuperset(index)}
                  className="p-4 bg-[#111] rounded-xl border border-gray-800 hover:border-blue-500 cursor-pointer transition-colors"
                >
                  <h3 className="font-semibold">{exercise.name}</h3>
                  {exercise.supersetId && (
                    <p className="text-xs text-gray-500 mt-1">Já em superset</p>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewRoutine;