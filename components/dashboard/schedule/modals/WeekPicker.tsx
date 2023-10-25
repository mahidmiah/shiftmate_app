'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { DayPicker, DayModifiers } from 'react-day-picker';
import useShiftStore from '@/store/shiftStore';

const getWeekDays = (weekStart: Date): Date[] => {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(
      moment(weekStart)
        .add(i, 'days')
        .toDate()
    );
  }
  return days;
}

const getWeekRange = (date: Date) => {
  return {
    from: moment(date)
      .startOf('isoWeek') 
      .toDate(),
    to: moment(date)
      .startOf('isoWeek')
      .add(4, 'days')
      .toDate(),
  };
}

export default function WeekPicker() {
  
  const [hoverRange, setHoverRange] = useState<{ from: Date; to: Date } | undefined>(undefined);

  // Store Vars
  const setSelectedDays = useShiftStore(state => state.setSelectedDays);
  const setCurrentWeek = useShiftStore(state => state.setCurrentWeek);
  const setCurrentYear = useShiftStore(state => state.setCurrentYear);
  const selectedDays = useShiftStore(state => state.selectedDays);
  const currentWeek = useShiftStore(state => state.currentWeek);
  const hideCalendar = useShiftStore(state => state.hideCalendar);

  const weekPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (weekPickerRef.current && !weekPickerRef.current.contains(e.target as Node)) {
        hideCalendar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleScroll = () => {
      hideCalendar();
    }
    const container = document.getElementById("children_container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const daysOfCurrentWeek = getWeekDays(getWeekRange(currentDate).from);
    setSelectedDays(daysOfCurrentWeek);
    setCurrentWeek(moment(currentDate).isoWeek());
    setCurrentYear(moment(currentDate).isoWeekYear());
  }, []);

  const handleDayChange = (date: Date) => {
    setSelectedDays(getWeekDays(getWeekRange(date).from));
    setCurrentWeek(moment(date).isoWeek());
    setCurrentYear(moment(date).isoWeekYear());
  };

  const handleDayEnter = (date: Date) => {
    setHoverRange(getWeekRange(date));
  };

  const handleDayLeave = () => {
    setHoverRange(undefined);
  };

  const daysAreSelected = selectedDays.length > 0;

  const modifiers = {
    hoverRange,
    selectedRange: daysAreSelected && {
      from: selectedDays[0],
      to: selectedDays[4],
    },
    hoverRangeStart: hoverRange && hoverRange.from,
    hoverRangeEnd: hoverRange && hoverRange.to,
    selectedRangeStart: daysAreSelected && selectedDays[0],
    selectedRangeEnd: daysAreSelected && selectedDays[4],
  } as DayModifiers;

  return (
    <div 
      className="widget_bg border widget_border section_text text-sm shadow-md p-3 w-fit rounded-md"
      ref={weekPickerRef}
    >
      <DayPicker
        ISOWeek
        selected={selectedDays}
        showWeekNumber
        showOutsideDays
        modifiers={modifiers}
        onDayClick={handleDayChange}
        onDayMouseEnter={handleDayEnter}
        onDayMouseLeave={handleDayLeave}
        formatters={{
          formatWeekNumber: (weekNumber) => `WK${weekNumber}`
        }}
      />
      {selectedDays.length === 7 && (
        <div>
          {moment(selectedDays[0]).format('LL')} 
          {' - '}
          {moment(selectedDays[4]).format('LL')}
        </div>
      )}
      Week: {currentWeek}
    </div>
  );
}
