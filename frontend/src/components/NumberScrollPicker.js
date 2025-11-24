import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const NumberScrollPicker = ({ value, onChange, min, max, label, unit = '' }) => {
  const [isManual, setIsManual] = useState(false);
  const [manualValue, setManualValue] = useState(value?.toString() || '');

  const increment = () => {
    const newValue = Math.min((value || min) + 1, max);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max((value || min) - 1, min);
    onChange(newValue);
  };

  const handleManualSubmit = () => {
    const num = parseInt(manualValue);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
      setIsManual(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-xs text-gray-400 mb-2">{label}</label>
      
      {isManual ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            className="w-20 text-center bg-[#111] border-gray-700"
            autoFocus
          />
          <Button
            onClick={handleManualSubmit}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            OK
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Button
            onClick={increment}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
          >
            <ChevronUp size={20} />
          </Button>
          
          <button
            onClick={() => setIsManual(true)}
            className="text-3xl font-bold my-1 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {value || min}{unit}
          </button>
          
          <Button
            onClick={decrement}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
          >
            <ChevronDown size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NumberScrollPicker;