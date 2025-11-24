import React, { useState } from 'react';
import NumberScrollPicker from './NumberScrollPicker';
import { Button } from './ui/button';

const DateScrollPicker = ({ value, onChange, label = 'Data' }) => {
  const date = value ? new Date(value) : new Date();
  
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [year, setYear] = useState(date.getFullYear());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const handleDayChange = (newDay) => {
    const maxDays = getDaysInMonth(month, year);
    const validDay = Math.min(newDay, maxDays);
    setDay(validDay);
    updateDate(validDay, month, year);
  };

  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    const maxDays = getDaysInMonth(newMonth, year);
    const validDay = Math.min(day, maxDays);
    setDay(validDay);
    updateDate(validDay, newMonth, year);
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
    updateDate(day, month, newYear);
  };

  const updateDate = (d, m, y) => {
    const newDate = new Date(y, m - 1, d);
    onChange(newDate);
  };

  const currentYear = new Date().getFullYear();
  const maxDays = getDaysInMonth(month, year);

  return (
    <div>
      <label className="block text-sm font-medium mb-3">{label}</label>
      <div className="bg-[#1a1a1b] rounded-2xl p-6 border border-gray-800">
        <div className="grid grid-cols-3 gap-4">
          <NumberScrollPicker
            value={day}
            onChange={handleDayChange}
            min={1}
            max={maxDays}
            label="Dia"
          />
          
          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-400 mb-2">Mês</label>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => handleMonthChange(month === 12 ? 1 : month + 1)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 12L10 7L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
              
              <div className="text-lg font-bold my-1 px-2 py-2 text-center min-w-[100px]">
                {months[month - 1].substring(0, 3)}
              </div>
              
              <Button
                onClick={() => handleMonthChange(month === 1 ? 12 : month - 1)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 8L10 13L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </div>
          </div>
          
          <NumberScrollPicker
            value={year}
            onChange={handleYearChange}
            min={1900}
            max={currentYear}
            label="Ano"
          />
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
          Toque nos números para digitar diretamente
        </div>
      </div>
    </div>
  );
};

export default DateScrollPicker;