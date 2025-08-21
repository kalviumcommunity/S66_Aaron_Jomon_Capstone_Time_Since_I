// src/components/ActivityCard.js
import React, { useState } from 'react';

function ActivityCard({ activity, onMarkDone, onEdit, onDelete }) {
  const { name, description, lastDone, frequencyValue, frequencyUnit, frequency } = activity;
  const [isHovered, setIsHovered] = useState(false);

  const formatTimeSince = (date) => {
    if (!date) {
      const targetText = getTargetText();
      return `0/${targetText}`;
    }

    const now = new Date();
    const lastDoneDate = new Date(date);
    const diffMs = now - lastDoneDate;

    // Calculate difference in appropriate unit
    let diffValue;
    let diffUnit;

    if (frequencyUnit === 'hours') {
      diffValue = Math.floor(diffMs / (1000 * 60 * 60));
      diffUnit = 'h';
    } else if (frequencyUnit === 'days') {
      diffValue = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      diffUnit = 'd';
    } else if (frequencyUnit === 'weeks') {
      diffValue = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
      diffUnit = 'w';
    } else if (frequencyUnit === 'months') {
      diffValue = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
      diffUnit = 'm';
    } else if (frequencyUnit === 'years') {
      diffValue = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
      diffUnit = 'y';
    } else {
      // Fallback for old frequency format
      diffValue = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      diffUnit = 'd';
    }

    const targetText = getTargetText();
    return `${diffValue}${diffUnit}/${targetText}`;
  };

  const getTargetText = () => {
    if (frequencyValue && frequencyUnit) {
      const unitMap = {
        'hours': 'H',
        'days': 'D',
        'weeks': 'W',
        'months': 'M',
        'years': 'Y'
      };
      return `${frequencyValue}${unitMap[frequencyUnit]}`;
    }

    // Fallback for old frequency format
    if (frequency === 'weekly') return '7D';
    if (frequency === 'monthly') return '30D';
    return '1D';
  };

  return (
    <div
      className="activity-card"
      style={{
        background: isHovered ? 'rgba(139, 69, 255, 0.1)' : '#1a1a1a',
        borderRadius: '20px',
        padding: '25px',
        margin: '15px',
        boxShadow: isHovered ? '0 0 30px rgba(139, 69, 255, 0.3)' : 'none',
        border: isHovered ? '1px solid rgba(139, 69, 255, 0.3)' : '1px solid #333',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden action buttons that appear on hover */}
      <div
        className="card-actions"
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          display: 'flex',
          gap: '8px',
          opacity: '0',
          transition: 'opacity 0.3s ease'
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(activity);
          }}
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(139, 69, 255, 0.8)',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(activity);
          }}
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.8)',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      {/* Task Name and Description */}
      <div style={{ textAlign: 'center', marginBottom: '15px', paddingTop: '10px', flex: '1', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          margin: '0 0 12px 0',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600',
          lineHeight: '1.3'
        }}>
          {name}
        </h3>
        <div
          className="description-scroll"
          style={{
            color: '#9ca3af',
            fontSize: '14px',
            lineHeight: '1.4',
            height: '60px',
            display: 'flex',
            alignItems: description ? 'flex-start' : 'center',
            justifyContent: 'center',
            overflow: 'auto',
            padding: description ? '8px 0' : '0',
            textAlign: 'center',
            scrollbarWidth: 'thin',
            scrollbarColor: '#8b45ff #2a2a2a'
          }}
        >
          {description || ''}
        </div>
      </div>

      {/* Time Display and Done Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        padding: '12px 20px'
      }}>
        <span style={{
          color: '#9ca3af',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Time: {formatTimeSince(lastDone)}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkDone(activity);
          }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(139, 69, 255, 0.2)',
            color: '#8b45ff',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#8b45ff';
            e.target.style.color = 'white';
            e.target.style.boxShadow = '0 0 15px rgba(139, 69, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(139, 69, 255, 0.2)';
            e.target.style.color = '#8b45ff';
            e.target.style.boxShadow = 'none';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ActivityCard;
